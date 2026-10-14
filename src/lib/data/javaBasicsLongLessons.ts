import type { LongLesson } from './longLessons';

export const JAVA_BASICS_LONG_LESSONS: LongLesson[] = [
  {
    day: 1,
    title: 'JVM Architecture, Stack vs Heap Memory & Object-Oriented Invariants',
    goal: 'Master enterprise Java systems engineering: the Java Virtual Machine (JVM) execution lifecycle, Stack vs Heap memory layout, garbage collection generations, encapsulation invariants, and modern virtual threads.',
    minutes: 32,
    recap: 'Welcome to Enterprise Java 21 & JVM Systems Architecture. Today we master the world’s most widely deployed enterprise backend computing platform.',
    parts: [
      {
        title: 'JVM Architecture: ClassLoader, Bytecode & JIT Compilation',
        say: [
          'Java achieves write-once, run-anywhere portability through the Java Virtual Machine (JVM).',
          'When you compile Java source code with javac, it does not produce native x86 machine instructions.',
          'Instead, it outputs platform-independent Java Bytecode stored in .class files.',
          'When the program executes, the JVM ClassLoader loads the bytecode into memory and verifies its type-safety invariants.',
          'The JVM execution engine starts in interpreted mode for instant startup, but continuously profiles running methods.',
          'Methods that execute repeatedly (hot spots) are compiled on the fly into hyper-optimized native machine code by the Just-In-Time (JIT) C2 compiler, delivering near-C++ runtime throughput.'
        ],
        example: 'Like an author writing a book in a universal musical notation (bytecode). Any skilled pianist (a JVM installed on Windows, Mac, or Linux) can read the exact same notation and play the music perfectly on their own piano.',
        code: `// JVM Execution Pipeline & Bytecode Verification Simulation
class JvmPipelineSimulator {
  simulateExecution(className: string, iterations: number): {
    mode: 'INTERPRETED' | 'JIT_C1_COMPILED' | 'JIT_C2_NATIVE';
    executionSpeedMultiplier: number;
  } {
    if (iterations < 1000) {
      return { mode: 'INTERPRETED', executionSpeedMultiplier: 1.0 };
    } else if (iterations < 10000) {
      return { mode: 'JIT_C1_COMPILED', executionSpeedMultiplier: 8.5 };
    } else {
      // Hotspot detected: JIT C2 tier-4 native machine code compilation!
      return { mode: 'JIT_C2_NATIVE', executionSpeedMultiplier: 42.0 };
    }
  }
}

const jvm = new JvmPipelineSimulator();
console.log('Cold Startup (10 executions):', jvm.simulateExecution('OrderService', 10).mode);
console.log('Warmup Phase (5,000 executions):', jvm.simulateExecution('OrderService', 5000).mode);
const hotResult = jvm.simulateExecution('OrderService', 50000);
console.log('Hotspot Detected (50,000 executions):', hotResult.mode);
console.log('JIT Native Acceleration:', hotResult.executionSpeedMultiplier + 'x faster than interpreted bytecode');`,
        output: `Cold Startup (10 executions): INTERPRETED\nWarmup Phase (5,000 executions): JIT_C1_COMPILED\nHotspot Detected (50,000 executions): JIT_C2_NATIVE\nJIT Native Acceleration: 42x faster than interpreted bytecode`,
        codeNotes: [
          { line: 7, note: 'JVM starts in interpreted mode for zero warmup latency' },
          { line: 12, note: 'Hot method detection triggers tiered JIT C2 native machine compilation' },
          { line: 24, note: 'Demonstrates up to 40x+ throughput acceleration on hot enterprise paths' }
        ],
        tryIt: 'Run with 2,000 iterations to observe the intermediate JIT C1 compiler tier.',
        check: {
          question: 'What is the role of the Just-In-Time (JIT) compiler in the Java Virtual Machine?',
          options: [
            'It identifies frequently executed bytecode (hot spots) and compiles it into native machine code at runtime',
            'It translates Java code into Python',
            'It shuts down the computer when memory is full'
          ],
          answer: 0,
          why: 'The JIT compiler dynamically converts performance-critical bytecode paths into native machine instructions for high-throughput execution.'
        }
      },
      {
        title: 'Memory Layout: Stack Frames vs The Garbage-Collected Heap',
        say: [
          'The JVM divides execution memory into two primary regions: The Stack and The Heap.',
          'Each execution thread has its own private Call Stack.',
          'Whenever a method is called, a new Stack Frame is pushed onto the stack containing primitive local variables (int, double, boolean) and object reference pointers.',
          'Stack allocation and deallocation are instantaneous: when a method returns, its stack frame is popped instantly.',
          'In contrast, all Object instances (e.g. new User(), new HashMap()) reside on The Heap, which is shared across all threads.',
          'Memory on the heap is reclaimed automatically by the Garbage Collector (GC), which tracks object references and reclaims unreachable memory.'
        ],
        example: 'Like your personal notebook (Stack) where you jot down temporary calculations and erase them when done, versus a public library bookshelf (Heap) where books are shared by everyone and periodically cleaned by the librarian (Garbage Collector).',
        code: `// JVM Memory Model Simulation: Stack Frames vs Heap Allocation
interface HeapObject {
  id: string;
  type: string;
  referenceCount: number;
}

class JvmMemoryManager {
  private stackDepth = 0;
  private heap = new Map<string, HeapObject>();

  enterMethod(methodName: string) {
    this.stackDepth++;
    // Stack frame allocation is instant (O(1))
  }

  exitMethod(methodName: string) {
    this.stackDepth--;
    // Stack frame automatically deallocated
  }

  allocateHeap(id: string, type: string) {
    this.heap.set(id, { id, type, referenceCount: 1 });
  }

  dereference(id: string) {
    const obj = this.heap.get(id);
    if (obj) obj.referenceCount--;
  }

  runGarbageCollector(): { collected: number; liveObjects: number } {
    let collected = 0;
    for (const [id, obj] of this.heap.entries()) {
      if (obj.referenceCount <= 0) {
        this.heap.delete(id);
        collected++;
      }
    }
    return { collected, liveObjects: this.heap.size };
  }

  getMetrics() {
    return { currentStackDepth: this.stackDepth, heapObjects: this.heap.size };
  }
}

const memory = new JvmMemoryManager();
memory.enterMethod('processOrder()');
memory.allocateHeap('order_01', 'Order');
memory.allocateHeap('user_42', 'User');

console.log('During Execution:', JSON.stringify(memory.getMetrics()));

// Method returns: order object goes out of scope and becomes eligible for GC
memory.dereference('order_01');
memory.exitMethod('processOrder()');

const gcReport = memory.runGarbageCollector();
console.log('GC Sweep Outcome: Reclaimed', gcReport.collected, 'dead object(s) | Retained', gcReport.liveObjects, 'active object(s)');`,
        output: `During Execution: {"currentStackDepth":1,"heapObjects":2}\nGC Sweep Outcome: Reclaimed 1 dead object(s) | Retained 1 active object(s)`,
        codeNotes: [
          { line: 11, note: 'Stack frames push and pop with zero memory search overhead' },
          { line: 20, note: 'Objects are allocated on shared heap memory' },
          { line: 29, note: 'Garbage collection identifies and frees objects with zero live references' }
        ],
        tryIt: 'Dereference user_42 and run the garbage collector again to observe a clean heap.',
        check: {
          question: 'Where do local primitive variables and method call return addresses live in Java?',
          options: [
            'In the thread private Stack Frame, which is deallocated instantly when the method finishes',
            'On the shared global Heap',
            'In the database hard drive'
          ],
          answer: 0,
          why: 'Method local variables and call frames live in thread-isolated Stack memory and are automatically freed upon method return.'
        }
      },
      {
        title: 'Encapsulation Invariants & Polymorphic Interfaces',
        say: [
          'In enterprise architecture, software systems grow to millions of lines of code written by hundreds of engineers.',
          'To prevent bugs, Java enforces Object-Oriented Encapsulation: fields are kept private, and mutations must route through explicit methods that enforce domain invariants.',
          'Furthermore, enterprise backends decouple components using Interfaces.',
          'An Interface defines a strict behavioral contract without exposing internal implementation details.',
          'This allows Polymorphism: swapping a database repository or payment gateway without altering a single line of business logic.'
        ],
        example: 'Like an electrical wall outlet (interface). Any three-prong appliance (polymorphic implementation: toaster, laptop charger, lamp) can plug into it and receive 120V power without knowing whether the electricity was generated by solar panels or a hydro dam.',
        code: `// Enterprise Java Domain Invariant & Interface Polymorphism
interface PaymentGateway {
  charge(amountCents: number): { success: boolean; transactionId: string };
}

class StripeGateway implements PaymentGateway {
  charge(amountCents: number) {
    return { success: true, transactionId: 'ch_stripe_' + Math.random().toString(36).slice(2, 7) };
  }
}

class BankAccount {
  private balanceCents: number; // Encapsulated private state

  constructor(initialDepositCents: number) {
    if (initialDepositCents < 0) throw new Error('Initial deposit cannot be negative');
    this.balanceCents = initialDepositCents;
  }

  // Domain mutation method enforcing business invariants
  withdraw(amountCents: number): boolean {
    if (amountCents <= 0) return false;
    if (this.balanceCents < amountCents) return false; // Overdraft protection invariant
    this.balanceCents -= amountCents;
    return true;
  }

  getBalanceFormatted(): string {
    return '$' + (this.balanceCents / 100).toFixed(2);
  }
}

const account = new BankAccount(50000); // $500.00
console.log('Initial Account Balance:', account.getBalanceFormatted());

const success1 = account.withdraw(15000); // Withdraw $150.00
console.log('Withdraw $150.00:', success1 ? 'APPROVED' : 'REJECTED', '| Balance:', account.getBalanceFormatted());

const success2 = account.withdraw(40000); // Attempt overdraft ($400 > $350)
console.log('Withdraw $400.00:', success2 ? 'APPROVED' : 'REJECTED (Overdraft Invariant Enforced)', '| Balance:', account.getBalanceFormatted());`,
        output: `Initial Account Balance: $500.00\nWithdraw $150.00: APPROVED | Balance: $350.00\nWithdraw $400.00: REJECTED (Overdraft Invariant Enforced) | Balance: $350.00`,
        codeNotes: [
          { line: 11, note: 'Private field prevents untrusted callers from directly altering internal state' },
          { line: 19, note: 'Business validation ensures overdrafts cannot occur' },
          { line: 37, note: 'Demonstrates guaranteed consistency of enterprise bank balance' }
        ],
        tryIt: 'Add a deposit method that validates positive amounts and increases balance.',
        check: {
          question: 'Why does enterprise Java mandate private fields with accessor methods (Encapsulation)?',
          options: [
            'To protect internal state from corrupting mutations and enforce business invariants at all times',
            'To make the code run slower so programmers can take longer coffee breaks',
            'Because Java does not have public variables'
          ],
          answer: 0,
          why: 'Encapsulation ensures that private state can only be modified through controlled methods that enforce business rules and validate invariants.'
        }
      },
      {
        title: 'Resource Management & The AutoCloseable Interface',
        say: [
          'In server systems, the Garbage Collector only manages memory.',
          'It does NOT automatically close external operating system resources like TCP database connections, file descriptors, or network sockets.',
          'If a developer opens a database connection and forgets to close it, the database pool quickly exhausts its connection limit, causing a systemic outage (Resource Leak).',
          'To guarantee resource safety, Java 7 introduced the try-with-resources statement.',
          'Any class implementing the AutoCloseable interface is automatically and deterministically closed when the execution block exits, even if an unhandled exception or crash occurs.',
          'This guarantees 100% leak-proof enterprise connectivity.'
        ],
        example: 'Like borrowing a key to the office supply closet. The moment you leave the room, an automatic spring on the door snaps it shut and locks it behind you, ensuring the key is never left on a desk.',
        code: `// Java AutoCloseable / Try-with-Resources Deterministic Cleanup Simulation
interface AutoCloseableResource {
  close(): void;
}

class MockDbConnection implements AutoCloseableResource {
  public isOpen = true;

  query(sql: string): string {
    if (!this.isOpen) throw new Error('Cannot query on closed database connection');
    return 'Query executed successfully for: ' + sql;
  }

  close() {
    this.isOpen = false;
    console.log('[RESOURCE CLEANUP] Database socket closed cleanly. Connection returned to pool.');
  }
}

function executeWithResource<T extends AutoCloseableResource, R>(
  resource: T,
  block: (res: T) => R
): R {
  try {
    return block(resource);
  } finally {
    // Guarantees deterministic cleanup even on error!
    resource.close();
  }
}

const connection = new MockDbConnection();
console.log('Connection Opened:', connection.isOpen);

const queryResult = executeWithResource(connection, (conn) => {
  return conn.query('SELECT user_id, email FROM users WHERE active = true;');
});

console.log('Result:', queryResult);
console.log('Connection Status after Try-with-Resources:', connection.isOpen ? 'OPEN (LEAK)' : 'CLOSED (DETERMINISTIC CLEANUP)');`,
        output: `Connection Opened: true\n[RESOURCE CLEANUP] Database socket closed cleanly. Connection returned to pool.\nResult: Query executed successfully for: SELECT user_id, email FROM users WHERE active = true;\nConnection Status after Try-with-Resources: CLOSED (DETERMINISTIC CLEANUP)`,
        codeNotes: [
          { line: 6, note: 'AutoCloseable resource contract requires explicit close() implementation' },
          { line: 24, note: 'finally block ensures socket cleanup executes even if exceptions are thrown' },
          { line: 37, note: 'Confirms zero connection leakage' }
        ],
        tryIt: 'Throw an error inside the query block and verify that close() still executes deterministically.',
        check: {
          question: 'What is the primary benefit of Java’s try-with-resources statement?',
          options: [
            'It guarantees that external OS resources (file handles, database sockets) are closed deterministically, even if exceptions occur',
            'It prevents Java from compiling syntax errors',
            'It turns off the internet when not in use'
          ],
          answer: 0,
          why: 'try-with-resources guarantees deterministic cleanup of AutoCloseable resources upon block exit, eliminating connection pool leaks.'
        }
      },
      {
        title: 'Modern Concurrency: Virtual Threads & High-Throughput I/O',
        say: [
          'Historically in Java, every java.lang.Thread corresponded 1:1 to an operating system platform thread.',
          'Operating system threads are expensive: each thread consumes roughly 1 MB of stack memory, and context-switching between them costs thousands of CPU cycles.',
          'As a result, a server running 5,000 concurrent web requests struggled under thread overhead.',
          'In Java 21, Project Loom revolutionized concurrency with Virtual Threads.',
          'Virtual Threads are lightweight user-mode threads managed entirely by the JVM.',
          'A single Virtual Thread consumes only a few hundred bytes of memory.',
          'When a Virtual Thread performs blocking network I/O, the JVM unmounts it from its carrier OS thread and mounts another task, allowing a single server to handle 1,000,000 concurrent connections effortlessly.'
        ],
        example: 'Like an airline counter with 10 physical agents (carrier OS threads). Instead of having 500 passengers stand glued to their agent for 20 minutes while passports print (platform thread blocking), passengers take a number (virtual thread) and sit down. The 10 agents process 500 passengers smoothly without hiring 500 agents.',
        code: `// Java 21 Virtual Threads vs OS Platform Threads Throughput Simulator
interface ThreadBenchReport {
  concurrentTasks: number;
  threadType: 'OS_PLATFORM_THREAD' | 'JAVA_21_VIRTUAL_THREAD';
  ramUsageMb: number;
  contextSwitchOverhead: 'HIGH' | 'NEGLIGIBLE';
}

function simulatePlatformThreads(tasks: number): ThreadBenchReport {
  return {
    concurrentTasks: tasks,
    threadType: 'OS_PLATFORM_THREAD',
    ramUsageMb: Math.round(tasks * 1.0), // ~1MB stack per OS thread
    contextSwitchOverhead: 'HIGH'
  };
}

function simulateVirtualThreads(tasks: number): ThreadBenchReport {
  return {
    concurrentTasks: tasks,
    threadType: 'JAVA_21_VIRTUAL_THREAD',
    ramUsageMb: Math.round(tasks * 0.001), // ~1KB per lightweight virtual thread
    contextSwitchOverhead: 'NEGLIGIBLE'
  };
}

const scale = 10000; // 10,000 concurrent server requests
const platform = simulatePlatformThreads(scale);
const virtual = simulateVirtualThreads(scale);

console.log('Traditional Platform Threads (1:1 OS Mapping):');
console.log(\`  Tasks: \${platform.concurrentTasks} | RAM Required: \${platform.ramUsageMb} MB | OS Kernel Overhead: \${platform.contextSwitchOverhead}\`);

console.log('\\nJava 21 Virtual Threads (Project Loom M:N Scheduling):');
console.log(\`  Tasks: \${virtual.concurrentTasks} | RAM Required: \${virtual.ramUsageMb} MB | OS Kernel Overhead: \${virtual.contextSwitchOverhead}\`);
console.log('Throughput Scale: 10,000 concurrent web socket requests with under 15MB total memory!');`,
        output: `Traditional Platform Threads (1:1 OS Mapping):\n  Tasks: 10000 | RAM Required: 10000 MB | OS Kernel Overhead: HIGH\n\nJava 21 Virtual Threads (Project Loom M:N Scheduling):\n  Tasks: 10000 | RAM Required: 10 MB | OS Kernel Overhead: NEGLIGIBLE\nThroughput Scale: 10,000 concurrent web socket requests with under 15MB total memory!`,
        codeNotes: [
          { line: 11, note: 'Platform threads consume 10 GB of RAM for 10,000 concurrent connections' },
          { line: 20, note: 'Virtual threads consume only 10 MB of RAM for the exact same 10,000 connections' },
          { line: 33, note: 'Demonstrates 1000x memory efficiency for modern high-concurrency microservices' }
        ],
        tryIt: 'Increase task scale to 100,000 and calculate the memory requirements for Virtual Threads.',
        check: {
          question: 'What is the primary breakthrough of Virtual Threads in Java 21 (Project Loom)?',
          options: [
            'They allow millions of lightweight concurrent threads with tiny memory footprints (~1KB) and non-blocking carrier scheduling',
            'They make computer screens brighter',
            'They remove all security passwords from Java servers'
          ],
          answer: 0,
          why: 'Virtual Threads decouple concurrency from OS kernel threads, enabling massive concurrent I/O throughput with minimal memory consumption.'
        }
      }
    ],
    summary: [
      'The JVM compiles bytecode and leverages tiered JIT C2 compilation for near-native CPU speeds.',
      'Stack frames store method-local primitives and pointers; Heap stores shared garbage-collected objects.',
      'Encapsulation and polymorphic interfaces decouple enterprise systems and enforce business rules.',
      'try-with-resources and AutoCloseable guarantee deterministic cleanup of database and network sockets.',
      'Java 21 Virtual Threads enable massive concurrent scalability with minimal memory footprint.'
    ],
    projectStep: {
      title: 'Architect a Leak-Proof Virtual Threaded Banking Service',
      steps: [
        'Model account state using private encapsulated fields with overdraft protection.',
        'Implement an AutoCloseable database connection wrapper with deterministic cleanup.',
        'Simulate high-concurrency request dispatching over lightweight virtual threads.',
        'Profile memory allocation and verify zero socket resource leaks upon completion.'
      ]
    }
  },
  {
    coursePrefix: 'java-basics',
    day: 2,
    title: 'Java Memory Model, Collections Architecture & Spring Concurrency Pipelines',
    goal: 'Master the Java Memory Model (JMM) happens-before guarantees, HashMap internal bucket resizing and treeify thresholds, Streams Spliterator parallel processing, Spring IoC with AOP transactional proxies, and ConcurrentHashMap CAS concurrency.',
    minutes: 45,
    recap: 'In Day 1, we mastered JVM bytecode classloading, tiered JIT C2 native compilation, Stack vs Heap memory layout, and Project Loom virtual threads. Now, we dive deep into multi-core CPU memory barriers, collection collision trees, functional parallel streams, Spring IoC AOP proxies, and lock-free CAS pipelines.',
    parts: [
      {
        title: 'Java Memory Model (JMM), Happens-Before Guarantee & Volatile Invariants',
        say: [
          'In modern multi-core server hardware, each CPU core maintains its own ultrafast L1 and L2 cache hierarchies alongside write store buffers. When a Java thread writes a variable, the hardware does not immediately write the value to shared main memory; it sits buffered inside the local CPU core cache.',
          'Without explicit synchronization barriers, another CPU core executing a concurrent worker thread can read a stale, cached value from its own L1 cache for seconds or even indefinitely, causing catastrophic state desynchronization in high-concurrency systems.',
          'The Java Memory Model (JMM) provides formal architectural guarantees by defining the Happens-Before relationship. A happens-before relationship between two actions ensures that memory writes performed by one action are guaranteed to be visible to the second action.',
          'Declaring a Java field with the volatile keyword provides two critical runtime semantics: memory visibility and instruction reordering prevention.',
          'Under the hood, a write to a volatile variable forces the CPU to execute a Store-Load memory barrier (fence instruction). This immediately flushes the core store buffer into main memory and invalidates the cache lines across all other CPU cores via cache coherence bus snooping.',
          'Furthermore, the JMM guarantees that all writes to regular variables that occur before a volatile write are also flushed and become visible to any thread that subsequent reads that volatile variable, establishing a lightweight synchronization protocol without heavyweight mutex locking.'
        ],
        example: 'Think of two accountants working in separate offices. If Accountant A writes an expense total on a personal sticky note on their own desk (L1 cache), Accountant B in the other room has no idea the total changed and continues using last week ledger (stale read). Declaring the number volatile is like forcing Accountant A to immediately broadcast the total over the office intercom and update the central ledger whiteboard (main memory barrier), so everyone instantly wipes their sticky notes and uses the new number.',
        code: `// Simulation: Java Memory Model (JMM) Cache Coherence & Volatile Memory Barriers
interface CpuCoreCache {
  coreId: number;
  l1CacheValue: number;
  isDirty: boolean;
}

class JavaMemoryModelSimulator {
  private mainMemoryValue = 0;
  private caches: CpuCoreCache[] = [
    { coreId: 0, l1CacheValue: 0, isDirty: false },
    { coreId: 1, l1CacheValue: 0, isDirty: false },
  ];

  // Standard variable: writes stay in L1 cache buffer; other core reads stale data
  writeStandard(coreId: number, value: number) {
    this.caches[coreId].l1CacheValue = value;
    this.caches[coreId].isDirty = true;
  }

  readStandard(coreId: number): number {
    return this.caches[coreId].l1CacheValue;
  }

  // Volatile variable: enforces Memory Barrier / Store-Load Fence
  // 1. Flushes writer core store buffer directly into Main Memory
  // 2. Invalidates all other CPU cores' L1/L2 caches (Cache Coherence Bus Snooping)
  writeVolatile(coreId: number, value: number) {
    this.caches[coreId].l1CacheValue = value;
    this.caches[coreId].isDirty = false;
    this.mainMemoryValue = value;

    // Invalidate all other CPU core caches
    for (const cache of this.caches) {
      if (cache.coreId !== coreId) {
        cache.l1CacheValue = value; // Bus snooping reload
      }
    }
  }

  readVolatile(coreId: number): number {
    return this.mainMemoryValue;
  }
}

const jmm = new JavaMemoryModelSimulator();

// Test Non-Volatile Flag (Worker Thread Stale Read)
jmm.writeStandard(0, 100); // Core 0 writes 100
const core1Stale = jmm.readStandard(1); // Core 1 still sees 0

// Test Volatile Flag (Immediate Memory Barrier Sync)
jmm.writeVolatile(0, 250);
const core1Volatile = jmm.readVolatile(1);

console.log('=== JAVA MEMORY MODEL (JMM) & VOLATILE CACHE INVARIANTS ===');
console.log('Non-Volatile Write on Core 0 -> Core 1 L1 Read: ' + core1Stale + ' (STALE CACHE DETECTED)');
console.log('Volatile Write on Core 0 -> Core 1 Fence Read: ' + core1Volatile + ' (MEMORY BARRIER SYNCHRONIZED)');
console.log('Happens-Before Guarantee: All writes prior to volatile write are visible upon volatile read');`,
        output: `=== JAVA MEMORY MODEL (JMM) & VOLATILE CACHE INVARIANTS ===\nNon-Volatile Write on Core 0 -> Core 1 L1 Read: 0 (STALE CACHE DETECTED)\nVolatile Write on Core 0 -> Core 1 Fence Read: 250 (MEMORY BARRIER SYNCHRONIZED)\nHappens-Before Guarantee: All writes prior to volatile write are visible upon volatile read`,
        tryIt: 'Simulate a third CPU core reading from the JMM simulator after both standard and volatile writes.',
        check: {
          question: 'What hardware-level mechanism does the JVM invoke when writing to a field marked with the volatile keyword?',
          options: [
            'It serializes the object to disk using Java standard serialization',
            'It issues a CPU memory barrier (Store-Load fence) that flushes the local store buffer into main memory and invalidates stale L1/L2 caches across peer cores',
            'It locks the entire operating system kernel until all threads terminate'
          ],
          answer: 1,
          why: 'A volatile write emits a hardware memory barrier instruction (such as mfence or lock addl on x86). This forces the writing core to flush pending writes to main memory and triggers cache coherence protocols (MESI) across the CPU interconnect to invalidate peer cache lines.'
        }
      },
      {
        title: 'HashMap Internal Architecture, Load Factors & Treeify Red-Black Trees',
        say: [
          'The Java HashMap is the foundational data structure for key-value storage across enterprise services. Internally, a HashMap is backed by an array of buckets (Node<K,V>[] table) whose capacity is always a power of two (defaulting to 16).',
          'When a key-value pair is inserted, the JVM invokes the key hashCode() method, passes it through a 32-bit bit-spread function (h ^ (h >>> 16)) to distribute entropy across lower bits, and calculates the bucket array index using the bitwise mask (capacity - 1) & hash.',
          'When two distinct keys produce the exact same bucket index, a hash collision occurs. In Java 7, collisions were stored as a simple singly-linked list. If an attacker maliciously crafted keys with identical hashes (HashDoS attack), lookups degraded from O(1) to O(N), paralyzing application servers.',
          'To solve this, Java 8 introduced the TREEIFY_THRESHOLD: when a single bucket collision chain accumulates 8 or more entries and total table capacity is at least 64, the linked list is automatically converted into a balanced Red-Black Tree (TreeNode<K,V>), transforming worst-case search complexity from O(N) into O(log N).',
          'To maintain high lookup performance, the HashMap dynamically expands when the number of elements exceeds the threshold defined by capacity * loadFactor (defaulting to 0.75). Upon resizing, the bucket table capacity doubles (16 to 32, then 64), and all elements are rehashed into the new table.',
          'Understanding load factor trade-offs is crucial: a lower load factor reduces collision probability at the cost of higher memory consumption, while 0.75 represents the mathematically optimal Poisson distribution balance between time and space overhead.'
        ],
        example: 'Think of an office mail room with 16 pigeonhole cubbies. As mail arrives, the mail clerk places letters into cubbies based on postal codes. If one cubby fills up with more than 8 letters, instead of stacking them in a tall messy pile where the clerk must check every single envelope (linked list), the clerk inserts a neat alphabetized filing accordion folder (Red-Black Tree) so any letter can be found in 3 fast checks.',
        code: `// Simulation: Java HashMap Internal Bucket Table, Resizing & Collision Treeify
interface HashBucketNode {
  key: string;
  hash: number;
  value: string;
}

class EnterpriseHashMapSimulator {
  private capacity: number;
  private loadFactor = 0.75;
  private size = 0;
  private buckets: HashBucketNode[][];
  private treeifiedBuckets = 0;
  private resizeCount = 0;

  constructor(initialCapacity = 16) {
    this.capacity = initialCapacity;
    this.buckets = Array.from({ length: this.capacity }, () => []);
  }

  private hash(key: string): number {
    let h = 0;
    for (let i = 0; i < key.length; i++) {
      h = (Math.imul(31, h) + key.charCodeAt(i)) | 0;
    }
    // Java 8 spread function: h ^ (h >>> 16)
    return (h ^ (h >>> 16)) >>> 0;
  }

  put(key: string, value: string): void {
    const h = this.hash(key);
    const bucketIdx = (this.capacity - 1) & h;
    const bucket = this.buckets[bucketIdx];

    const existing = bucket.find(n => n.key === key);
    if (existing) {
      existing.value = value;
      return;
    }

    bucket.push({ key, hash: h, value });
    this.size++;

    // Check TREEIFY_THRESHOLD: If bucket collision chain reaches 8 nodes
    if (bucket.length >= 8 && this.capacity >= 64) {
      this.treeifiedBuckets++;
    }

    // Check Resize Threshold
    if (this.size > this.capacity * this.loadFactor) {
      this.resize();
    }
  }

  private resize(): void {
    this.resizeCount++;
    const oldBuckets = this.buckets;
    this.capacity *= 2;
    this.buckets = Array.from({ length: this.capacity }, () => []);
    this.size = 0;

    for (const bucket of oldBuckets) {
      for (const node of bucket) {
        this.put(node.key, node.value);
      }
    }
  }

  getDiagnostics() {
    const threshold = Math.floor(this.capacity * this.loadFactor);
    return {
      capacity: this.capacity,
      size: this.size,
      threshold,
      resizes: this.resizeCount,
      maxBucketDepth: Math.max(...this.buckets.map(b => b.length))
    };
  }
}

const map = new EnterpriseHashMapSimulator(16);
// Insert 25 items to trigger resize (16 * 0.75 = 12 threshold)
for (let i = 1; i <= 25; i++) {
  map.put('order_key_' + i, 'payload_' + i);
}

const diag = map.getDiagnostics();

console.log('=== JAVA HASHMAP INTERNAL ARCHITECTURE & RESIZING ===');
console.log('Total Elements Inserted: ' + diag.size);
console.log('Current Bucket Table Capacity: ' + diag.capacity + ' (Doubled from 16)');
console.log('Dynamic Resize Count: ' + diag.resizes + ' (Triggered at Load Factor 0.75)');
console.log('Maximum Bucket Collision Chain Depth: ' + diag.maxBucketDepth + ' (Below TREEIFY_THRESHOLD of 8)');
console.log('Algorithmic Lookup Complexity: O(1) Average Case | O(log N) Red-Black Tree Worst Case');`,
        output: `=== JAVA HASHMAP INTERNAL ARCHITECTURE & RESIZING ===\nTotal Elements Inserted: 25\nCurrent Bucket Table Capacity: 64 (Doubled from 16)\nDynamic Resize Count: 2 (Triggered at Load Factor 0.75)\nMaximum Bucket Collision Chain Depth: 1 (Below TREEIFY_THRESHOLD of 8)\nAlgorithmic Lookup Complexity: O(1) Average Case | O(log N) Red-Black Tree Worst Case`,
        tryIt: 'Artificially force hash collisions to 8 nodes on a bucket to observe the treeification threshold.',
        check: {
          question: 'Why did Java 8 introduce the TREEIFY_THRESHOLD (converting bucket linked lists to Red-Black Trees when collision depth reaches 8)?',
          options: [
            'To defend against algorithmic complexity attacks (HashDoS) where collided keys degrade lookups to O(N), guaranteeing O(log N) worst-case performance',
            'To reduce the total number of RAM bytes allocated by the JVM garbage collector',
            'Because Red-Black Trees do not require hashCode calculations'
          ],
          answer: 0,
          why: 'In Java 7, severe hash collisions produced long linked lists with O(N) linear scan lookups. In Java 8, when a bucket exceeds 8 nodes, it converts to a Red-Black Tree (TreeNode), bounding worst-case lookup latency to O(log N) and neutralizing collision-based denial-of-service exploits.'
        }
      },
      {
        title: 'Java Streams API, Spliterator Partitioning & Parallel ForkJoinPool',
        say: [
          'The Java Streams API introduced declarative, functional data processing pipelines to enterprise Java. Rather than mutating external collections using imperative for-loops, Streams compose declarative transformation pipelines.',
          'A Stream pipeline consists of three phases: a data source (such as a Collection or array), zero or more intermediate operations (such as .filter(), .map(), and .sorted()), and exactly one terminal operation (such as .collect(), .reduce(), or .count()).',
          'A critical architectural characteristic of Streams is Lazy Evaluation. Intermediate operations do not process elements when invoked; they merely construct a pipeline execution plan. Data begins flowing only when the terminal operation is reached, enabling loop fusion and short-circuit optimizations like .findFirst().',
          'When processing massive datasets with millions of records, invoking .parallelStream() splits the workload across multiple CPU cores using the Spliterator interface and the common ForkJoinPool.',
          'The Spliterator uses the trySplit() method to recursively partition the dataset into balanced sub-chunks. Worker threads in the ForkJoinPool execute these chunks concurrently and employ Work-Stealing algorithms: idle threads steal tasks from the deque tails of busy threads to maximize multi-core hardware utilization.',
          'However, parallel streams are not a magic bullet: for small datasets or operations with heavy shared-state contention or boxing overhead, thread synchronization latency often exceeds sequential execution time.'
        ],
        example: 'Think of an automated parcel sorting facility at an airport. A sequential stream is a single conveyor belt with inspectors filtering damaged boxes and packing them one by one. A parallel stream uses a mechanical splitter (Spliterator) that divides the incoming stream of 100,000 packages across 4 conveyor belts with 4 dedicated workers running simultaneously (ForkJoinPool), quadruple-checking packages in parallel.',
        code: `// Simulation: Java Streams Pipeline with Lazy Evaluation & Parallel Spliterator
interface Transaction {
  id: string;
  amount: number;
  region: 'EMEA' | 'APAC' | 'NA';
}

// Generate 100,000 synthetic transaction amounts
const transactions: Transaction[] = [];
for (let i = 0; i < 100000; i++) {
  transactions.push({
    id: 'tx_' + i,
    amount: (i % 500) + 1,
    region: i % 3 === 0 ? 'EMEA' : i % 3 === 1 ? 'APAC' : 'NA'
  });
}

// Sequential stream pipeline
function executeSequentialStream(list: Transaction[]): { count: number; totalVolume: number } {
  const filtered = list.filter(t => t.region === 'EMEA' && t.amount > 200);
  const sum = filtered.reduce((acc, t) => acc + t.amount, 0);
  return { count: filtered.length, totalVolume: sum };
}

// Parallel stream Spliterator partition simulation (ForkJoinPool with 4 worker threads)
function executeParallelStream(list: Transaction[], cores = 4): { count: number; totalVolume: number; chunks: number } {
  const chunkSize = Math.ceil(list.length / cores);
  let totalCount = 0;
  let totalVolume = 0;

  for (let c = 0; c < cores; c++) {
    const slice = list.slice(c * chunkSize, (c + 1) * chunkSize);
    const res = executeSequentialStream(slice);
    totalCount += res.count;
    totalVolume += res.totalVolume;
  }

  return { count: totalCount, totalVolume, chunks: cores };
}

const seq = executeSequentialStream(transactions);
const par = executeParallelStream(transactions, 4);

console.log('=== JAVA STREAMS API & PARALLEL FORKJOINPOOL SPLITERATOR ===');
console.log('Dataset Size: ' + transactions.length.toLocaleString('en-US') + ' Transactions Processed');
console.log('Sequential Stream Result: ' + seq.count.toLocaleString('en-US') + ' Filtered Rows | Volume: $' + seq.totalVolume.toLocaleString('en-US'));
console.log('Parallel Stream Spliterator: ' + par.chunks + ' ForkJoin Worker Threads (trySplit())');
console.log('Parity Verified: ' + (seq.totalVolume === par.totalVolume ? '100% IDENTICAL REDUCE OUTPUT' : 'MISMATCH'));
console.log('Execution Model: Lazy Intermediate Operations (filter, map) & Eager Terminal Aggregation (reduce)');`,
        output: `=== JAVA STREAMS API & PARALLEL FORKJOINPOOL SPLITERATOR ===\nDataset Size: 100,000 Transactions Processed\nSequential Stream Result: 20,000 Filtered Rows | Volume: $7,010,100\nParallel Stream Spliterator: 4 ForkJoin Worker Threads (trySplit())\nParity Verified: 100% IDENTICAL REDUCE OUTPUT\nExecution Model: Lazy Intermediate Operations (filter, map) & Eager Terminal Aggregation (reduce)`,
        tryIt: 'Change the filter condition to amount > 400 and observe how both sequential and parallel streams maintain identical reduced outputs.',
        check: {
          question: 'What interface is responsible for partitioning a data source into sub-chunks for parallel processing in Java Streams?',
          options: [
            'Spliterator via its trySplit() method',
            'Iterator via its hasNext() method',
            'Serializable via writeObject()'
          ],
          answer: 0,
          why: 'The Spliterator (splitable iterator) interface defines trySplit(), which recursively partitions elements into balanced chunks that the common ForkJoinPool assigns across CPU worker threads.'
        }
      },
      {
        title: 'Spring IoC Container, Dependency Injection & AOP Transactional Proxies',
        say: [
          'The Spring Framework is the backbone of global enterprise Java development. At its core lies the Inversion of Control (IoC) container, managed by the ApplicationContext.',
          'In traditional procedural code, objects instantiate their own dependencies using the new keyword, tightly coupling implementations and making unit testing impossible. In Spring, the container takes control of the object lifecycle: it instantiates Beans, resolves dependencies, and injects them via Constructor Injection.',
          'The Spring Bean lifecycle follows strict lifecycle phases: instantiation, dependency injection, BeanPostProcessor pre-initialization, @PostConstruct execution, and post-initialization wrapping.',
          'During the post-initialization phase, Spring applies Aspect-Oriented Programming (AOP). If a bean method is annotated with @Transactional, Spring does not return the raw Java object; it dynamically wraps the bean inside an AOP Proxy (using JDK Dynamic Proxies or CGLIB bytecode generation).',
          'When client code invokes the proxied method, the proxy interceptor intercepts the call, opens a database transaction via the TransactionManager, delegates to the actual business logic method, and then commits the transaction upon clean completion.',
          'If the method throws an unhandled RuntimeException, the AOP proxy catches the exception, issues an immediate database ROLLBACK, and rethrows the exception, guaranteeing ACID database integrity without polluting business classes with boilerplate transaction logic.'
        ],
        example: 'Think of an executive signing important contracts. Rather than the executive personally opening the fireproof safe, logging into notary databases, and stamping legal seals (boilerplate transaction code), an executive assistant (AOP Proxy) pre-opens the notary log (begin transaction), hands the pen to the executive to sign (business logic), and officially stamps and archives the document upon signature, or shreds it if anything was invalid (commit or rollback).',
        code: `// Simulation: Spring IoC ApplicationContext, Dependency Injection & Dynamic AOP Transaction Proxy
interface BeanDefinition {
  name: string;
  instance: unknown;
  dependencies: string[];
}

class SpringApplicationContextSimulator {
  private registry: Map<string, BeanDefinition> = new Map();
  private singletonPool: Map<string, unknown> = new Map();

  registerBean(name: string, constructorFn: (...deps: unknown[]) => unknown, dependencies: string[]) {
    this.registry.set(name, { name, instance: constructorFn, dependencies });
  }

  getBean<T>(name: string): T {
    if (this.singletonPool.has(name)) {
      return this.singletonPool.get(name) as T;
    }

    const def = this.registry.get(name);
    if (!def) throw new Error('NoSuchBeanDefinitionException: ' + name);

    // Recursive Dependency Injection
    const resolvedDeps = def.dependencies.map(depName => this.getBean(depName));
    const constructorFn = def.instance as (...deps: unknown[]) => T;
    const rawInstance = constructorFn(...resolvedDeps);

    // Wrap in dynamic AOP Proxy for @Transactional semantics
    const proxiedInstance = this.createAopTransactionalProxy(rawInstance);
    this.singletonPool.set(name, proxiedInstance);
    return proxiedInstance as T;
  }

  private createAopTransactionalProxy<T>(target: T): T {
    const handler: ProxyHandler<any> = {
      get(obj, prop) {
        const original = obj[prop];
        if (typeof original === 'function' && String(prop).startsWith('process')) {
          return function (...args: unknown[]) {
            console.log('  [AOP Proxy: @Transactional] >>> BEGIN DB TRANSACTION');
            try {
              const result = original.apply(obj, args);
              console.log('  [AOP Proxy: @Transactional] <<< COMMIT TRANSACTION (Success)');
              return result;
            } catch (err: any) {
              console.log('  [AOP Proxy: @Transactional] <<< ROLLBACK TRANSACTION (Exception: ' + err.message + ')');
              throw err;
            }
          };
        }
        return original;
      }
    };
    return new Proxy(target, handler);
  }
}

interface AccountRepository {
  findBalance(id: string): number;
}

interface PaymentService {
  processTransfer(fromId: string, toId: string, amount: number): string;
}

const context = new SpringApplicationContextSimulator();

// Register Repository
context.registerBean('accountRepository', () => ({
  findBalance: (id: string) => 1500
}), []);

// Register Service with injected repository
context.registerBean('paymentService', (repo: AccountRepository) => ({
  processTransfer: (from: string, to: string, amount: number) => {
    const balance = repo.findBalance(from);
    if (balance < amount) throw new Error('Insufficient Funds');
    return 'Transferred $' + amount + ' from ' + from + ' to ' + to;
  }
}), ['accountRepository']);

const paymentService = context.getBean<PaymentService>('paymentService');

console.log('=== SPRING IOC CONTAINER & AOP TRANSACTIONAL PROXY ===');
console.log('Wiring: PaymentService injected with AccountRepository Singleton');
const transferResult = paymentService.processTransfer('ACC_987', 'ACC_123', 250);
console.log('Result: ' + transferResult);`,
        output: `=== SPRING IOC CONTAINER & AOP TRANSACTIONAL PROXY ===\nWiring: PaymentService injected with AccountRepository Singleton\n  [AOP Proxy: @Transactional] >>> BEGIN DB TRANSACTION\n  [AOP Proxy: @Transactional] <<< COMMIT TRANSACTION (Success)\nResult: Transferred $250 from ACC_987 to ACC_123`,
        tryIt: 'Trigger a simulated transaction rollback by passing an amount greater than the $1500 balance.',
        check: {
          question: 'How does Spring Framework implement @Transactional method management without modifying your business code?',
          options: [
            'It wraps the target bean in an AOP dynamic proxy that intercepts method calls to manage database transaction begin, commit, and rollback boundaries',
            'It rewrites the operating system kernel disk driver',
            'It compiles all Java code directly into SQL triggers'
          ],
          answer: 0,
          why: 'Spring uses JDK Dynamic Proxies or CGLIB bytecode proxies to wrap beans. When a @Transactional method is invoked, the proxy interceptor manages transaction begin/commit/rollback around the underlying method execution.'
        }
      },
      {
        title: 'ConcurrentHashMap CAS Locks & CompletableFuture Pipelines',
        say: [
          'In multi-threaded enterprise services handling tens of thousands of requests per second, traditional synchronization using synchronized blocks or ReentrantLocks can become severe throughput bottlenecks because threads block and context-switch while waiting for locks.',
          'ConcurrentHashMap solves this by implementing fine-grained lock striping and lock-free Compare-And-Swap (CAS) atomic operations. Inserting into an empty bucket does not acquire any mutex lock; it executes an atomic hardware CAS instruction (via VarHandle or Unsafe). Only when updating an existing collision node does it acquire a lightweight synchronized lock on that specific bucket head node.',
          'For orchestrating asynchronous non-blocking workflows across microservices, Java provides CompletableFuture. Unlike older Future objects where calling .get() blocks the caller thread, CompletableFuture supports functional composition and reactive chaining.',
          'Using methods like .thenApply() for transformations, .thenCompose() for dependent async calls, and .allOf() for parallel scatter-gather fan-outs, developers construct non-blocking processing graphs.',
          'In an e-commerce checkout flow, parallel stages—such as fraud scoring, atomic inventory reservation via ConcurrentHashMap, and payment authorization—can execute concurrently across thread pools and join cleanly when all stages complete.',
          'If any asynchronous stage encounters an exception, methods like .exceptionally() and .handle() provide graceful error recovery without unhandled thread termination, ensuring resilient high-throughput cloud architectures.'
        ],
        example: 'Think of an airport express security checkpoint with 10 separate biometric automated lanes (ConcurrentHashMap bucket striping). Travelers do not wait in one single long line behind a single officer (synchronized lock). At the same time, the airport computer system checks passport validity, luggage weight, and boarding pass concurrently across 3 parallel servers and turns the gate light green only when all three pass (CompletableFuture.allOf()).',
        code: `// Simulation: ConcurrentHashMap CAS Atomic Operations & CompletableFuture Pipeline
class ConcurrentHashMapCasSimulator {
  private table: Map<string, number> = new Map();

  // Lock-free Compare-And-Swap (CAS) update
  atomicIncrement(key: string, delta: number): number {
    while (true) {
      const current = this.table.get(key) || 0;
      const next = current + delta;
      // In real JVM, Unsafe.compareAndSwapInt tests hardware cache line
      this.table.set(key, next);
      return next;
    }
  }

  get(key: string): number {
    return this.table.get(key) || 0;
  }
}

// CompletableFuture pipeline simulation (Parallel async tasks joined with allOf)
interface CheckoutContext {
  orderId: string;
  fraudCheckPassed: boolean;
  inventoryReserved: boolean;
  paymentAuthorized: boolean;
}

function simulateAsyncCheckoutPipeline(orderId: string): CheckoutContext {
  // 1. Task A: Fraud Score
  const fraudPassed = true;
  // 2. Task B: Inventory CAS decrement
  const inventory = new ConcurrentHashMapCasSimulator();
  inventory.atomicIncrement('SKU_MACBOOK_PRO', 50); // Initial 50 in stock
  const remainingStock = inventory.atomicIncrement('SKU_MACBOOK_PRO', -1);
  // 3. Task C: Payment Gateway Auth
  const paymentAuth = true;

  return {
    orderId,
    fraudCheckPassed: fraudPassed,
    inventoryReserved: remainingStock >= 0,
    paymentAuthorized: paymentAuth
  };
}

const checkout = simulateAsyncCheckoutPipeline('ORD_2026_988');

console.log('=== CONCURRENTHASHMAP CAS & COMPLETABLEFUTURE PIPELINE ===');
console.log('Order Pipeline ID: ' + checkout.orderId);
console.log('Async Stage 1 (Fraud Detection): ' + (checkout.fraudCheckPassed ? 'PASSED (Score 98/100)' : 'FAILED'));
console.log('Async Stage 2 (ConcurrentHashMap CAS Inventory): RESERVED (Atomic Decrement)');
console.log('Async Stage 3 (Stripe Payment Authorization): AUTHORIZED ($1,999.00)');
console.log('CompletableFuture.allOf() Pipeline Status: ORDER CONFIRMED (All Async Stages Joined)');`,
        output: `=== CONCURRENTHASHMAP CAS & COMPLETABLEFUTURE PIPELINE ===\nOrder Pipeline ID: ORD_2026_988\nAsync Stage 1 (Fraud Detection): PASSED (Score 98/100)\nAsync Stage 2 (ConcurrentHashMap CAS Inventory): RESERVED (Atomic Decrement)\nAsync Stage 3 (Stripe Payment Authorization): AUTHORIZED ($1,999.00)\nCompletableFuture.allOf() Pipeline Status: ORDER CONFIRMED (All Async Stages Joined)`,
        tryIt: 'Simulate out-of-stock inventory handling where the atomic decrement returns a negative count.',
        check: {
          question: 'How does ConcurrentHashMap achieve high multi-threaded write throughput without global table locks?',
          options: [
            'By using lock-free Compare-And-Swap (CAS) instructions on empty bucket insertions and locking only individual bucket head nodes for collisions',
            'By writing all updates to a single text file on disk',
            'By disabling thread concurrency and running in single-threaded mode'
          ],
          answer: 0,
          why: 'ConcurrentHashMap avoids coarse-grained table locks by using atomic hardware CAS primitives to initialize empty bucket nodes, and locks only the individual head node of a collided bucket chain, allowing unrelated buckets to be updated concurrently.'
        }
      }
    ],
    summary: [
      'The Java Memory Model (JMM) guarantees memory visibility and prevents instruction reordering via happens-before relationships and volatile hardware memory barriers.',
      'HashMap uses (capacity - 1) & hash for O(1) bucket indexing, doubling capacity at 0.75 load factor and treeifying buckets to Red-Black Trees (O(log N)) at 8 collisions.',
      'The Streams API executes lazy intermediate operations and eager terminal reductions, partitioning workloads across the ForkJoinPool via Spliterator trySplit().',
      'Spring IoC manages bean instantiation and dependency injection, dynamically wrapping @Transactional beans in AOP proxies to manage database boundaries.',
      'ConcurrentHashMap utilizes lock-free CAS operations and bucket striping for thread-safe mutations, while CompletableFuture orchestrates non-blocking async pipelines.'
    ],
    projectStep: {
      title: 'Build a High-Throughput Concurrent Banking Microservice in Java 21',
      steps: [
        'Define a thread-safe Account ledger using ConcurrentHashMap with lock-free CAS balance updates.',
        'Implement a Spring IoC ApplicationContext configuration registering repositories and services.',
        'Wrap transactional methods in an AOP proxy interceptor to guarantee ACID commit and rollback semantics.',
        'Compose an asynchronous checkout pipeline using CompletableFuture to parallelize fraud detection, inventory reservation, and payment processing.'
      ]
    }
  },
  {
    coursePrefix: 'java-basics',
    day: 3,
    title: 'Generics, Reflection & Modern Java 21 Sealed Class Patterns',
    goal: 'Master enterprise JVM meta-programming: Generics and type erasure bridge methods, dynamic reflection invocation and MethodHandles, custom runtime annotations, Java 21 sealed types with exhaustive pattern matching, and ClassLoader parent delegation isolation.',
    minutes: 45,
    recap: 'In Day 1, we mastered the JVM execution lifecycle and virtual threads. In Day 2, we mastered the Java Memory Model, HashMap treeification, and Spring IoC proxies. Now, we advance into JVM meta-programming: compile-time generic erasure, dynamic reflection, runtime annotations, Java 21 sealed class pattern matching, and ClassLoader sandbox isolation.',
    parts: [
      {
        title: 'Generics & Type Erasure in the JVM (Bridge Methods & Bytecode Invariants)',
        say: [
          'Java Generics were introduced in Java 5 to provide compile-time type safety and eliminate hazardous manual casting from enterprise codebases.',
          'However, to maintain strict binary backwards compatibility with pre-Java 5 compiled libraries, the JVM architects chose an implementation known as Type Erasure.',
          'During compilation by javac, all generic type parameters—such as the T in List<T> or Box<T>—are completely erased and replaced by their upper bound, which defaults to Object.',
          'Because the compiled bytecode .class file knows nothing about T at runtime, the compiler automatically inserts synthetic checkcast bytecode instructions at every call site where a generic value is retrieved.',
          'Furthermore, when a class implements a generic interface with specific types, the compiler synthesizes synthetic Bridge Methods in bytecode to preserve polymorphic method overriding across erasured boundaries.',
          'Understanding type erasure explains why you cannot instantiate a generic array directly (new T[10] fails) and why primitive types cannot be used directly as generic arguments without boxing overhead.'
        ],
        example: 'Think of shipping boxes labeled with dry-erase markers. While in your warehouse office, you write "FRAGILE CRYSTAL VASES" on the outside (compile-time type safety). But before loading onto the delivery truck, a clerk wipes off the marker and stamps "STANDARD CARGO" on all boxes (type erasure to Object). When the destination warehouse receives the box, a security scanner inspects the contents to verify they are indeed vases (synthetic checkcast instruction).',
        code: `// Simulation: Java Generics Type Erasure & Bytecode checkcast Synthesis
class GenericBoxSimulator<T> {
  private item: T;

  constructor(item: T) {
    this.item = item;
  }

  get(): T {
    return this.item;
  }

  // JVM bytecode inspection simulation:
  // In compiled .class bytecode, T is erased to Object (or upper bound).
  // The compiler inserts synthetic checkcast instructions at call sites.
  inspectBytecodeSignature(): {
    sourceSignature: string;
    erasedBytecodeDescriptor: string;
    syntheticCheckcastInserted: boolean;
  } {
    return {
      sourceSignature: 'T get()',
      erasedBytecodeDescriptor: 'Ljava/lang/Object; get()',
      syntheticCheckcastInserted: true
    };
  }
}

const box = new GenericBoxSimulator<string>('Enterprise Service Payload');
const bytecode = box.inspectBytecodeSignature();

console.log('=== JAVA GENERICS & TYPE ERASURE IN THE JVM ===');
console.log('Source Code Method Signature: ' + bytecode.sourceSignature);
console.log('Compiled JVM Bytecode Descriptor: ' + bytecode.erasedBytecodeDescriptor + ' (T erased to Object)');
console.log('Type-Safety Guarantee: Synthetic checkcast opcode inserted by javac at call sites');
console.log('Payload Retrieved: ' + box.get());`,
        output: `=== JAVA GENERICS & TYPE ERASURE IN THE JVM ===\nSource Code Method Signature: T get()\nCompiled JVM Bytecode Descriptor: Ljava/lang/Object; get() (T erased to Object)\nType-Safety Guarantee: Synthetic checkcast opcode inserted by javac at call sites\nPayload Retrieved: Enterprise Service Payload`,
        tryIt: 'Modify the generic bound to simulate an upper bound like <T extends Comparable<T>> and observe the erased descriptor change.',
        check: {
          question: 'What happens to generic type parameters like T in Java source code when compiled into JVM bytecode (.class files)?',
          options: [
            'They are preserved as native hardware CPU register types',
            'They are erased and replaced by Object (or their upper bound), with javac inserting synthetic checkcast instructions at call sites',
            'They are converted into JavaScript strings'
          ],
          answer: 1,
          why: 'Java implements generics via Type Erasure for backwards compatibility. At runtime, generic parameters are replaced by Object (or bounds), and javac emits checkcast opcodes to verify types safely at call sites.'
        }
      },
      {
        title: 'Java Reflection API & Runtime Dynamic Introspection',
        say: [
          'The Java Reflection API allows programs to inspect and manipulate classes, methods, fields, and constructors dynamically at runtime without compile-time knowledge of their names.',
          'Frameworks like Spring, Hibernate, and Jackson rely heavily on reflection: when Jackson deserializes JSON into a Java POJO, it inspects field names and private setters dynamically.',
          'Using java.lang.Class and java.lang.reflect.Method, developers can query method signatures, setAccessible(true) on private fields, and invoke methods dynamically.',
          'However, traditional reflection incurs significant performance overhead: it bypasses JIT compiler optimizations like method inlining, requires boxing and unboxing of primitive arguments, and performs security manager access checks on every invocation.',
          'In modern high-performance Java, reflection has evolved: Java 7 introduced the java.lang.invoke.MethodHandle API, which allows the JIT compiler to inline dynamically bound calls nearly as fast as direct static method invocations.',
          'Understanding reflection enables engineers to build modular plugin architectures and understand how enterprise dependency injection frameworks operate beneath the surface.'
        ],
        example: 'Think of a universal remote control. A standard TV button is hardwired to a specific circuit board (direct compile-time method call). A universal learning remote has a sensor that listens to whatever infrared frequency the television emits, stores the signal by name, and blasts that exact signal when requested (dynamic reflection dispatch).',
        code: `// Simulation: Java Reflection API & Dynamic Method Dispatch
class ReflectionSimulator {
  private methods: Map<string, (...args: any[]) => any> = new Map();

  register(target: any) {
    const proto = Object.getPrototypeOf(target);
    for (const name of Object.getOwnPropertyNames(proto)) {
      if (typeof target[name] === 'function' && name !== 'constructor') {
        this.methods.set(name, target[name].bind(target));
      }
    }
  }

  invoke(methodName: string, ...args: any[]): any {
    const fn = this.methods.get(methodName);
    if (!fn) throw new Error('NoSuchMethodException: ' + methodName);
    return fn(...args);
  }
}

class OrderWorkflow {
  calculateDiscount(total: number, tier: string): number {
    const rate = tier === 'VIP' ? 0.20 : 0.05;
    return total * (1 - rate);
  }
}

const workflow = new OrderWorkflow();
const reflector = new ReflectionSimulator();
reflector.register(workflow);

const discounted = reflector.invoke('calculateDiscount', 500, 'VIP');

console.log('=== JAVA REFLECTION API & DYNAMIC INVOCATION ===');
console.log('Target Class: OrderWorkflow');
console.log('Method Dynamically Dispatched via Reflection: calculateDiscount(500, VIP)');
console.log('Discounted Result: $' + discounted.toFixed(2));
console.log('Performance Invariant: Reflection bypasses JIT inlining; use MethodHandle for hot paths');`,
        output: `=== JAVA REFLECTION API & DYNAMIC INVOCATION ===\nTarget Class: OrderWorkflow\nMethod Dynamically Dispatched via Reflection: calculateDiscount(500, VIP)\nDiscounted Result: $400.00\nPerformance Invariant: Reflection bypasses JIT inlining; use MethodHandle for hot paths`,
        tryIt: 'Invoke a non-existent method name to observe how the Reflection API throws NoSuchMethodException.',
        check: {
          question: 'Why does traditional Java Reflection incur higher CPU latency than direct method calls?',
          options: [
            'Because reflective calls bypass JIT compiler inlining, require argument array boxing, and perform runtime security checks',
            'Because reflection requires turning off the computer monitor',
            'Because reflection deletes the compiled class file from disk'
          ],
          answer: 0,
          why: 'Direct method calls can be aggressively inlined by the JIT C2 compiler into native assembly. Reflection introduces dynamic lookup indirection, parameter array boxing, and runtime permission checks that prevent inlining.'
        }
      },
      {
        title: 'Custom Annotations & Runtime Metadata Processing',
        say: [
          'Java Annotations provide structured metadata about classes, methods, and parameters without directly affecting program logic on their own.',
          'Every custom annotation is defined using the @interface keyword and configured with two essential meta-annotations: @Target and @Retention.',
          'The @Target meta-annotation specifies where the annotation may be applied, such as ElementType.METHOD, ElementType.FIELD, or ElementType.TYPE.',
          'The @Retention meta-annotation is the critical architectural switch: RetentionPolicy.SOURCE discards the annotation during compilation (like @Override), RetentionPolicy.CLASS retains it in bytecode but discards it at runtime, while RetentionPolicy.RUNTIME preserves the metadata in JVM memory so frameworks can inspect it via reflection.',
          'Enterprise frameworks like Spring Boot use runtime annotations—such as @GetMapping, @Transactional, and @RolesAllowed—to construct declarative routing and security authorization filters.',
          'By reading annotation metadata during container startup, systems decouple infrastructure concerns like authorization and logging from core business logic.'
        ],
        example: 'Think of food packaging nutrition labels. The ingredients and calorie counts printed on the cereal box (@interface NutritionLabel) do not change the taste of the flakes inside. But grocery store checkout scanners and FDA inspectors read those labels at checkout time (@Retention(RUNTIME)) to enforce dietary laws and calculate sales tax.',
        code: `// Simulation: Custom Annotation Metadata Registry & RBAC Access Enforcement
interface RouteMetadata {
  path: string;
  httpMethod: 'GET' | 'POST';
  rolesAllowed: string[];
}

class AnnotationRegistrySimulator {
  private routes: Map<string, RouteMetadata> = new Map();

  registerEndpoint(methodName: string, metadata: RouteMetadata) {
    this.routes.set(methodName, metadata);
  }

  evaluateAccess(methodName: string, userRole: string): { allowed: boolean; reason: string } {
    const meta = this.routes.get(methodName);
    if (!meta) return { allowed: false, reason: '404 Not Found' };
    if (!meta.rolesAllowed.includes(userRole)) {
      return { allowed: false, reason: '403 Forbidden: Missing required role ' + meta.rolesAllowed.join(',') };
    }
    return { allowed: true, reason: '200 OK: Authorized for ' + meta.path };
  }
}

const registry = new AnnotationRegistrySimulator();
// Simulating @GetMapping("/admin/audit") & @RolesAllowed({"ADMIN"})
registry.registerEndpoint('viewAuditLog', {
  path: '/admin/audit',
  httpMethod: 'GET',
  rolesAllowed: ['ADMIN']
});

const memberAttempt = registry.evaluateAccess('viewAuditLog', 'MEMBER');
const adminAttempt = registry.evaluateAccess('viewAuditLog', 'ADMIN');

console.log('=== CUSTOM ANNOTATIONS & RUNTIME METADATA PROCESSING ===');
console.log('Annotation Target: @GetMapping("/admin/audit") @RolesAllowed({"ADMIN"})');
console.log('Evaluation (Member Role): ' + memberAttempt.reason);
console.log('Evaluation (Admin Role): ' + adminAttempt.reason);
console.log('Runtime Invariant: @Retention(RetentionPolicy.RUNTIME) preserves metadata in byte code');`,
        output: `=== CUSTOM ANNOTATIONS & RUNTIME METADATA PROCESSING ===\nAnnotation Target: @GetMapping("/admin/audit") @RolesAllowed({"ADMIN"})\nEvaluation (Member Role): 403 Forbidden: Missing required role ADMIN\nEvaluation (Admin Role): 200 OK: Authorized for /admin/audit\nRuntime Invariant: @Retention(RetentionPolicy.RUNTIME) preserves metadata in byte code`,
        tryIt: 'Add another role "AUDITOR" to the rolesAllowed array and verify access is granted.',
        check: {
          question: 'Which RetentionPolicy must a Java custom annotation use if it needs to be read dynamically at runtime via reflection?',
          options: [
            'RetentionPolicy.RUNTIME',
            'RetentionPolicy.SOURCE',
            'RetentionPolicy.CLASS'
          ],
          answer: 0,
          why: 'RetentionPolicy.RUNTIME is the only policy that instructs javac to record annotation metadata into the .class bytecode and load it into JVM memory so it can be queried via Class.getAnnotation().'
        }
      },
      {
        title: 'Java 21 Sealed Classes & Pattern Matching Switch',
        say: [
          'In enterprise domain modeling, uncontrolled class inheritance can lead to severe architectural fragmentation when arbitrary third-party subclasses break domain assumptions.',
          'Java 17 and 21 introduced Sealed Classes and Interfaces to solve this. A sealed class explicitly restricts which other classes or interfaces may extend or implement it using the permits keyword.',
          'By defining a closed algebraic data type—such as sealed interface PaymentEvent permits CardPayment, CryptoPayment, WirePayment—the domain model guarantees that no unexpected event subtypes can ever exist.',
          'This enables a monumental feature in Java 21: Pattern Matching for switch expressions.',
          'When switching over a sealed type hierarchy, the compiler performs Exhaustiveness Checking: because it knows every permitted subtype at compile time, no default branch is required.',
          'If a developer adds a new permitted subclass in the future, the compiler immediately produces a compile-time error at every switch statement that handles the hierarchy, completely eliminating forgotten edge-case bugs in production.'
        ],
        example: 'Think of an electric car transmission selector. The gear lever only has three physically permitted mechanical notches: Park, Reverse, and Drive (a sealed interface). There is physically no fourth option. The vehicle computer does not need a fallback "unknown gear" branch; every possible valid state is guaranteed and accounted for by mechanical design.',
        code: `// Simulation: Java 21 Sealed Hierarchy Exhaustive Pattern Matching
type PaymentEvent =
  | { type: 'CARD'; panLast4: string; amount: number }
  | { type: 'CRYPTO'; txHash: string; network: 'ETHEREUM' | 'SOLANA' }
  | { type: 'WIRE'; iban: string; swift: string };

function processPaymentPatternMatch(event: PaymentEvent): string {
  switch (event.type) {
    case 'CARD':
      return 'Card Charged: *' + event.panLast4 + ' ($' + event.amount + ')';
    case 'CRYPTO':
      return 'Crypto Confirmed: ' + event.network + ' (Tx: ' + event.txHash.slice(0, 8) + '...)';
    case 'WIRE':
      return 'Wire Cleared: ' + event.swift + ' / ' + event.iban;
  }
}

const card = processPaymentPatternMatch({ type: 'CARD', panLast4: '4242', amount: 1250 });
const crypto = processPaymentPatternMatch({ type: 'CRYPTO', txHash: '0x8f3c1b29a', network: 'ETHEREUM' });

console.log('=== JAVA 21 SEALED CLASSES & PATTERN MATCHING SWITCH ===');
console.log('Pattern Match 1: ' + card);
console.log('Pattern Match 2: ' + crypto);
console.log('Exhaustiveness Guarantee: Compiler verifies all sealed permits are handled without default branch');`,
        output: `=== JAVA 21 SEALED CLASSES & PATTERN MATCHING SWITCH ===\nPattern Match 1: Card Charged: *4242 ($1250)\nPattern Match 2: Crypto Confirmed: ETHEREUM (Tx: 0x8f3c1b...)\nExhaustiveness Guarantee: Compiler verifies all sealed permits are handled without default branch`,
        tryIt: 'Add a WIRE payment event to the simulation and observe the exhaustiveness pattern match output.',
        check: {
          question: 'What major compile-time guarantee do Java 21 Sealed Classes provide when used with switch pattern matching?',
          options: [
            'Exhaustiveness Checking: the compiler verifies that every permitted subtype is handled, removing the need for a default clause',
            'They guarantee that the JVM will never run out of memory',
            'They automatically encrypt the source code with AES-256'
          ],
          answer: 0,
          why: 'Because a sealed class explicitly enumerates all permitted subtypes, the compiler knows the full domain universe and guarantees exhaustiveness in switch expressions without requiring a defensive default branch.'
        }
      },
      {
        title: 'ClassLoader Hierarchy & Dynamic Isolation (Parent Delegation Model)',
        say: [
          'In enterprise application servers and modular container systems, classloading is the foundation of security and runtime isolation.',
          'The Java Virtual Machine organizes classloaders into a strict three-tier hierarchy: the Bootstrap ClassLoader (written in native C/C++ to load core classes like java.lang.String from the JDK runtime), the Platform/Extension ClassLoader, and the Application/System ClassLoader (which loads classes from your classpath).',
          'Classloaders adhere to the Parent Delegation Model: when asked to load a class, a classloader must always delegate the request to its parent loader before attempting to search its own classpath.',
          'This model enforces a critical security invariant: a malicious plugin or third-party dependency cannot provide its own counterfeit java.lang.String or java.lang.System class to hijack credentials, because the Bootstrap ClassLoader always loads the official JDK classes first.',
          'In modular microservice and plugin architectures (such as OSGi or Tomcat webapp containers), custom classloaders are used to create isolated class namespaces.',
          'This allows two independent plugins running in the same JVM process to load different, conflicting versions of the same library (such as Jackson 2.12 and Jackson 2.15) without classpath collisions.'
        ],
        example: 'Think of military chain-of-command clearances. If a junior private (Application ClassLoader) receives a request to open a classified file, they must first ask their sergeant (Platform ClassLoader), who in turn asks the general (Bootstrap ClassLoader). Only if the general and sergeant have no jurisdiction is the private allowed to handle it locally.',
        code: `// Simulation: JVM ClassLoader Hierarchy & Parent Delegation Security Model
class ClassLoaderSimulator {
  name: string;
  parent: ClassLoaderSimulator | null;
  loadedClasses: Set<string> = new Set();

  constructor(name: string, parent: ClassLoaderSimulator | null = null) {
    this.name = name;
    this.parent = parent;
  }

  loadClass(className: string): string {
    // Parent Delegation Model: Always ask parent first!
    if (this.parent) {
      try {
        return this.parent.loadClass(className);
      } catch {
        // Parent could not find it; child attempts to load
      }
    }

    if (this.name === 'BootstrapClassLoader' && className.startsWith('java.lang.')) {
      this.loadedClasses.add(className);
      return 'Loaded by ' + this.name;
    }

    if (this.name === 'AppClassLoader' && className.startsWith('com.enterprise.')) {
      this.loadedClasses.add(className);
      return 'Loaded by ' + this.name;
    }

    if (this.name === 'PluginClassLoader' && className.startsWith('com.plugin.')) {
      this.loadedClasses.add(className);
      return 'Loaded by ' + this.name + ' (Isolated Sandbox)';
    }

    throw new Error('ClassNotFoundException: ' + className);
  }
}

const bootstrap = new ClassLoaderSimulator('BootstrapClassLoader', null);
const appLoader = new ClassLoaderSimulator('AppClassLoader', bootstrap);
const pluginLoader = new ClassLoaderSimulator('PluginClassLoader', appLoader);

const stringLoad = pluginLoader.loadClass('java.lang.String');
const serviceLoad = pluginLoader.loadClass('com.enterprise.OrderService');
const customPluginLoad = pluginLoader.loadClass('com.plugin.CustomReport');

console.log('=== CLASSLOADER HIERARCHY & PARENT DELEGATION MODEL ===');
console.log('Delegation 1 (java.lang.String): ' + stringLoad);
console.log('Delegation 2 (com.enterprise.OrderService): ' + serviceLoad);
console.log('Delegation 3 (com.plugin.CustomReport): ' + customPluginLoad);
console.log('Security Invariant: Parent delegation prevents rogue plugins from overriding core Java classes');`,
        output: `=== CLASSLOADER HIERARCHY & PARENT DELEGATION MODEL ===\nDelegation 1 (java.lang.String): Loaded by BootstrapClassLoader\nDelegation 2 (com.enterprise.OrderService): Loaded by AppClassLoader\nDelegation 3 (com.plugin.CustomReport): Loaded by PluginClassLoader (Isolated Sandbox)\nSecurity Invariant: Parent delegation prevents rogue plugins from overriding core Java classes`,
        tryIt: 'Attempt to load an unregistered class name to observe the ClassNotFoundException.',
        check: {
          question: 'Why does the JVM enforce the Parent Delegation Model in its ClassLoader architecture?',
          options: [
            'To prevent untrusted code from overriding core Java platform classes (like java.lang.String) and ensure consistent class uniqueness',
            'To double the RAM usage of the operating system',
            'To force all Java programs to run slower'
          ],
          answer: 0,
          why: 'The Parent Delegation Model guarantees that core system classes loaded by the Bootstrap ClassLoader take precedence, preventing untrusted or malicious classes from replacing foundational runtime types.'
        }
      }
    ],
    summary: [
      'Java Generics use compile-time Type Erasure to maintain backwards compatibility, with javac emitting synthetic checkcast opcodes.',
      'The Reflection API provides runtime introspection of classes and methods, while MethodHandles provide JIT-optimizable dynamic invocation.',
      'Custom annotations configured with @Retention(RetentionPolicy.RUNTIME) preserve metadata in bytecode for framework inspection.',
      'Java 21 Sealed Classes permit explicit subtypes, enabling exhaustive pattern matching switch expressions without default clauses.',
      'The ClassLoader hierarchy enforces the Parent Delegation Model, preventing rogue classes from overriding core JDK runtime types.'
    ],
    projectStep: {
      title: 'Architect a Modular Plugin Container with Dynamic Reflection & Sealed Events',
      steps: [
        'Define a sealed hierarchy of enterprise domain events (OrderCreated, PaymentCaptured, RefundIssued).',
        'Implement an isolated custom ClassLoader that safely sandboxes third-party plugin classes.',
        'Use the Reflection API and custom @PluginEndpoint annotations to discover and register event handlers.',
        'Implement an exhaustive pattern-matching dispatch loop in Java 21 to process events with zero unhandled cases.'
      ]
    }
  },
  {
    coursePrefix: 'java-basics',
    day: 4,
    title: 'Reactive WebFlux, Netty EventLoop, Backpressure Strategies & R2DBC',
    goal: 'Master modern reactive asynchronous programming in Enterprise Java: Project Reactor streams (Mono and Flux), Netty non-blocking EventLoop architecture, Reactive Streams specification backpressure strategies (BUFFER, DROP, LATEST, ERROR), fully non-blocking database transactions with R2DBC, and distributed tracing with Micrometer and OpenTelemetry.',
    minutes: 45,
    recap: 'In Day 3, we mastered Generics type erasure, Reflection dynamic dispatch, custom runtime annotations, Java 21 Sealed classes with exhaustive pattern matching, and ClassLoader hierarchy sandboxing. Now, in Day 4, we advance into cutting-edge enterprise concurrency: reactive streams, non-blocking I/O event loops, backpressure flow control, asynchronous reactive database access, and distributed tracing.',
    parts: [
      {
        title: 'Reactive Streams: Mono, Flux & Functional Transformation Pipelines',
        say: [
          'In traditional enterprise architectures, applications rely on synchronous blocking calls: when a thread requests data from a database or downstream microservice, that operating system thread sits idle, blocked in kernel wait states until bytes return.',
          'Under high concurrency, thread-per-request models exhaust system memory: each Java thread requires an OS stack (typically 1MB) and high context-switching CPU overhead.',
          'Project Reactor and Spring WebFlux solve this by implementing the Reactive Streams specification, founded on the Publisher-Subscriber paradigm. Instead of pulling data synchronously, applications assemble asynchronous, declarative processing pipelines.',
          'Reactor provides two foundational reactive types: Mono represents an asynchronous stream of 0 or 1 element, while Flux represents an asynchronous stream of 0 to N (or infinite) elements.',
          'Reactive pipelines are "cold" by default: nothing happens, and zero CPU cycles are spent until a Subscriber subscribes to the publisher. Once subscribed, data flows asynchronously through functional operators such as map, filter, and flatMap.',
          'This non-blocking architecture allows a single server to handle tens of thousands of concurrent client requests with minimal memory overhead.'
        ],
        example: 'Think of an industrial conveyor belt equipped with optical sensors and robotic sorters. Instead of a worker picking up each package and walking it over to inspection, packages stream past continuous stationary sensors. If an item fails weight criteria, a pneumatic piston knocks it into a discard bin without slowing down the conveyor line.',
        code: `// Simulation: Project Reactor Mono & Flux Reactive Stream Pipelines
interface ReactiveEmission<T> {
  value: T;
  timestampMs: number;
}

class ReactiveStreamSimulator<T> {
  private items: T[] = [];

  constructor(items: T[]) {
    this.items = items;
  }

  static just<T>(...values: T[]): ReactiveStreamSimulator<T> {
    return new ReactiveStreamSimulator(values);
  }

  filter(predicate: (item: T) => boolean): ReactiveStreamSimulator<T> {
    return new ReactiveStreamSimulator(this.items.filter(predicate));
  }

  map<R>(transform: (item: T) => R): ReactiveStreamSimulator<R> {
    return new ReactiveStreamSimulator(this.items.map(transform));
  }

  subscribe(onNext: (item: T) => void, onComplete: () => void): void {
    for (const item of this.items) {
      onNext(item);
    }
    onComplete();
  }
}

console.log('=== REACTIVE STREAMS: MONO & FLUX STREAM COMPOSITION ===');
const ordersFlux = ReactiveStreamSimulator.just(
  { id: 101, amount: 250, currency: 'USD' },
  { id: 102, amount: 45, currency: 'USD' },
  { id: 103, amount: 1200, currency: 'EUR' },
  { id: 104, amount: 15, currency: 'USD' }
)
  .filter(o => o.amount >= 50)
  .map(o => 'ORDER_VERIFIED: #' + o.id + ' (' + o.amount + ' ' + o.currency + ')');

const verifiedOrders: string[] = [];
ordersFlux.subscribe(
  order => verifiedOrders.push(order),
  () => console.log('Flux Stream Completed: ' + verifiedOrders.length + ' orders filtered')
);
console.log('Processed Stream: ' + verifiedOrders.join(' | '));
console.log('Reactive Invariant: Zero threads blocked during pipeline execution');`,
        output: `=== REACTIVE STREAMS: MONO & FLUX STREAM COMPOSITION ===
Flux Stream Completed: 2 orders filtered
Processed Stream: ORDER_VERIFIED: #101 (250 USD) | ORDER_VERIFIED: #103 (1200 EUR)
Reactive Invariant: Zero threads blocked during pipeline execution`,
        tryIt: 'Change the filter threshold to 500 to observe how only the 1200 EUR order passes through the stream.',
        check: {
          question: 'In Project Reactor, what is the fundamental difference between Mono<T> and Flux<T>?',
          options: [
            'Mono emits at most 1 item (0..1), whereas Flux emits an asynchronous stream of multiple items (0..N)',
            'Mono blocks the CPU thread, whereas Flux is always non-blocking',
            'Mono can only be used with PostgreSQL databases',
            'Flux only works in single-threaded environments'
          ],
          answer: 0,
          why: 'In Project Reactor, Mono<T> represents an asynchronous pipeline emitting 0 or 1 element (or an error), while Flux<T> represents a publisher that emits 0 to N elements over time.'
        }
      },
      {
        title: 'Netty EventLoop Architecture & Non-Blocking Epoll Socket I/O',
        say: [
          'Under the hood, Spring WebFlux replaces traditional servlet containers like Apache Tomcat with Netty, a high-performance asynchronous event-driven network application framework.',
          'Traditional servlet engines dedicate one OS thread per HTTP request. When 5,000 clients connect simultaneously, the operating system struggles with 5,000 active thread stacks and crippling context-switching latency.',
          'Netty uses an EventLoop architecture powered by operating system I/O multiplexing primitives such as epoll on Linux or kqueue on macOS.',
          'An EventLoop consists of a single execution thread bound to an I/O Selector that continuously polls thousands of non-blocking socket channels.',
          'When an HTTP request arrives, the OS notifies the Selector, which dispatches a read event to the EventLoop. The thread processes the incoming bytes, passes them to your reactive WebFlux handler, and immediately returns to polling the selector for other channels.',
          'Because the EventLoop thread never sleeps or blocks on I/O, a handful of threads (typically matching CPU core count) can effortlessly sustain 100,000 concurrent network connections.'
        ],
        example: 'Think of a single experienced airport air-traffic controller handling 50 airplanes simultaneously using a radar screen, versus hiring 50 separate air-traffic controllers where each controller must run outside to the tarmac to look at one airplane through binoculars.',
        code: `// Simulation: Netty EventLoop Selector Multiplexing
interface SocketChannel {
  fd: number;
  clientIp: string;
  bytesPending: number;
}

class NettyEventLoopSimulator {
  private channels: Map<number, SocketChannel> = new Map();
  private coreWorkerThreadId: number;

  constructor(workerId: number) {
    this.coreWorkerThreadId = workerId;
  }

  registerChannel(channel: SocketChannel): void {
    this.channels.set(channel.fd, channel);
  }

  pollSelectors(): { processedCount: number; activeFdList: number[] } {
    const activeFds: number[] = [];
    for (const [fd, chan] of this.channels.entries()) {
      if (chan.bytesPending > 0) {
        activeFds.push(fd);
      }
    }
    return {
      processedCount: activeFds.length,
      activeFdList: activeFds
    };
  }
}

const eventLoop = new NettyEventLoopSimulator(1);
eventLoop.registerChannel({ fd: 12, clientIp: '192.168.1.5', bytesPending: 1024 });
eventLoop.registerChannel({ fd: 14, clientIp: '192.168.1.18', bytesPending: 0 });
eventLoop.registerChannel({ fd: 17, clientIp: '192.168.1.29', bytesPending: 2048 });

const loopMetrics = eventLoop.pollSelectors();

console.log('=== NETTY EVENTLOOP & NON-BLOCKING SOCKET MULTIPLEXING ===');
console.log('Active Sockets Ready for Read: ' + loopMetrics.processedCount);
console.log('Multiplexed File Descriptors: [' + loopMetrics.activeFdList.join(', ') + ']');
console.log('Concurrency Architecture: Single EventLoop servicing 10,000+ connections without thread switches');`,
        output: `=== NETTY EVENTLOOP & NON-BLOCKING SOCKET MULTIPLEXING ===
Active Sockets Ready for Read: 2
Multiplexed File Descriptors: [12, 17]
Concurrency Architecture: Single EventLoop servicing 10,000+ connections without thread switches`,
        tryIt: 'Add a new socket channel with 4096 pending bytes and verify it is captured by the pollSelectors dispatch loop.',
        check: {
          question: 'Why can a Netty EventLoop handle tens of thousands of concurrent connections with only a few worker threads?',
          options: [
            'It leverages non-blocking OS I/O selectors (epoll/kqueue) to multiplex thousands of sockets on single event loops without blocking threads on I/O waits',
            'It spawns a new physical thread for each byte of data transferred',
            'It converts all TCP network traffic into UDP datagrams',
            'It runs exclusively inside the GPU graphics pipeline'
          ],
          answer: 0,
          why: 'Netty uses non-blocking I/O multiplexing: worker threads never block waiting for socket data, allowing a single thread per CPU core to service thousands of active network connections.'
        }
      },
      {
        title: 'Reactive Backpressure Strategies: BUFFER, DROP, LATEST & ERROR',
        say: [
          'In asynchronous distributed systems, a fast producer can emit events at 100,000 items per second, while a slow downstream consumer (such as an external payment gateway or disk writer) can only process 1,000 items per second.',
          'In unmanaged systems, this speed disparity causes unbounded memory buffers to grow until the JVM crashes with an OutOfMemoryError (OOM).',
          'The Reactive Streams specification solves this with Backpressure: the consumer signals demand upstream using Subscription.request(n), asking for only as many items as it can currently process.',
          'When burst traffic arrives, Project Reactor provides four explicit onBackpressure operators to govern excess elements:',
          'onBackpressureBuffer stores items in a bounded in-memory buffer until capacity is reached; onBackpressureDrop discards incoming items that exceed consumer demand; onBackpressureLatest keeps only the single most recent item, discarding intermediate noise; onBackpressureError immediately terminates the stream with an OverflowException.',
          'Selecting the appropriate backpressure strategy guarantees system resilience under catastrophic production traffic spikes.'
        ],
        example: 'Think of a hydroelectric dam reservoir during a monsoon storm. If floodwaters enter faster than the city power plant can absorb, opening the spillway gates (DROP or LATEST) lets excess water bypass the turbines safely, preventing the dam wall from catastrophic structural collapse (OutOfMemoryError).',
        code: `// Simulation: Reactive Streams Backpressure Flow Control Engine
type BackpressureStrategy = 'BUFFER' | 'DROP' | 'LATEST' | 'ERROR';

class BackpressureBufferSimulator {
  private capacity: number;
  private strategy: BackpressureStrategy;
  private queue: number[] = [];
  public droppedCount: number = 0;

  constructor(capacity: number, strategy: BackpressureStrategy) {
    this.capacity = capacity;
    this.strategy = strategy;
  }

  emit(item: number): boolean {
    if (this.queue.length < this.capacity) {
      this.queue.push(item);
      return true;
    }

    switch (this.strategy) {
      case 'DROP':
        this.droppedCount++;
        return false;
      case 'LATEST':
        this.queue.pop();
        this.queue.push(item);
        return true;
      case 'ERROR':
        throw new Error('OverflowException: Backpressure buffer full');
      case 'BUFFER':
        this.queue.push(item);
        return true;
    }
  }

  getBufferState(): { size: number; contents: number[]; dropped: number } {
    return { size: this.queue.length, contents: [...this.queue], dropped: this.droppedCount };
  }
}

const dropController = new BackpressureBufferSimulator(3, 'DROP');
[10, 20, 30, 40, 50].forEach(n => dropController.emit(n));
const dropState = dropController.getBufferState();

console.log('=== REACTIVE STREAMS BACKPRESSURE FLOW CONTROL ===');
console.log('DROP Strategy (Cap 3, Sent 5): Kept [' + dropState.contents.join(', ') + '], Dropped: ' + dropState.dropped);
console.log('LATEST Strategy (Cap 3, Sent 5): Maintained latest items without memory exhaustion');
console.log('Reactive Invariant: Backpressure preserves downstream consumer from out-of-memory collapse');`,
        output: `=== REACTIVE STREAMS BACKPRESSURE FLOW CONTROL ===
DROP Strategy (Cap 3, Sent 5): Kept [10, 20, 30], Dropped: 2
LATEST Strategy (Cap 3, Sent 5): Maintained latest items without memory exhaustion
Reactive Invariant: Backpressure preserves downstream consumer from out-of-memory collapse`,
        tryIt: 'Modify the capacity from 3 to 4 and verify that only 1 item is dropped.',
        check: {
          question: 'What is the primary function of Backpressure in the Reactive Streams specification?',
          options: [
            'To allow downstream consumers to signal demand upstream, preventing fast producers from overwhelming consumer memory',
            'To automatically encrypt all network traffic using SSL',
            'To compress database tables before saving them to disk',
            'To pause the CPU clock during network spikes'
          ],
          answer: 0,
          why: 'Backpressure gives downstream consumers flow control over producers via Subscription.request(n), ensuring consumers never receive more elements than their memory and processing buffers can handle.'
        }
      },
      {
        title: 'Non-Blocking Reactive Relational Database Connectivity (R2DBC)',
        say: [
          'For decades, Java applications connected to relational databases using JDBC (Java Database Connectivity). However, the entire JDBC specification is inherently synchronous and blocking.',
          'If a Spring WebFlux application executes a traditional blocking JDBC query on a Netty EventLoop thread, that EventLoop freezes until the database responds, destroying the non-blocking benefits of the entire server.',
          'R2DBC (Reactive Relational Database Connectivity) was created to bring non-blocking, reactive drivers to traditional SQL relational databases such as PostgreSQL, MySQL, and Microsoft SQL Server.',
          'R2DBC drivers communicate with databases over asynchronous socket protocols. Database query results return as a Flux<Row>, streaming individual database records directly to the client as they arrive over the wire.',
          'R2DBC supports reactive transaction management: developers use DatabaseClient or Spring Data R2DBC repositories to execute transactional queries reactively using operators like transactional().',
          'By eliminating blocking threads across the entire pipeline—from HTTP ingress to database disk reads—enterprises achieve end-to-end non-blocking throughput.'
        ],
        example: 'Think of ordering food at a modern fast-casual restaurant with a vibrating pager buzzer (R2DBC asynchronous notification), versus standing at the kitchen counter staring directly at the grill cook until your burger is done (blocking JDBC thread stall).',
        code: `// Simulation: R2DBC Reactive Relational Database Pool & Query Pipeline
interface R2dbcConnection {
  id: number;
  inUse: boolean;
}

class R2dbcPoolSimulator {
  private pool: R2dbcConnection[] = [];

  constructor(maxSize: number) {
    for (let i = 1; i <= maxSize; i++) {
      this.pool.push({ id: i, inUse: false });
    }
  }

  executeReactiveQuery(sql: string): { connectionId: number; status: string; rowCount: number } {
    const conn = this.pool.find(c => !c.inUse);
    if (!conn) {
      throw new Error('ConnectionAcquisitionTimeout: All connections busy');
    }
    conn.inUse = true;
    // Simulate non-blocking wire protocol execution
    conn.inUse = false; // release back immediately upon stream subscription
    return {
      connectionId: conn.id,
      status: 'ASYNC_STREAM_SUBSCRIBED',
      rowCount: 3
    };
  }
}

const r2dbc = new R2dbcPoolSimulator(5);
const queryResult = r2dbc.executeReactiveQuery('SELECT * FROM accounts WHERE balance > 1000');

console.log('=== R2DBC NON-BLOCKING RELATIONAL DATABASE CONNECTIVITY ===');
console.log('Query: SELECT * FROM accounts WHERE balance > 1000');
console.log('Execution State: ' + queryResult.status);
console.log('Connection Acquired & Reused: Connection #' + queryResult.connectionId);
console.log('Throughput Gain: Non-blocking sockets eliminate thread-parking latency overhead');`,
        output: `=== R2DBC NON-BLOCKING RELATIONAL DATABASE CONNECTIVITY ===
Query: SELECT * FROM accounts WHERE balance > 1000
Execution State: ASYNC_STREAM_SUBSCRIBED
Connection Acquired & Reused: Connection #1
Throughput Gain: Non-blocking sockets eliminate thread-parking latency overhead`,
        tryIt: 'Modify the SQL query to filter by status = "ACTIVE" and verify connection reuse.',
        check: {
          question: 'Why can traditional JDBC drivers not be used directly inside Spring WebFlux Netty EventLoops?',
          options: [
            'JDBC calls block the executing thread on socket I/O, which would freeze Netty EventLoop threads and halt concurrent request handling',
            'JDBC is only compatible with Python databases',
            'JDBC drivers require 64GB of RAM per query',
            'JDBC does not support SQL SELECT statements'
          ],
          answer: 0,
          why: 'JDBC drivers are strictly blocking; executing a blocking JDBC call on a Netty EventLoop thread stalls that entire event loop, preventing it from processing I/O for thousands of other concurrent sockets.'
        }
      },
      {
        title: 'Distributed Tracing & Context Propagation with Micrometer & OpenTelemetry',
        say: [
          'In synchronous Spring Boot applications, distributed tracing libraries like Spring Cloud Sleuth rely on Java ThreadLocal variables to pass the current TraceID and SpanID down the call stack.',
          'In reactive programming, ThreadLocal fails completely: a single HTTP request enters on Netty worker thread 1, switches to an elastic scheduler thread for disk I/O, and completes on Netty worker thread 2. Because threads change continuously, ThreadLocal data is lost.',
          'Project Reactor solves this with the Reactor Context API: an immutable key-value store that travels bound to the reactive Subscriber rather than the OS execution thread.',
          'Libraries like Micrometer Tracing and OpenTelemetry leverage the Reactor Context to attach W3C Trace Context headers (traceparent: version-traceId-spanId-flags) to outgoing reactive HTTP calls.',
          'When microservice A calls microservice B via WebClient, the traceparent header propagates across network hops, allowing distributed APM tools (like Jaeger or Zipkin) to correlate the entire transaction end-to-end.',
          'Mastering reactive context propagation ensures full observability across complex asynchronous microservice architectures.'
        ],
        example: 'Think of a cargo container shipping manifest stamped with an international customs tracking number (Trace ID) and port station stamps (Span IDs). As cranes, cargo ships, and trains take turns transporting the container, the stamped manifest travels with the cargo regardless of which driver operates the vehicle.',
        code: `// Simulation: Distributed Tracing & W3C Traceparent Header Propagator
interface TraceContext {
  traceId: string;
  spanId: string;
  sampled: boolean;
}

class ReactiveTracingPropagator {
  injectTraceHeaders(ctx: TraceContext): Record<string, string> {
    return {
      traceparent: '00-' + ctx.traceId + '-' + ctx.spanId + '-0' + (ctx.sampled ? '1' : '0')
    };
  }

  extractTraceHeaders(headers: Record<string, string>): TraceContext | null {
    const tp = headers['traceparent'];
    if (!tp) return null;
    const parts = tp.split('-');
    return {
      traceId: parts[1],
      spanId: parts[2],
      sampled: parts[3] === '01'
    };
  }
}

const tracing = new ReactiveTracingPropagator();
const initialCtx: TraceContext = {
  traceId: '4bf92f3577b34da6a3ce929d0e0e4736',
  spanId: '00f067aa0ba902b7',
  sampled: true
};

const outgoingHeaders = tracing.injectTraceHeaders(initialCtx);
const resolvedCtx = tracing.extractTraceHeaders(outgoingHeaders);

console.log('=== DISTRIBUTED TRACING & REACTOR CONTEXT PROPAGATION ===');
console.log('W3C Traceparent Header: ' + outgoingHeaders['traceparent']);
console.log('Extracted Trace ID: ' + resolvedCtx?.traceId);
console.log('Extracted Span ID: ' + resolvedCtx?.spanId);
console.log('Observability Guarantee: 100% correlation across asynchronous WebFlux microservice hops');`,
        output: `=== DISTRIBUTED TRACING & REACTOR CONTEXT PROPAGATION ===
W3C Traceparent Header: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
Extracted Trace ID: 4bf92f3577b34da6a3ce929d0e0e4736
Extracted Span ID: 00f067aa0ba902b7
Observability Guarantee: 100% correlation across asynchronous WebFlux microservice hops`,
        tryIt: 'Modify the sampled flag to false and verify that the traceparent header ends with -00.',
        check: {
          question: 'Why does traditional Java ThreadLocal storage fail for distributed tracing in Spring WebFlux applications?',
          options: [
            'Because reactive stream stages hop across multiple worker threads asynchronously, causing ThreadLocal data to be lost between operations',
            'Because ThreadLocal cannot store strings longer than 8 characters',
            'Because WebFlux disables all Java memory management',
            'Because ThreadLocal is only available in Python runtimes'
          ],
          answer: 0,
          why: 'In reactive runtimes, processing hops between different event loop and worker threads; because ThreadLocal is strictly bound to a single thread, context must be stored in the Subscriber Reactor Context instead.'
        }
      }
    ],
    summary: [
      'Project Reactor Mono (0..1) and Flux (0..N) implement the Reactive Streams specification with cold, non-blocking pipelines.',
      'Netty EventLoops use OS I/O selectors (epoll/kqueue) to multiplex thousands of concurrent sockets on a handful of CPU threads.',
      'Backpressure strategies (BUFFER, DROP, LATEST, ERROR) govern burst producer traffic to prevent downstream consumer OOM crashes.',
      'R2DBC delivers non-blocking relational database connectivity, preventing blocking JDBC driver calls from freezing Netty event loops.',
      'Distributed tracing in reactive applications relies on Reactor Context rather than ThreadLocal to propagate W3C Trace IDs across asynchronous hops.'
    ],
    projectStep: {
      title: 'Architect a Non-Blocking Reactive E-Commerce Checkout Microservice',
      steps: [
        'Compose a reactive WebFlux pipeline using Mono and Flux with declarative filtering and mapping.',
        'Configure Netty EventLoop channel multiplexing to handle high-concurrency socket connections.',
        'Implement an onBackpressureDrop strategy to protect slow payment gateway consumers during traffic surges.',
        'Connect to a PostgreSQL database using non-blocking R2DBC connection pooling and reactive queries.',
        'Propagate W3C traceparent headers across asynchronous reactive hops using Reactor Context.'
      ]
    }
  },
  {
    day: 5,
    title: 'Java 21 Enterprise Systems: Project Panama (FFM API), Project Loom Virtual Threads, Structured Concurrency & Generational ZGC',
    goal: 'Master next-generation Java 21 systems engineering: Project Panama Foreign Function & Memory (FFM) API for off-heap C interop without JNI, Project Loom million-thread virtual concurrency with carrier thread mounting, Structured Concurrency with short-circuiting task scopes, Scoped Values for allocation-free context propagation, and Generational ZGC vs G1GC low-latency garbage collection tuning.',
    minutes: 35,
    recap: 'Welcome to Next-Generation Java 21 & High-Performance JVM Engineering. Today we explore the cutting-edge innovations redefining enterprise Java: off-heap native interop without C compilers, million-scale user-mode virtual threads, structured task lifecycles, and sub-millisecond garbage collection.',
    parts: [
      {
        title: 'Project Panama (Foreign Function & Memory API): Off-Heap Arenas & C Interop without JNI',
        say: [
          'For nearly three decades, Java developers needing to call native C/C++ libraries (such as OpenSSL, TensorFlow, or high-performance GPU drivers) were forced to use the Java Native Interface (JNI). JNI was notoriously complex, slow, and unsafe: it required writing fragile boilerplate C glue code, compiling platform-specific shared libraries (.so / .dll), and any native memory error would crash the entire JVM with a catastrophic segmentation fault.',
          'Java 21 revolutionized native interoperability with Project Panama Foreign Function & Memory (FFM) API (JEP 454). The FFM API provides pure Java abstractions—MemorySegment, Arena, Linker, and SymbolLookup—allowing Java programs to allocate off-heap native memory and call C functions directly without writing a single line of C code or invoking a C compiler.',
          'Memory lifecycle is governed deterministically using Arenas. A confined arena (Arena.ofConfined()) bounds memory allocation to a single thread with strict temporal and spatial safety, preventing both use-after-free bugs and buffer overflows. When the arena closes (in a try-with-resources block), all off-heap memory is deallocated deterministically in real time without waiting for garbage collection.'
        ],
        example: 'Like an international diplomat communicating through a high-speed real-time earpiece translator (Project Panama Linker) rather than having to fly a bilingual courier back and forth with paper translations (legacy JNI).',
        code: `// Java 21 Project Panama (Foreign Function & Memory API) Simulation
class ForeignMemorySimulator {
  allocateConfined(sizeBytes: number): {
    address: string;
    size: number;
    isAccessible: boolean;
    status: string;
  } {
    return {
      address: '0x7ffd94b02000',
      size: sizeBytes,
      isAccessible: true,
      status: 'OFF_HEAP_CONFINED_ARENA_ACTIVE'
    };
  }

  invokeNativeSymbol(symbolName: string, inputLength: number): {
    symbol: string;
    cReturnType: string;
    result: number;
  } {
    return {
      symbol: symbolName,
      cReturnType: 'size_t',
      result: inputLength
    };
  }
}

const ffm = new ForeignMemorySimulator();
const segment = ffm.allocateConfined(1024);
console.log('Off-Heap Allocation Address: ' + segment.address);
console.log('Memory Segment Capacity: ' + segment.size + ' bytes');
console.log('Arena Safety Status: ' + segment.status);
const nativeCall = ffm.invokeNativeSymbol('strlen', 26);
console.log('Native C Function Invoked: ' + nativeCall.symbol);
console.log('Calculated String Length via Native Linker: ' + nativeCall.result);`,
        output: `Off-Heap Allocation Address: 0x7ffd94b02000\nMemory Segment Capacity: 1024 bytes\nArena Safety Status: OFF_HEAP_CONFINED_ARENA_ACTIVE\nNative C Function Invoked: strlen\nCalculated String Length via Native Linker: 26`,
        codeNotes: [
          { line: 3, note: 'Simulates Arena.ofConfined() allocating 1024 bytes of off-heap memory outside the JVM garbage collector' },
          { line: 14, note: 'Models Linker.nativeLinker() looking up C standard library symbols (strlen) directly from Java' },
          { line: 27, note: 'Outputs memory address and confirms zero-JNI native function binding' }
        ],
        tryIt: 'Simulate allocating an off-heap buffer of 4096 bytes and observe how spatial bounds are enforced.',
        check: {
          question: 'What is the primary advantage of Project Panama FFM API over the legacy Java Native Interface (JNI)?',
          options: [
            'It enables pure Java code to safely allocate off-heap memory and invoke native C functions without writing C wrapper code or compiling JNI binaries',
            'It allows Java to run directly on PlayStation 1 hardware',
            'It permanently disables all garbage collection across the operating system',
            'It requires all Java variables to be written in assembly code'
          ],
          answer: 0,
          why: 'Project Panama eliminates the need for C header files and native compilers, providing memory-safe off-heap segments and pure Java symbol linkers directly within the standard library.'
        }
      },
      {
        title: 'Project Loom Virtual Threads: Million-Thread Concurrency & Carrier Unmounting',
        say: [
          'In traditional Java concurrency, a java.lang.Thread is a Platform Thread: a 1-to-1 wrapper around an operating system kernel thread (pthread). Each platform thread consumes approximately 1 MB of stack memory and incurs expensive OS context switching overhead (~1 to 2 microseconds). Consequently, a server running 5,000 platform threads exhausts gigabytes of RAM and collapses under OS scheduler thrashing.',
          'Java 21 introduced Project Loom Virtual Threads (Thread.ofVirtual().start(...)). Virtual threads are lightweight user-space fibers managed entirely by the JVM runtime rather than the operating system kernel. A single virtual thread consumes only a few hundred bytes of heap memory, enabling a standard server to run over 1,000,000 concurrent virtual threads simultaneously.',
          'The architectural magic of virtual threads lies in Carrier Thread Mounting: virtual threads execute on a small pool of underlying carrier platform threads (typically matching the number of CPU cores). When a virtual thread executes a blocking operation (such as JDBC database queries, socket reads, or Thread.sleep), the JVM unmounts the virtual thread, copies its execution frame into heap memory, and frees the carrier thread to immediately execute another virtual thread. When the I/O event resolves, the JVM remounts the virtual thread onto any available carrier thread and resumes execution seamlessly.'
        ],
        example: 'Like an office building with 10,000 telephone lines (virtual threads) connected to a switchboard with only 16 physical copper wires leading to the outside world (carrier threads). When someone on the phone is placed on hold (blocking I/O), their call is held in software, freeing the copper wire for someone actively speaking.',
        code: `// Java 21 Project Loom Virtual Threads vs Platform Threads Benchmark Simulation
class VirtualThreadBenchmark {
  benchmarkConcurrency(taskCount: number, carrierThreads: number) {
    const memoryPerPlatformThreadKb = 1024; // 1 MB per platform thread
    const memoryPerVirtualThreadBytes = 350; // ~350 bytes per virtual thread

    const platformTotalMemoryMb = (taskCount * memoryPerPlatformThreadKb) / 1024;
    const virtualTotalMemoryMb = (taskCount * memoryPerVirtualThreadBytes) / (1024 * 1024);

    return {
      taskCount,
      carrierThreads,
      platformMemoryMb: platformTotalMemoryMb,
      virtualMemoryMb: virtualTotalMemoryMb,
      concurrencyStatus: '100K_TASKS_DISPATCHED_CLEANLY'
    };
  }
}

const bench = new VirtualThreadBenchmark();
const res = bench.benchmarkConcurrency(100000, 16);
console.log('Concurrent Task Count: ' + res.taskCount.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ','));
console.log('Underlying OS Carrier Threads: ' + res.carrierThreads);
console.log('Virtual Thread Total Heap Overhead: ' + res.virtualMemoryMb.toFixed(2) + ' MB');
console.log('Equivalent Platform Thread Memory: ' + res.platformMemoryMb.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',') + ' MB (OOM Crash avoided)');
console.log('Execution Status: ' + res.concurrencyStatus);`,
        output: `Concurrent Task Count: 100,000\nUnderlying OS Carrier Threads: 16\nVirtual Thread Total Heap Overhead: 33.38 MB\nEquivalent Platform Thread Memory: 100,000 MB (OOM Crash avoided)\nExecution Status: 100K_TASKS_DISPATCHED_CLEANLY`,
        codeNotes: [
          { line: 4, note: 'Compares 1 MB platform thread OS memory allocation vs ~350 bytes virtual thread heap frame' },
          { line: 17, note: 'Dispatches 100,000 concurrent tasks over just 16 carrier platform threads' },
          { line: 20, note: 'Demonstrates running 100K threads in only 33 MB of heap, avoiding 100 GB of platform thread memory' }
        ],
        tryIt: 'Increase task count to 500,000 and calculate the memory savings compared to platform threads.',
        check: {
          question: 'What happens when a Project Loom virtual thread executes a blocking I/O operation (e.g., waiting for a database response)?',
          options: [
            'The JVM unmounts the virtual thread from its carrier thread, parking its stack on the heap and freeing the carrier thread to run other tasks',
            'The entire operating system freezes until the database responds',
            'The JVM converts the thread into a C++ process',
            'The virtual thread is permanently deleted'
          ],
          answer: 0,
          why: 'Virtual threads do not block OS kernel threads. When blocking I/O is encountered, the JVM unmounts the fiber and reassigns the carrier thread to another pending virtual thread, maximizing CPU utilization.'
        }
      },
      {
        title: 'Structured Concurrency & Short-Circuiting Scopes (StructuredTaskScope)',
        say: [
          'In traditional multithreaded programming using ExecutorService.submit() or CompletableFuture, concurrent tasks are unstructured: threads start, branch off, and run independently without an overarching lexical hierarchy. If one task fails or throws an exception, sibling threads continue running indefinitely in the background, consuming CPU, leaking database connections, and causing silent orphan thread bugs.',
          'Java 21 introduced Structured Concurrency (JEP 453, StructuredTaskScope) to bring structural discipline to concurrent workflows. Structured Concurrency treats concurrent subtasks as a single unit of work with clear, bounded entry and exit points, just like a standard for loop or try-catch block.',
          'Using StructuredTaskScope.ShutdownOnFailure, an application forks multiple concurrent tasks (such as fetching user profile, checking order history, and contacting a credit bureau). If any subtask fails, the scope immediately cancels all remaining sibling tasks and propagates the failure. Conversely, StructuredTaskScope.ShutdownOnSuccess short-circuits the moment the fastest result arrives, cancelling all other racing queries.'
        ],
        example: 'Like a team of four firefighters searching an office: if one firefighter discovers a collapsed staircase (failure), they blow an emergency whistle, and all four firefighters immediately exit the building together rather than leaving three wandering blindly inside.',
        code: `// Java 21 Structured Concurrency (StructuredTaskScope) Simulation
interface TaskOutcome {
  name: string;
  durationMs: number;
  success: boolean;
}

class StructuredTaskScopeSimulator {
  executeFanOut(tasks: TaskOutcome[]): {
    completedTasks: string[];
    scopeStatus: 'SUCCESS' | 'CANCELLED_ON_FAILURE';
    failedTask?: string;
  } {
    const completed: string[] = [];
    for (const t of tasks) {
      if (!t.success) {
        return {
          completedTasks: completed,
          scopeStatus: 'CANCELLED_ON_FAILURE',
          failedTask: t.name
        };
      }
      completed.push(t.name);
    }
    return { completedTasks: completed, scopeStatus: 'SUCCESS' };
  }
}

const scope = new StructuredTaskScopeSimulator();
const results = scope.executeFanOut([
  { name: 'FetchUserProfile', durationMs: 25, success: true },
  { name: 'QueryOrderHistory', durationMs: 40, success: true },
  { name: 'CreditBureauCheck', durationMs: 30, success: false }, // Failure triggers instant shutdown
  { name: 'LoyaltyPointsSync', durationMs: 50, success: true }
]);

console.log('StructuredTaskScope Status: ' + results.scopeStatus);
console.log('Tasks Completed Before Failure: ' + results.completedTasks.join(', '));
console.log('Triggering Failed Task: ' + results.failedTask);
console.log('Orphan Prevention Guarantee: Sibling subtasks cancelled immediately with zero thread leaks');`,
        output: `StructuredTaskScope Status: CANCELLED_ON_FAILURE\nTasks Completed Before Failure: FetchUserProfile, QueryOrderHistory\nTriggering Failed Task: CreditBureauCheck\nOrphan Prevention Guarantee: Sibling subtasks cancelled immediately with zero thread leaks`,
        codeNotes: [
          { line: 8, note: 'Encapsulates concurrent subtask execution inside a unified lexical scope block' },
          { line: 16, note: 'Simulates ShutdownOnFailure: first failure halts the entire scope and cancels pending siblings' },
          { line: 31, note: 'Demonstrates guaranteed cancellation of LoyaltyPointsSync, preventing thread leakage' }
        ],
        tryIt: 'Change CreditBureauCheck success to true and observe how all four subtasks complete under status SUCCESS.',
        check: {
          question: 'How does StructuredTaskScope.ShutdownOnFailure prevent thread leaks in concurrent microservices?',
          options: [
            'If any concurrent subtask throws an exception, the scope automatically cancels all sibling subtasks before exiting the lexical block',
            'It deletes the Java source code from the server',
            'It forces all threads to wait for 60 seconds',
            'It converts all exceptions into HTTP 200 responses'
          ],
          answer: 0,
          why: 'Structured Concurrency guarantees that the lifecycle of forked subtasks cannot outlive the enclosing scope. A failure in one task short-circuits and cancels all siblings, eliminating orphaned background threads.'
        }
      },
      {
        title: 'Scoped Values: Immutable Allocation-Free Context for Virtual Threads',
        say: [
          'For decades, Java applications used ThreadLocal to pass ambient context (such as User Authentication, Tenant ID, and Transaction ID) down deep call stacks without cluttering every method signature with extra parameters. However, in an application running 1,000,000 Project Loom virtual threads, ThreadLocal becomes a severe architectural liability.',
          'Each platform or virtual thread has its own ThreadLocal map. When a virtual thread spawns child threads or inherits ThreadLocal values, the entire map is duplicated on the heap, consuming gigabytes of memory. Furthermore, ThreadLocal values are mutable (via .set()), meaning any downstream code can silently alter the security context, causing unpredictable bugs and memory leaks when threads are pooled.',
          'Java 21 introduced Scoped Values (JEP 446, ScopedValue<T>). Scoped Values provide immutable, lightweight context sharing designed specifically for virtual threads. A ScopedValue is bound to a specific lexical code scope using ScopedValue.where(KEY, value).run(...) and can be read by any method in the call stack. Once the method completes, the binding is automatically unwound with zero allocation overhead and zero risk of cross-thread contamination.'
        ],
        example: 'Like an electronic keycard issued at the security desk: the card grants you access to specific rooms for the duration of your 30-minute meeting. The moment you leave the meeting room, the electronic card automatically deactivates, leaving zero copies behind.',
        code: `// Java 21 Scoped Values (ScopedValue) Simulation
class ScopedValueSimulator {
  runScoped<T>(key: string, value: string, fn: () => T): {
    boundKey: string;
    boundValue: string;
    result: T;
  } {
    const res = fn();
    return {
      boundKey: key,
      boundValue: value,
      result: res
    };
  }
}

const scoped = new ScopedValueSimulator();
const execution = scoped.runScoped('SECURITY_CONTEXT', 'Tenant_AcmeCorp_Admin', () => {
  return 'AUTHORIZED_DATABASE_QUERY_EXECUTED';
});

console.log('Scoped Value Key: ' + execution.boundKey);
console.log('Bound Value Payload: ' + execution.boundValue);
console.log('Invocation Result: ' + execution.result);
console.log('Memory Safety: Immutable scope unwound cleanly, zero ThreadLocal memory accumulation');`,
        output: `Scoped Value Key: SECURITY_CONTEXT\nBound Value Payload: Tenant_AcmeCorp_Admin\nInvocation Result: AUTHORIZED_DATABASE_QUERY_EXECUTED\nMemory Safety: Immutable scope unwound cleanly, zero ThreadLocal memory accumulation`,
        codeNotes: [
          { line: 3, note: 'Simulates ScopedValue.where(KEY, value).run(...) binding immutable context' },
          { line: 17, note: 'Demonstrates deep invocation accessing security context without passing method parameters' },
          { line: 22, note: 'Proves context unwinds cleanly when scope terminates, preventing ThreadLocal memory leaks' }
        ],
        tryIt: 'Change the tenant value to Tenant_Retail_Guest and verify that authorization propagates down the call tree.',
        check: {
          question: 'Why are Scoped Values superior to ThreadLocal variables in high-concurrency Java 21 applications?',
          options: [
            'Scoped Values are immutable and bounded to a lexical call tree, enabling millions of virtual threads to share context with zero memory duplication',
            'Scoped Values double the CPU clock speed',
            'Scoped Values allow variables to be saved to floppy disks',
            'ThreadLocal cannot store numbers greater than 100'
          ],
          answer: 0,
          why: 'Unlike ThreadLocal, Scoped Values cannot be mutated after creation and do not allocate per-thread copies, making them hyper-efficient and safe for massive virtual thread pools.'
        }
      },
      {
        title: 'Generational ZGC vs G1GC: Sub-Millisecond Garbage Collection Tuning',
        say: [
          'In large-scale enterprise services managing 32 GB to 16 TB heaps, garbage collection pauses represent the primary source of high-percentile latency spikes (P99 and P99.9). The default Garbage-First collector (G1GC) divides the heap into thousands of equal-sized regions, achieving respectable pause times of 10 to 50 milliseconds; however, under intense allocation spikes, G1GC pauses can surge past 150 milliseconds.',
          'Java 21 introduced Generational ZGC (JEP 439, -XX:+UseZGC -XX:+ZGenerational), an extraordinary breakthrough in JVM garbage collection. ZGC is a concurrent, low-latency collector that performs all marking, relocation, and reference processing concurrently with running application threads, keeping maximum pause times strictly under 1 millisecond regardless of whether the heap is 8 GB or 16 Terabytes.',
          'ZGC achieves this using Colored Pointers and Load Barriers: metadata bits are embedded directly inside 64-bit object memory references. If an application thread attempts to read an object that is currently being relocated by ZGC, the hardware load barrier intercepts the pointer in single-digit nanoseconds, updates the address on the fly, and resumes execution without stopping the world.',
          'By introducing generational separation (collecting short-lived young generation objects more frequently than old generation), Generational ZGC reduces CPU utilization by 40% compared to single-generation ZGC while guaranteeing sub-millisecond tail latency for latency-critical trading and e-commerce platforms.'
        ],
        example: 'Like an automated cleaning robot operating inside a busy train station: instead of locking all station doors and kicking passengers out for 20 minutes to mop the floors (stop-the-world pause), the robot cleans floors concurrently alongside commuters, redirecting passengers seamlessly without halting foot traffic.',
        code: `// JVM Garbage Collection Benchmark: Generational ZGC vs G1GC Simulation
class GcBenchmarkSimulator {
  compareCollectors(heapGb: number) {
    return {
      heapSize: heapGb,
      g1gc: { avgPauseMs: 18.5, maxPauseMs: 142.0, p99PauseMs: 35.0 },
      genZgc: { avgPauseMs: 0.25, maxPauseMs: 0.95, p99PauseMs: 0.45 }
    };
  }
}

const gcSim = new GcBenchmarkSimulator();
const metrics = gcSim.compareCollectors(64);
console.log('Configured JVM Heap Size: ' + metrics.heapSize + ' GB');
console.log('G1GC P99 Pause Time: ' + metrics.g1gc.p99PauseMs + ' ms (Max: ' + metrics.g1gc.maxPauseMs + ' ms)');
console.log('Generational ZGC P99 Pause Time: ' + metrics.genZgc.p99PauseMs + ' ms (Max: ' + metrics.genZgc.maxPauseMs + ' ms)');
console.log('Latency Reduction: ' + (metrics.g1gc.p99PauseMs / metrics.genZgc.p99PauseMs).toFixed(1) + 'x lower pause latency with sub-millisecond guarantees');`,
        output: `Configured JVM Heap Size: 64 GB\nG1GC P99 Pause Time: 35 ms (Max: 142 ms)\nGenerational ZGC P99 Pause Time: 0.45 ms (Max: 0.95 ms)\nLatency Reduction: 77.8x lower pause latency with sub-millisecond guarantees`,
        codeNotes: [
          { line: 5, note: 'Simulates G1GC region-based pause metrics under 64 GB heap workload' },
          { line: 6, note: 'Models Generational ZGC concurrent load barrier compaction with sub-millisecond P99 (0.45 ms)' },
          { line: 15, note: 'Demonstrates a 77.8x reduction in tail latency variance for mission-critical enterprise services' }
        ],
        tryIt: 'Increase heap size to 256 GB and observe how ZGC maintains sub-millisecond pause times regardless of memory scale.',
        check: {
          question: 'How does Generational ZGC maintain sub-millisecond pause times on multi-terabyte heaps?',
          options: [
            'It performs object marking and memory relocation concurrently with application threads using colored pointers and load barriers',
            'It disables all object deallocation permanently',
            'It stores all Java objects in external SQLite databases',
            'It requires all computers to have 128 physical CPU chips'
          ],
          answer: 0,
          why: 'Generational ZGC relocates and compacts objects concurrently while application threads execute. Colored pointers and load barriers intercept object references without requiring stop-the-world pauses.'
        }
      }
    ],
    summary: [
      'Project Panama Foreign Function & Memory (FFM) API delivers safe off-heap native memory allocation and direct C library linkage without JNI.',
      'Project Loom Virtual Threads enable million-thread concurrency by unmounting blocking fibers from underlying carrier platform threads.',
      'StructuredTaskScope coordinates concurrent subtasks as bounded units of work, short-circuiting on failure and eliminating orphaned thread leaks.',
      'Scoped Values provide immutable, allocation-free context propagation across virtual threads, eliminating mutable ThreadLocal overhead.',
      'Generational ZGC leverages colored pointers and load barriers to perform concurrent compaction, delivering sub-millisecond P99 pauses on multi-terabyte heaps.'
    ],
    projectStep: {
      title: 'Architect a High-Performance Java 21 Low-Latency Financial Microservice',
      steps: [
        'Allocate off-heap native memory segments and invoke C standard library symbols using Project Panama FFM API.',
        'Benchmark 100,000 concurrent virtual threads dispatching across a fixed carrier platform thread pool.',
        'Implement structured task fan-out with StructuredTaskScope.ShutdownOnFailure to guard against orphaned subtasks.',
        'Propagate immutable security and tenant context down deep asynchronous call trees using Scoped Values.',
      ]
    }
  },
  {
    day: 6,
    title: 'Switch Statements, Modern Switch Expressions, Pattern Matching & Sealed State Machines',
    goal: 'Master enterprise multi-branch decision control: classic switch versus Java 14+ switch expressions with arrow syntax, preventing fallthrough bugs with break and scope isolation, default guards, Java 21 pattern matching with when guards, and sealed interface exhaustiveness.',
    minutes: 28,
    recap: 'Yesterday we explored advanced JVM execution models and virtual threads. Today we master high-throughput control flow: modern switch expressions, pattern matching, and sealed domain state machines.',
    parts: [
      {
        title: 'Classic Switch vs. Java 14+ Switch Expressions: Arrow Syntax & Yielding Values',
        say: [
          'In traditional Java, the switch statement was a primitive control structure derived from C: it required verbose case labels, manual break statements on every branch, and could not return values directly as expressions without assigning to an external mutable variable.',
          'Java 14 modernized branching by introducing switch expressions (standardized in JEP 361). Using the concise arrow syntax (case LABEL -> expression;), a switch expression computes and returns a value directly, turning multi-branch routing into an elegant, functional assignment.',
          'When a branch requires multiple statements or complex logging before computing a return value, Java introduces the yield keyword. Unlike return (which exits the enclosing method), yield terminates the switch block and supplies the value to the assignment target while maintaining lexical scope isolation.'
        ],
        example: 'Like an automated parcel routing conveyor belt at an airport: packages scan their destination tag once, and the mechanical gate immediately routes them to their exact flight chute without needing a human to stand at every junction holding a stop sign.',
        code: `// Java 14+ Switch Expressions with Arrow Syntax Simulation
class PaymentGatewayRouter {
  routePayment(channel: string): {
    gateway: string;
    feeBasisPoints: number;
    status: 'ROUTED' | 'UNSUPPORTED';
  } {
    // Simulates Java: return switch (channel) { case "UPI" -> ...; case "CREDIT_CARD", "DEBIT_CARD" -> ...; };
    switch (channel) {
      case 'UPI':
        return { gateway: 'NPCI_IMMEDIATE_SWITCH', feeBasisPoints: 0, status: 'ROUTED' };
      case 'CREDIT_CARD':
      case 'DEBIT_CARD':
        return { gateway: 'VISA_MASTERCARD_RAILS', feeBasisPoints: 120, status: 'ROUTED' };
      case 'NET_BANKING':
        return { gateway: 'IMPS_NEFT_CLEARING', feeBasisPoints: 45, status: 'ROUTED' };
      default:
        return { gateway: 'MANUAL_REVIEW_FALLBACK', feeBasisPoints: 0, status: 'UNSUPPORTED' };
    }
  }
}

const router = new PaymentGatewayRouter();
console.log('UPI Route: ' + router.routePayment('UPI').gateway);
console.log('Card Rail Fee: ' + router.routePayment('CREDIT_CARD').feeBasisPoints + ' bps');
console.log('Net Banking Route: ' + router.routePayment('NET_BANKING').gateway);
console.log('Unknown Channel Status: ' + router.routePayment('CRYPTO').status);`,
        output: `UPI Route: NPCI_IMMEDIATE_SWITCH\nCard Rail Fee: 120 bps\nNet Banking Route: IMPS_NEFT_CLEARING\nUnknown Channel Status: UNSUPPORTED`,
        codeNotes: [
          { line: 8, note: 'Arrow syntax eliminates verbose break statements on individual cases' },
          { line: 11, note: 'Multi-label cases (CREDIT_CARD, DEBIT_CARD) eliminate redundant duplicate routing branches' },
          { line: 16, note: 'Default guard safely captures unrecognized payment channels without throwing unhandled exceptions' }
        ],
        tryIt: 'Route a DEBIT_CARD payment and confirm it shares the 120 bps fee structure with credit cards.',
        check: {
          question: 'What is the primary benefit of Java 14+ switch expressions over legacy switch statements?',
          options: [
            'They evaluate directly to a return value using arrow syntax without requiring manual break statements',
            'They convert all string variables into numeric integers automatically',
            'They delete unhandled variables from computer memory permanently'
          ],
          answer: 0,
          why: 'Modern switch expressions return computed values directly to variables or method callers, eliminating accidental fallthrough bugs caused by missing break statements.'
        }
      },
      {
        title: 'Preventing Silent Fallthrough: The Critical Role of Break & Scope Isolation',
        say: [
          'In legacy switch statements with colon syntax (case VALUE:), if a developer forgets to write a break statement, execution silently cascades into the next case below it. This behavior, known as fallthrough, is one of the most prolific sources of catastrophic production bugs in enterprise systems.',
          'Fallthrough occurs because the JVM evaluates case labels as bytecode jump targets rather than isolated blocks. Once the instruction pointer jumps to a matching case, it continues executing sequential bytecode until it explicitly encounters a break instruction or the end of the switch block.',
          'With modern arrow syntax (->), fallthrough is structurally impossible: each arrow defines an isolated branch where only the expression or block to the right of the arrow executes. Furthermore, variable declarations inside an arrow block do not leak into adjacent cases, preventing naming collisions.'
        ],
        example: 'Like an elevator with broken doors: if the stop mechanism (break) fails on floor 3, the elevator plummets through floors 2 and 1, executing every action along the way instead of holding safely at its intended destination.',
        code: `// State Machine Fallthrough vs Guarded Break Simulation
class TrafficLightController {
  transitionWithFallthrough(currentSignal: string): string[] {
    const actions: string[] = [];
    switch (currentSignal) {
      case 'RED':
        actions.push('STOP_VEHICLES');
        // Explicit break prevents falling through into yellow
        break;
      case 'YELLOW':
        actions.push('PREPARE_TO_STOP');
        // Explicit break prevents falling through into green
        break;
      case 'GREEN':
        actions.push('PROCEED_SAFELY');
        break;
      default:
        actions.push('BLINKING_AMBER_CAUTION');
    }
    return actions;
  }
}

const light = new TrafficLightController();
console.log('Red Signal Action: ' + light.transitionWithFallthrough('RED')[0]);
console.log('Yellow Signal Action: ' + light.transitionWithFallthrough('YELLOW')[0]);
console.log('Green Signal Action: ' + light.transitionWithFallthrough('GREEN')[0]);
console.log('Power Loss Fallback: ' + light.transitionWithFallthrough('MALFUNCTION')[0]);`,
        output: `Red Signal Action: STOP_VEHICLES\nYellow Signal Action: PREPARE_TO_STOP\nGreen Signal Action: PROCEED_SAFELY\nPower Loss Fallback: BLINKING_AMBER_CAUTION`,
        codeNotes: [
          { line: 8, note: 'Explicit break terminates switch execution immediately after recording the STOP action' },
          { line: 16, note: 'Default branch handles unexpected states such as sensor malfunctions or grid power failures' },
          { line: 24, note: 'Outputs confirm strictly isolated single-action transitions per traffic state' }
        ],
        tryIt: 'Pass an empty string or unexpected signal to observe the default caution fallback.',
        check: {
          question: 'What occurs in a legacy colon-syntax switch statement if a break is omitted?',
          options: [
            'Execution falls through and unintentionally executes subsequent cases below it',
            'The Java Virtual Machine instantly aborts with an OutOfMemoryError',
            'The operating system reboots the computer server'
          ],
          answer: 0,
          why: 'Omitting break in colon-syntax switch allows execution to fall through into the next case label regardless of whether that label matches.'
        }
      },
      {
        title: 'Default Guards & Exhaustiveness: Why Mission-Critical Systems Must Handle Every Variant',
        say: [
          'In enterprise banking, telecommunications, and aerospace software, a control structure must be exhaustive: it must have a deterministic, proven outcome for every possible input value. Leaving unhandled inputs causes silent data corruption or unhandled null states.',
          'The default clause serves as the fail-safe boundary in a switch block. When an input does not match any predefined case label, the default clause executes, allowing the application to log an audit trail, raise a domain-specific exception, or apply a secure fallback.',
          'When switching on primitive enums or sealed types, modern Java compilers check exhaustiveness at compile time. However, when switching on open types such as String, int, or unsealed classes, the default clause is strictly mandatory to ensure the switch expression always yields a value.'
        ],
        example: 'Like an automated passport control gate: if a traveler presents an unrecognized alien ID or an expired passport not in the visa registry, the gate does not freeze—it triggers the default security rejection gate and alerts an officer.',
        code: `// Default Guard & Robust Protocol Classifier Simulation
class HttpStatusCodeClassifier {
  classify(statusCode: number): string {
    const category = Math.floor(statusCode / 100);
    switch (category) {
      case 2:
        return 'SUCCESS_OK';
      case 3:
        return 'REDIRECTION';
      case 4:
        return 'CLIENT_ERROR';
      case 5:
        return 'SERVER_FAULT';
      default:
        return 'UNKNOWN_PROTOCOL_STATUS';
    }
  }
}

const classifier = new HttpStatusCodeClassifier();
console.log('200 Code: ' + classifier.classify(200));
console.log('404 Code: ' + classifier.classify(404));
console.log('503 Code: ' + classifier.classify(503));
console.log('999 Code: ' + classifier.classify(999));`,
        output: `200 Code: SUCCESS_OK\n404 Code: CLIENT_ERROR\n503 Code: SERVER_FAULT\n999 Code: UNKNOWN_PROTOCOL_STATUS`,
        codeNotes: [
          { line: 4, note: 'Normalizes 3-digit HTTP status codes into single-digit category buckets' },
          { line: 14, note: 'Default branch ensures non-standard codes (like 999) return an explicit protocol label rather than undefined' },
          { line: 23, note: 'Verifies complete coverage across standard and edge-case status codes' }
        ],
        tryIt: 'Classify code 301 to verify HTTP redirect category handling.',
        check: {
          question: 'Why is a default clause required when switching on open types like String or int in a switch expression?',
          options: [
            'Because open types have infinite possible values, requiring a catch-all branch for exhaustiveness',
            'Because Java cannot compare numbers greater than 100 without a default keyword',
            'Because switch expressions run 50% slower without a default clause'
          ],
          answer: 0,
          why: 'Switch expressions must guarantee a return value for every possible input. Open types like integers or strings require default to ensure mathematical exhaustiveness.'
        }
      },
      {
        title: 'Java 21 Pattern Matching for Switch: Type Patterns & Guarded When Clauses',
        say: [
          'Java 21 finalized Pattern Matching for switch (JEP 441), fundamentally transforming the Java language. Previously, switch only supported primitives, enums, and strings. Now, switch can inspect the concrete runtime type of an object and deconstruct it on the fly.',
          'Type patterns allow developers to test an object type and bind it to a local typed variable in a single atomic operation: case String s -> s.length();. This completely eliminates fragile manual type casting and messy chains of if-else instanceof statements.',
          'Furthermore, Java 21 introduces guarded patterns using the when keyword. A guarded pattern evaluates an additional boolean expression after the type match: case Account a when a.balance() < 0 -> triggerOverdraftAlert(a);. This combines polymorphism and business rule validation in a clean, declarative syntax.'
        ],
        example: 'Like an automated airport customs scanner that simultaneously weighs a suitcase, checks its dimensions, and flags it for special inspection if it exceeds 23 kilograms—all in a single pass without needing three separate conveyor belts.',
        code: `// Java 21 Pattern Matching with Guarded When Conditions Simulation
interface SecurityEvent {
  type: 'AUTH' | 'TRANSACTION' | 'ADMIN';
  failedAttempts?: number;
  amountUSD?: number;
}

class EventDispatcher {
  dispatch(event: SecurityEvent): string {
    // Simulates Java 21: switch (event) { case AuthEvent e when e.failedAttempts() >= 3 -> ... }
    switch (event.type) {
      case 'AUTH':
        if ((event.failedAttempts || 0) >= 3) {
          return 'ACCOUNT_LOCKED_SECURITY_ALERT';
        }
        return 'AUTHENTICATION_GRANTED';
      case 'TRANSACTION':
        if ((event.amountUSD || 0) > 10000) {
          return 'FLAG_HIGH_VALUE_AML_REVIEW';
        }
        return 'STANDARD_CLEARING';
      default:
        return 'UNRECOGNIZED_EVENT_DROPPED';
    }
  }
}

const dispatcher = new EventDispatcher();
console.log('Failed Login x3: ' + dispatcher.dispatch({ type: 'AUTH', failedAttempts: 3 }));
console.log('Valid Login: ' + dispatcher.dispatch({ type: 'AUTH', failedAttempts: 1 }));
console.log('High Value Transfer: ' + dispatcher.dispatch({ type: 'TRANSACTION', amountUSD: 50000 }));
console.log('Normal Transfer: ' + dispatcher.dispatch({ type: 'TRANSACTION', amountUSD: 500 }));`,
        output: `Failed Login x3: ACCOUNT_LOCKED_SECURITY_ALERT\nValid Login: AUTHENTICATION_GRANTED\nHigh Value Transfer: FLAG_HIGH_VALUE_AML_REVIEW\nNormal Transfer: STANDARD_CLEARING`,
        codeNotes: [
          { line: 12, note: 'Simulates guarded pattern matching: matches AUTH type and checks condition failedAttempts >= 3' },
          { line: 17, note: 'Simulates transaction threshold guard: flags transfers over $10,000 for compliance review' },
          { line: 28, note: 'Demonstrates declarative multi-constraint dispatching without cascading if-else blocks' }
        ],
        tryIt: 'Dispatch an AUTH event with 2 failed attempts to verify authentication is still granted.',
        check: {
          question: 'What does the when keyword do in a Java 21 switch statement?',
          options: [
            'It adds an additional boolean guard condition that must evaluate to true for the case to match',
            'It tells the computer to wait 5 seconds before running the case',
            'It loops the case continuously until the user presses enter'
          ],
          answer: 0,
          why: 'The when keyword introduces a guarded pattern: the case matches only if both the type pattern and the accompanying boolean guard condition evaluate to true.'
        }
      },
      {
        title: 'Sealed Interfaces & Exhaustive Domain Modeling: Eliminating Redundant Defaults',
        say: [
          'In domain-driven design, state machines often have a strictly closed set of valid states. In Java 17 and 21, sealed classes and interfaces (sealed interface OrderStatus permits ...) formally declare all allowed subclasses directly in the interface declaration.',
          'When a switch expression evaluates an instance of a sealed hierarchy, the Java compiler verifies that every permitted subclass has an explicit case label. If every permitted variant is covered, the switch expression is provably exhaustive.',
          'This compiler-verified exhaustiveness provides immense architectural safety: developers do not need a dummy default branch. More importantly, if a new status (such as REFUNDED) is added to the sealed hierarchy in the future, the Java compiler will refuse to compile until every switch statement across the entire codebase explicitly handles the new state.'
        ],
        example: 'Like a coin with exactly two sides (Heads and Tails): a coin-toss machine that explicitly handles both Heads and Tails never needs an imaginary third mystery case because the physical rules of coins make any other outcome impossible.',
        code: `// Sealed Hierarchy Exhaustive Dispatch Simulation
type OrderState = 'PENDING_PAYMENT' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

class OrderStateProcessor {
  evaluateOrder(status: OrderState): {
    nextAction: string;
    canCancel: boolean;
  } {
    // Simulates exhaustive switch on sealed interface: compiler proves all 5 states covered
    switch (status) {
      case 'PENDING_PAYMENT':
        return { nextAction: 'RESERVE_INVENTORY', canCancel: true };
      case 'PAID':
        return { nextAction: 'DISPATCH_FULFILLMENT', canCancel: false };
      case 'SHIPPED':
        return { nextAction: 'TRACK_CARRIER_TRANSIT', canCancel: false };
      case 'DELIVERED':
        return { nextAction: 'REQUEST_CUSTOMER_FEEDBACK', canCancel: false };
      case 'CANCELLED':
        return { nextAction: 'RESTOCK_WAREHOUSE', canCancel: false };
      default:
        throw new Error('Non-exhaustive state: ' + status);
    }
  }
}

const processor = new OrderStateProcessor();
console.log('Pending Action: ' + processor.evaluateOrder('PENDING_PAYMENT').nextAction);
console.log('Paid Action: ' + processor.evaluateOrder('PAID').nextAction);
console.log('Shipped Action: ' + processor.evaluateOrder('SHIPPED').nextAction);
console.log('Delivered Action: ' + processor.evaluateOrder('DELIVERED').nextAction);`,
        output: `Pending Action: RESERVE_INVENTORY\nPaid Action: DISPATCH_FULFILLMENT\nShipped Action: TRACK_CARRIER_TRANSIT\nDelivered Action: REQUEST_CUSTOMER_FEEDBACK`,
        codeNotes: [
          { line: 9, note: 'Exhaustive coverage of all 5 domain states declared in the sealed hierarchy' },
          { line: 20, note: 'Compiler ensures zero unhandled states, eliminating unreachable fallback branches' },
          { line: 26, note: 'Outputs confirm deterministic business actions dispatched for every domain lifecycle phase' }
        ],
        tryIt: 'Evaluate the CANCELLED order state and observe the RESTOCK_WAREHOUSE action.',
        check: {
          question: 'What happens when a new subclass is added to a sealed hierarchy used in a switch expression?',
          options: [
            'The compiler triggers an error on any switch expression that does not explicitly handle the new subclass',
            'The program silently ignores the new subclass at runtime',
            'The computer deletes the old subclasses automatically'
          ],
          answer: 0,
          why: 'Sealed interfaces enforce compiler-level exhaustiveness. Adding a new permitted subtype causes the compiler to flag all unhandled switch expressions until they are updated.'
        }
      }
    ],
    summary: [
      'Java 14+ switch expressions return values directly using concise arrow syntax (case LABEL -> expression;).',
      'The yield keyword allows multi-statement blocks inside switch expressions to supply return values while preserving lexical scope.',
      'Arrow syntax eliminates accidental fallthrough bugs caused by omitted break statements in legacy switch blocks.',
      'Java 21 pattern matching enables switching on runtime object types and applying boolean guards with the when keyword.',
      'Switching over sealed hierarchies guarantees compile-time exhaustiveness, safely eliminating redundant default clauses.'
    ],
    projectStep: {
      title: 'Architect an Enterprise Order Routing State Machine',
      steps: [
        'Model payment channel routing using modern Java switch expressions with multi-label cases and arrow syntax.',
        'Implement an isolated state machine with explicit break statements to guard against unintentional fallthrough.',
        'Configure a robust default fallback guard to classify HTTP and network status codes with zero unhandled exceptions.',
        'Apply Java 21 pattern matching with when guards to detect high-risk authentication and transaction anomalies.',
        'Refactor the state processor to switch over a sealed interface hierarchy, verifying compile-time exhaustiveness.'
      ]
    }
  }
];



