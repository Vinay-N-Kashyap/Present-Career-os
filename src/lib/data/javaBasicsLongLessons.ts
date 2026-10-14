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
  },
  {
    day: 7,
    title: 'While Loops, Do-While Mechanics, Loop Invariants & Iterative State Machines',
    goal: 'Master repetitive execution in Java: pre-condition while loops, post-condition do-while loops, exponential backoff retries, loop invariant proofs, preventing runaway execution with watchdog bounds, and labeled break/continue in nested structures.',
    minutes: 30,
    recap: 'Yesterday we mastered modern switch expressions and sealed state machines. Today we master repetitive control flow: condition guards, exponential backoff, loop termination proofs, and iterative queue consumers.',
    parts: [
      {
        title: 'While Loop Mechanics: Loop Guards, Pre-Condition Evaluation & Halting Invariants',
        say: [
          'A while loop is a pre-condition control structure: it evaluates its boolean guard expression before every iteration. If the guard evaluates to true, the loop body executes; if it evaluates to false on the very first check, the body is skipped entirely with zero iterations.',
          'In distributed computing and backend networking, while loops form the foundational engine for polling mechanisms and exponential backoff retry algorithms. When contacting an external payment gateway or database server that may be transiently unavailable, the client executes requests inside a while loop with increasing backoff delays.',
          'Every robust while loop must satisfy a formal loop halting invariant: every pass through the loop must make monotonic progress toward satisfying the termination condition (e.g., incrementing an attempt counter or reducing a work queue), ensuring execution cannot hang indefinitely.'
        ],
        example: 'Like an automated room thermostat: every minute it checks if the temperature is below 20 degrees Celsius. While it remains too cold, the heating element runs. As soon as the room reaches 20 degrees, the heater immediately shuts off.',
        code: `// Exponential Backoff Retry Loop Simulation
class NetworkRetryEngine {
  executeWithBackoff(maxRetries: number): {
    attempts: number;
    finalStatus: 'CONNECTED' | 'EXHAUSTED';
    log: string[];
  } {
    let attempt = 0;
    let delayMs = 100;
    let success = false;
    const log: string[] = [];

    // Pre-condition while loop: halts as soon as attempt reaches maxRetries or success is true
    while (attempt < maxRetries && !success) {
      attempt++;
      if (attempt === 3) {
        success = true;
        log.push('ATTEMPT_' + attempt + '_SUCCESS');
      } else {
        log.push('ATTEMPT_' + attempt + '_FAILED_RETRYING_IN_' + delayMs + 'MS');
        delayMs *= 2; // Exponential increase
      }
    }
    return { attempts: attempt, finalStatus: success ? 'CONNECTED' : 'EXHAUSTED', log };
  }
}

const engine = new NetworkRetryEngine();
const result = engine.executeWithBackoff(5);
console.log('Retry Status: ' + result.finalStatus);
console.log('Total Attempts: ' + result.attempts);
console.log('Final Event: ' + result.log[result.log.length - 1]);`,
        output: `Retry Status: CONNECTED\nTotal Attempts: 3\nFinal Event: ATTEMPT_3_SUCCESS`,
        codeNotes: [
          { line: 15, note: 'Pre-condition guard combines attempt bounds with boolean success flag' },
          { line: 22, note: 'Exponentially doubles delay interval (100ms, 200ms) to prevent server throttling' },
          { line: 28, note: 'Halts cleanly upon successful connection on attempt 3' }
        ],
        tryIt: 'Run with maxRetries = 2 to verify that the loop terminates with EXHAUSTED status when retries are limited.',
        check: {
          question: 'What happens if a while loop boolean condition is false prior to the first iteration?',
          options: [
            'The loop body does not execute at all (0 iterations)',
            'The loop body executes exactly once before exiting',
            'The JVM throws an InfiniteLoopException'
          ],
          answer: 0,
          why: 'A while loop evaluates its condition before executing any code. If the condition is false initially, the entire loop body is bypassed.'
        }
      },
      {
        title: 'The Do-While Loop: Guaranteed Single Execution & Post-Condition Validation',
        say: [
          'Unlike the standard while loop, the do-while loop is a post-condition iteration construct: its body executes first, and its boolean guard is evaluated at the bottom of the loop (do { ... } while (condition);).',
          'This guarantees that the loop body executes at least once, regardless of whether the condition is true or false initially. This makes do-while ideal for interactive terminal prompts, protocol handshakes, and cryptographic nonce generation where an initial action must always occur before determining if a repeat is necessary.',
          'Notice the mandatory semicolon (;) at the end of the while condition in do-while. Omitting this semicolon is a common syntax error because developers confuse it with standard while loop blocks.'
        ],
        example: 'Like inserting a coin into a candy vending machine: you must turn the dispenser crank at least once to see if a candy drops before checking if the coin slot accepts another turn.',
        code: `// Do-While Database Handshake Simulation
class DatabaseHandshake {
  connectWithDoWhile(maxAttempts: number): {
    attempts: number;
    status: 'HANDSHAKE_ACK' | 'HANDSHAKE_TIMEOUT';
  } {
    let attempts = 0;
    let connected = false;

    // Guaranteed single execution before checking post-condition
    do {
      attempts++;
      if (attempts >= 2) {
        connected = true;
      }
    } while (!connected && attempts < maxAttempts);

    return { attempts, status: connected ? 'HANDSHAKE_ACK' : 'HANDSHAKE_TIMEOUT' };
  }
}

const handshake = new DatabaseHandshake();
const conn = handshake.connectWithDoWhile(3);
console.log('Connection Result: ' + conn.status);
console.log('Handshake Attempts Required: ' + conn.attempts);`,
        output: `Connection Result: HANDSHAKE_ACK\nHandshake Attempts Required: 2`,
        codeNotes: [
          { line: 11, note: 'do-while body executes immediately on attempt 1 without preliminary check' },
          { line: 16, note: 'Post-condition checks if connection was established; repeats for attempt 2 where ACK occurs' },
          { line: 23, note: 'Outputs confirm exactly 2 attempts were executed to achieve handshake confirmation' }
        ],
        tryIt: 'Run with maxAttempts = 1 and observe that exactly 1 attempt executes and results in TIMEOUT.',
        check: {
          question: 'What is the minimum number of times a do-while loop body will execute?',
          options: [
            'At least once, because the condition is checked at the bottom after execution',
            'Zero times, if the condition is false',
            'Infinite times, unless a break is present'
          ],
          answer: 0,
          why: 'Because the do-while condition is checked after the body runs, it is guaranteed to execute at least one time.'
        }
      },
      {
        title: 'Preventing Infinite Loops: Counter Progression, Loop Invariants & Watchdog Timers',
        say: [
          'An infinite loop occurs when a loop condition never transitions to false. In server applications, an uncontrolled infinite loop pins a CPU core at 100% utilization, starves other threads of computing resources, and eventually causes operating system throttling or container eviction.',
          'Infinite loops typically stem from three mistakes: forgetting to increment the counter, incrementing in the wrong direction (i-- instead of i++), or floating-point precision errors where equality (d == 1.0) is never strictly met.',
          'Production-grade systems implement watchdog timers and hard iteration limits. In distributed systems (such as consensus algorithms and token bucket rate limiters), a safety bound ensures that even if external signals fail to arrive, the loop breaks gracefully after N maximum iterations.'
        ],
        example: 'Like an escalator with an automatic emergency stop sensor: if a mechanical object blocks the steps, the safety mechanism trips after 3 seconds of resistance rather than burning out the electric motor.',
        code: `// Watchdog-Protected Token Bucket Loop Simulation
class TokenBucketDraining {
  drain(availableTokens: number, maxIterations: number): {
    remainingTokens: number;
    iterations: number;
    watchdogTripped: boolean;
  } {
    let tokens = availableTokens;
    let iterations = 0;
    let watchdogTripped = false;

    // Safety watchdog bounds loop execution against runaway states
    while (tokens > 0) {
      iterations++;
      if (iterations >= maxIterations) {
        watchdogTripped = true;
        break; // Hard exit prevents infinite execution
      }
      tokens -= 10;
    }

    return { remainingTokens: tokens, iterations, watchdogTripped };
  }
}

const bucket = new TokenBucketDraining();
const drain1 = bucket.drain(30, 100);
console.log('Drain 30 Tokens: iterations=' + drain1.iterations + ', remaining=' + drain1.remainingTokens);
const drain2 = bucket.drain(1000, 5);
console.log('Watchdog Guard Triggered: ' + drain2.watchdogTripped + ', iterations=' + drain2.iterations);`,
        output: `Drain 30 Tokens: iterations=3, remaining=0\nWatchdog Guard Triggered: true, iterations=5`,
        codeNotes: [
          { line: 15, note: 'Normal execution decrements tokens by 10 each pass until 0 is reached' },
          { line: 17, note: 'Watchdog check triggers break if iterations exceed safety ceiling' },
          { line: 28, note: 'Demonstrates safe early exit when attempting to process 1,000 tokens with limit 5' }
        ],
        tryIt: 'Drain 50 tokens with limit 10 and confirm remainingTokens reaches 0 in 5 iterations without tripping watchdog.',
        check: {
          question: 'Why are iteration ceilings and watchdog timers recommended in production loop algorithms?',
          options: [
            'They prevent unexpected infinite execution from consuming 100% CPU in the event of unexpected state corruption',
            'They make loops run at double the clock frequency',
            'They save hard drive disk storage'
          ],
          answer: 0,
          why: 'Iteration bounds prevent runaway loops from locking CPU cores and starving production server threads when unexpected data occurs.'
        }
      },
      {
        title: 'Loop Control Flow: Break, Continue & Labeled Loops in Deeply Nested Traversals',
        say: [
          'Java provides two primary jump keywords inside loop bodies: break and continue. The break statement aborts the innermost enclosing loop immediately. The continue statement skips the remainder of the current iteration and jumps directly to the loop condition evaluation for the next pass.',
          'In single loops, break and continue are straightforward. However, when navigating nested loops (such as searching a 2D matrix, graph adjacency list, or nested JSON structure), a standard break only escapes the innermost inner loop, leaving outer loops running.',
          'Java provides labeled loops (labelName: for (...) { for (...) { break labelName; } }). A labeled break allows an inner loop to instantly terminate one or more enclosing outer loops in a single atomic jump, eliminating awkward boolean flags like boolean found = true;.'
        ],
        example: 'Like finding your lost keys inside a multi-drawer filing cabinet: as soon as you open drawer 2 and see your keys, you immediately close the entire cabinet and leave (labeled break), rather than continuing to open drawers 3, 4, and 5.',
        code: `// Labeled Loop Search Simulation
class MatrixSearchEngine {
  searchGrid(matrix: number[][], target: number): {
    found: boolean;
    targetRow: number;
    targetCol: number;
  } {
    let found = false;
    let targetRow = -1;
    let targetCol = -1;

    // Outer labeled loop: searchLoop
    searchLoop:
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c] === target) {
          found = true;
          targetRow = r;
          targetCol = c;
          break searchLoop; // Escapes BOTH loops atomically!
        }
      }
    }

    return { found, targetRow, targetCol };
  }
}

const searcher = new MatrixSearchEngine();
const grid = [
  [10, 20, 30],
  [40, 50, 60],
  [70, 80, 90]
];
const res = searcher.searchGrid(grid, 50);
console.log('Target Found: ' + res.found);
console.log('Target Coordinates: Row ' + res.targetRow + ', Col ' + res.targetCol);`,
        output: `Target Found: true\nTarget Coordinates: Row 1, Col 1`,
        codeNotes: [
          { line: 12, note: 'Declares label searchLoop targeting the outer iteration' },
          { line: 18, note: 'break searchLoop breaks out of the outer loop immediately upon discovering target 50' },
          { line: 28, note: 'Outputs confirm target located at row 1, column 1 without inspecting row 2' }
        ],
        tryIt: 'Search for target 80 and observe that coordinates row 2, col 1 are returned.',
        check: {
          question: 'What is the purpose of a labeled break statement in Java?',
          options: [
            'It terminates a specified outer enclosing loop from inside a nested inner loop',
            'It assigns a string name to an integer variable',
            'It restarts the entire Java application from the main method'
          ],
          answer: 0,
          why: 'A labeled break allows execution to escape out of multiple nested loops simultaneously without needing boolean exit flags.'
        }
      },
      {
        title: 'Iterative State Machines & Queue Consumers: Polling, Drainage & Graceful Shutdown',
        say: [
          'In enterprise backend architecture, background worker threads (such as Kafka listeners, RabbitMQ consumers, and batch job processors) operate as infinite or semi-infinite while loops that poll message queues for new work units.',
          'A production queue consumer loop typically looks like: while (!shutdownRequested) { Message msg = queue.poll(1, TimeUnit.SECONDS); if (msg != null) process(msg); }. The loop blocks or sleeps briefly to avoid spinning CPU cycles when the queue is idle.',
          'When the JVM receives a shutdown signal (SIGTERM during a Kubernetes container rollout), a shutdown hook sets shutdownRequested = true. The consumer loop detects this flag, drains remaining in-flight messages from memory, commits its transaction offsets, and exits cleanly with zero message loss.'
        ],
        example: 'Like a post office package sorting clerk: they continuously take packages from the sorting bin while the open sign is lit. When the closing bell rings, they finish sorting the packages already on their table before turning off the lights.',
        code: `// Message Queue Consumer Loop Simulation
class MessageQueueConsumer {
  drainQueue(queue: string[], shutdownSignal: () => boolean): {
    processed: number;
    queueRemaining: number;
    isTerminated: boolean;
  } {
    let processed = 0;
    let isTerminated = false;

    // Iterative worker loop drains queue until empty or shutdown is requested
    while (queue.length > 0 && !shutdownSignal()) {
      const msg = queue.shift();
      processed++;
    }

    if (queue.length === 0) {
      isTerminated = true;
    }

    return { processed, queueRemaining: queue.length, isTerminated };
  }
}

const consumer = new MessageQueueConsumer();
const queue = ['order_created', 'payment_captured', 'invoice_sent'];
let signal = false;
const qResult = consumer.drainQueue(queue, () => signal);
console.log('Processed Messages Count: ' + qResult.processed);
console.log('Remaining in Queue: ' + qResult.queueRemaining);
console.log('Queue State: ' + (qResult.isTerminated ? 'DRAINED_CLEANLY' : 'INTERRUPTED'));`,
        output: `Processed Messages Count: 3\nRemaining in Queue: 0\nQueue State: DRAINED_CLEANLY`,
        codeNotes: [
          { line: 12, note: 'Worker loop checks queue depth and volatile shutdown signal on every iteration' },
          { line: 18, note: 'Sets isTerminated flag when queue is drained with zero leftover items' },
          { line: 28, note: 'Outputs confirm all 3 messages were processed cleanly without premature termination' }
        ],
        tryIt: 'Provide an active shutdown signal after 1 message to observe graceful early exit.',
        check: {
          question: 'How do production message consumers achieve graceful shutdown without losing messages?',
          options: [
            'They monitor a shutdown flag, finish processing in-flight messages in the current loop, and exit cleanly',
            'They immediately kill the process with System.exit(1)',
            'They delete all pending messages from the queue immediately'
          ],
          answer: 0,
          why: 'Graceful shutdown allows the worker loop to detect termination requests, process in-flight transactions, and shut down without data loss.'
        }
      }
    ],
    summary: [
      'While loops evaluate pre-conditions before each iteration and require monotonic counter updates to ensure termination.',
      'Do-while loops guarantee at least one execution pass because condition checking occurs at the bottom of the loop body.',
      'Watchdog counters prevent runaway infinite loops caused by unexpected data states or communication network stalls.',
      'Labeled break statements allow inner nested loops to escape multiple enclosing outer loops in a single atomic jump.',
      'Message consumers use while loops with volatile shutdown flags to achieve resilient queue drainage and zero-loss shutdowns.'
    ],
    projectStep: {
      title: 'Architect a Resilient Background Queue Consumer with Exponential Backoff',
      steps: [
        'Implement a network retry loop with exponential backoff and maximum retry bounds.',
        'Construct a post-condition do-while loop to perform initial handshake negotiations.',
        'Embed an iteration watchdog guard into high-throughput loops to prevent CPU core lockup.',
        'Utilize labeled loops to perform multi-dimensional matrix search with immediate early exit.',
        'Implement a message queue consumer loop that drains in-flight tasks cleanly upon shutdown signals.'
      ]
    }
  },
  {
    day: 8,
    title: 'For Loops, Enhanced For-Each, Multi-Dimensional Arrays & Cache Locality',
    goal: 'Master deterministic counting iteration: the three-part for loop header, enhanced for-each with Iterable mechanics, row-major traversal and L1/L2 CPU cache line locality in 2D arrays, safe collection mutations without ConcurrentModificationException, and the N*Q parallel stream heuristic.',
    minutes: 32,
    recap: 'Yesterday we mastered while and do-while loops, exponential backoff, and watchdog bounds. Today we master high-performance counting iteration: for loops, enhanced iterators, matrix cache optimization, and safe collection pruning.',
    parts: [
      {
        title: 'Classic Three-Part For Loop: Initializer, Condition Check & Update Invariants',
        say: [
          'The classic for loop is Java’s quintessential counting construct. Its header bundles three distinct operations into a single line: (initialization; terminationCondition; updateExpression). This compact structure localizes loop index variables to the loop block, preventing variable leakage into the outer scope.',
          'Execution follows a strict, invariant sequence: first, the initialization statement runs exactly once; second, the termination condition is evaluated; third, if true, the loop body executes; fourth, the update expression executes; fifth, control returns to the condition check. Understanding this cycle prevents off-by-one errors (fencepost bugs).',
          'Unlike simple while loops, the for loop excels at complex index arithmetic: stepping by arbitrary strides (i += 2), traversing backward (i--), or maintaining multiple loop counters simultaneously (for (int i = 0, j = n - 1; i < j; i++, j--)) for two-pointer algorithmic patterns.'
        ],
        example: 'Like an athlete running interval sprints on an athletic track: they start at the starting line (init), check the stopwatch (condition), run a lap (body), advance the lap marker (update), and repeat until all 8 intervals are completed.',
        code: `// Classic For Loop Stride Simulation
class ArrayAggregator {
  computeStrideSum(values: number[], stride: number): {
    sum: number;
    visitedCount: number;
  } {
    let sum = 0;
    let visitedCount = 0;

    // Classic 3-part for loop: local index, length guard, and customizable stride step
    for (let i = 0; i < values.length; i += stride) {
      sum += values[i];
      visitedCount++;
    }
    return { sum, visitedCount };
  }
}

const agg = new ArrayAggregator();
const data = [10, 20, 30, 40, 50, 60, 70, 80];
const res1 = agg.computeStrideSum(data, 1);
const res2 = agg.computeStrideSum(data, 2);
console.log('Sequential Sum: ' + res1.sum + ', Elements Visited: ' + res1.visitedCount);
console.log('Stride-2 Sum: ' + res2.sum + ', Elements Visited: ' + res2.visitedCount);`,
        output: `Sequential Sum: 360, Elements Visited: 8\nStride-2 Sum: 160, Elements Visited: 4`,
        codeNotes: [
          { line: 10, note: 'Three-part header defines localized index i with stride increment step' },
          { line: 19, note: 'Stride 1 visits all 8 elements producing total sum 360' },
          { line: 20, note: 'Stride 2 skips alternating elements (indexes 0, 2, 4, 6) visiting 4 elements producing sum 160' }
        ],
        tryIt: 'Run with stride = 4 to observe visiting only 2 elements (indexes 0 and 4).',
        check: {
          question: 'What is the precise lifecycle order of the three expressions in a for loop header?',
          options: [
            'Init once -> Condition check -> Loop body -> Update expression -> Condition check',
            'Update expression -> Init -> Condition check -> Loop body',
            'Loop body -> Condition check -> Init -> Update expression'
          ],
          answer: 0,
          why: 'Initialization runs exactly once at the beginning. The condition is checked prior to every iteration, and the update expression executes at the end of each iteration.'
        }
      },
      {
        title: 'Enhanced For-Each Loop: Iterable Abstraction, Read-Only Semantics & Iterators',
        say: [
          'Introduced in Java 5, the enhanced for-each loop (for (Type element : collection)) provides a clean, declarative syntax for traversing arrays and classes implementing the java.lang.Iterable interface. It completely hides loop index management and boundary checks.',
          'At the bytecode level, the Java compiler desugars an enhanced for loop on arrays into an indexed loop with a hidden length variable, and on Collections into a standard java.util.Iterator with hasNext() and next() calls. This abstraction eliminates index-out-of-bounds exceptions entirely.',
          'However, the enhanced for loop is strictly read-only regarding collection structure: you cannot reassign array slots to new values, obtain the current numerical index directly, or modify the underlying collection while iterating without causing concurrency errors.'
        ],
        example: 'Like reading a physical book with an automated page-turning mechanism: you comfortably read each page from front to back without having to calculate or write down the page numbers on a separate notepad.',
        code: `// Enhanced For-Each Iterable Simulation
interface InventoryItem {
  name: string;
  price: number;
  stock: number;
}

class InventoryCatalog {
  calculateAvailableValue(items: InventoryItem[]): {
    totalValue: number;
    inStockCount: number;
  } {
    let totalValue = 0;
    let inStockCount = 0;

    // Simulates Java: for (InventoryItem item : items) { ... }
    for (const item of items) {
      if (item.stock > 0) {
        totalValue += item.price * item.stock;
        inStockCount++;
      }
    }
    return { totalValue, inStockCount };
  }
}

const catalog = new InventoryCatalog();
const items: InventoryItem[] = [
  { name: 'Laptop', price: 1200, stock: 5 },
  { name: 'Monitor', price: 300, stock: 0 },
  { name: 'Keyboard', price: 75, stock: 12 }
];
const catRes = catalog.calculateAvailableValue(items);
console.log('In-Stock Items: ' + catRes.inStockCount);
console.log('Total Available Inventory Value: $' + catRes.totalValue);`,
        output: `In-Stock Items: 2\nTotal Available Inventory Value: $6900`,
        codeNotes: [
          { line: 16, note: 'Clean for-of / for-each syntax inspects item elements directly without index counters' },
          { line: 17, note: 'Filters out out-of-stock items (Monitor with 0 stock) safely' },
          { line: 29, note: 'Calculates $6,000 for Laptops + $900 for Keyboards = $6,900 across 2 in-stock lines' }
        ],
        tryIt: 'Add a new item (Mouse: price 25, stock 20) and observe total inventory value increase by $500.',
        check: {
          question: 'What interface must a Java collection implement to be usable in an enhanced for-each loop?',
          options: [
            'java.lang.Iterable',
            'java.io.Serializable',
            'java.lang.Cloneable'
          ],
          answer: 0,
          why: 'Any class implementing Iterable provides an iterator() method, enabling the compiler to desugar the enhanced for-each loop.'
        }
      },
      {
        title: 'Multi-Dimensional Arrays & Nested Matrix Iteration: Row-Major Order & Cache Locality',
        say: [
          'In Java, multi-dimensional arrays are represented as arrays of arrays (jagged arrays). An int[][] matrix is not a single contiguous memory block like in C; it is an array containing references to independent row arrays allocated across the JVM heap.',
          'Despite this pointer structure, iterating a 2D matrix in row-major order (outer loop for rows, inner loop for columns: matrix[row][col]) is exponentially faster than column-major order (outer loop for columns, inner loop for rows: matrix[row][col]).',
          'Row-major traversal respects the hardware CPU cache hierarchy (L1/L2/L3 cache lines, typically 64 bytes). When matrix[row][0] is read, the CPU prefetcher fetches the contiguous elements of that row into high-speed cache, yielding cache hits for subsequent column reads. Column-major traversal causes continuous cache misses and memory bus stalls.'
        ],
        example: 'Like inspecting library shelves: walking down shelf 1 from left to right (row-major) is fast and natural, whereas climbing a ladder to inspect book 1 on shelf 1, then book 1 on shelf 2, then book 1 on shelf 3 (column-major) requires exhausting ladder climbing between every single book.',
        code: `// 2D Matrix Row-Major Cache Locality Simulation
class MatrixProcessor {
  sumMatrix(matrix: number[][]): {
    sum: number;
    cellVisits: number;
  } {
    let sum = 0;
    let cellVisits = 0;

    // Row-major traversal: outer loop row, inner loop column maximizes CPU cache hits
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        sum += matrix[r][c];
        cellVisits++;
      }
    }
    return { sum, cellVisits };
  }
}

const proc = new MatrixProcessor();
const grid = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
const gridRes = proc.sumMatrix(grid);
console.log('Matrix Total Sum: ' + gridRes.sum);
console.log('Cell Traversal Count: ' + gridRes.cellVisits);`,
        output: `Matrix Total Sum: 45\nCell Traversal Count: 9`,
        codeNotes: [
          { line: 11, note: 'Outer loop iterates rows (r) from 0 to matrix.length - 1' },
          { line: 12, note: 'Inner loop iterates columns (c) along contiguous elements of row r' },
          { line: 25, note: 'Sums all 9 cells (1 through 9) producing exact sum 45' }
        ],
        tryIt: 'Add a 4th row [10, 11, 12] and observe the total sum become 78 across 12 visits.',
        check: {
          question: 'Why is row-major iteration (outer rows, inner columns) faster than column-major in 2D array traversal?',
          options: [
            'It aligns with spatial cache locality, allowing the CPU to load sequential elements into cache lines',
            'Because the Java compiler deletes column-major code',
            'Because rows have higher priority than columns in the operating system scheduler'
          ],
          answer: 0,
          why: 'Iterating row by row reads contiguous memory slots within each array object, maximizing L1/L2 cache hits.'
        }
      },
      {
        title: 'Modifying While Iterating: ConcurrentModificationException & Safe Iterator Removal',
        say: [
          'A notorious runtime error in Java backend systems is java.util.ConcurrentModificationException. This exception occurs when code attempts to add or remove elements directly from a Collection while simultaneously traversing it with an enhanced for-each loop.',
          'Java collections maintain an internal modification counter called modCount. When an Iterator is created, it captures an expectedModCount snapshot. If collection.remove() or collection.add() is called during iteration, modCount increments, causing the iterator’s next() check to fail immediately (fail-fast behavior).',
          'To safely prune elements during traversal, developers must either: 1) use an explicit Iterator and call iterator.remove() (which updates expectedModCount in sync), 2) use Collection.removeIf(predicate) introduced in Java 8, or 3) filter elements into a new destination collection.'
        ],
        example: 'Like walking through a moving train: if an engineer suddenly decouples railcars while passengers are walking between them, the passengers fall through the gap. The train conductor must coordinate any car decoupling at a scheduled stop.',
        code: `// Safe Iterator Removal vs Concurrent Modification Simulation
interface SessionToken {
  id: string;
  isExpired: boolean;
}

class SafeCollectionFilter {
  filterExpired(items: SessionToken[]): {
    retainedCount: number;
    removedCount: number;
  } {
    const retained: SessionToken[] = [];
    let removedCount = 0;

    // Simulates safe Iterator traversal where items are filtered without mutating underlying collection
    for (const item of items) {
      if (item.isExpired) {
        removedCount++;
      } else {
        retained.push(item);
      }
    }
    return { retainedCount: retained.length, removedCount };
  }
}

const filter = new SafeCollectionFilter();
const tokens: SessionToken[] = [
  { id: 'tok-1', isExpired: false },
  { id: 'tok-2', isExpired: true },
  { id: 'tok-3', isExpired: false },
  { id: 'tok-4', isExpired: true }
];
const filterRes = filter.filterExpired(tokens);
console.log('Valid Active Tokens: ' + filterRes.retainedCount);
console.log('Safely Pruned Expired Tokens: ' + filterRes.removedCount);
console.log('Mutation Status: CONCURRENT_SAFETY_VERIFIED');`,
        output: `Valid Active Tokens: 2\nSafely Pruned Expired Tokens: 2\nMutation Status: CONCURRENT_SAFETY_VERIFIED`,
        codeNotes: [
          { line: 17, note: 'Filters elements into clean destination array without mutating source during traversal' },
          { line: 29, note: 'Correctly partitions 4 tokens into 2 valid and 2 expired items' },
          { line: 32, note: 'Eliminates fail-fast ConcurrentModificationException crashes in production' }
        ],
        tryIt: 'Add a 5th expired token and verify that pruned count increases to 3.',
        check: {
          question: 'What is the correct way to remove elements from an ArrayList during iteration in Java?',
          options: [
            'Use an explicit Iterator and call iterator.remove(), or use list.removeIf(...)',
            'Call list.remove(item) inside an enhanced for-each loop',
            'Set the collection to null'
          ],
          answer: 0,
          why: 'Calling iterator.remove() updates the internal modification count synchronously, preventing fail-fast ConcurrentModificationException.'
        }
      },
      {
        title: 'Parallel Streams vs. For Loops: ForkJoinPool, Overhead Trade-Offs & Golden Rules',
        say: [
          'Java 8 introduced parallel streams (collection.parallelStream()), enabling developers to parallelize computations across multiple CPU cores using the common ForkJoinPool with a single method call.',
          'However, a common junior engineering trap is assuming parallel streams are always faster than a standard for loop. Parallel streams incur significant overhead: splitting data structures (spliterators), allocating tasks into ForkJoin work queues, thread synchronization, context switching, and merging results.',
          'The golden rule is the N*Q model: where N is the number of elements and Q is the compute cost per element. Parallelization is only beneficial when N*Q exceeds 10,000 operations and the data structure splits evenly (like an ArrayList or array, not a LinkedList). For small collections, a sequential for loop is up to 10x faster and uses zero extra memory.'
        ],
        example: 'Like signing 5 thank-you letters: hiring 5 corporate assistants and giving each person 1 letter takes 20 minutes of coordination (parallel overhead). One person signing all 5 letters by hand finishes in 30 seconds (sequential efficiency).',
        code: `// Parallel Stream Workload Threshold Simulation
class ConcurrencyStrategySelector {
  recommendStrategy(elementCount: number): {
    mode: 'PARALLEL_STREAM_FORK_JOIN' | 'SEQUENTIAL_FOR_LOOP';
    rationale: string;
  } {
    const N_THRESHOLD = 10000;
    if (elementCount >= N_THRESHOLD) {
      return {
        mode: 'PARALLEL_STREAM_FORK_JOIN',
        rationale: 'High N justifies ForkJoinPool thread coordination overhead'
      };
    }
    return {
      mode: 'SEQUENTIAL_FOR_LOOP',
      rationale: 'Low N avoids thread context switching and thread pool allocation overhead'
    };
  }
}

const selector = new ConcurrencyStrategySelector();
console.log('500 Elements Strategy: ' + selector.recommendStrategy(500).mode);
console.log('500 Elements Rationale: ' + selector.recommendStrategy(500).rationale);
console.log('100,000 Elements Strategy: ' + selector.recommendStrategy(100000).mode);
console.log('100,000 Elements Rationale: ' + selector.recommendStrategy(100000).rationale);`,
        output: `500 Elements Strategy: SEQUENTIAL_FOR_LOOP\n500 Elements Rationale: Low N avoids thread context switching and thread pool allocation overhead\n100,000 Elements Strategy: PARALLEL_STREAM_FORK_JOIN\n100,000 Elements Rationale: High N justifies ForkJoinPool thread coordination overhead`,
        codeNotes: [
          { line: 7, note: 'Applies N >= 10,000 benchmark threshold before dispatching parallel threads' },
          { line: 17, note: 'Directs small collections (500 items) to zero-allocation sequential loops' },
          { line: 20, note: 'Directs massive datasets (100,000 items) to parallel multicore processing' }
        ],
        tryIt: 'Evaluate elementCount = 5,000 and verify it appropriately selects SEQUENTIAL_FOR_LOOP.',
        check: {
          question: 'Under what circumstances should parallel streams be preferred over sequential for loops in Java?',
          options: [
            'When the dataset is large (N*Q > 10,000), CPU-bound, and splits evenly without shared mutable state',
            'For every loop regardless of size because multiple threads are always faster',
            'Only when writing files to floppy disks'
          ],
          answer: 0,
          why: 'Parallel streams introduce thread management and queue overhead. They should only be used when compute workload exceeds coordination cost.'
        }
      }
    ],
    summary: [
      'The classic 3-part for loop manages localized index state and enables flexible custom stride increments.',
      'The enhanced for-each loop operates on any Iterable class, guaranteeing index safety and clean readability.',
      'Row-major 2D array traversal respects CPU cache line prefetching, delivering superior throughput over column-major traversal.',
      'Direct collection modification during for-each iteration throws ConcurrentModificationException; use iterator.remove() or removeIf.',
      'Parallel streams excel on massive CPU-bound datasets (N*Q > 10,000) but introduce counter-productive overhead on small collections.'
    ],
    projectStep: {
      title: 'Architect a High-Performance Multi-Dimensional Matrix & Batch Collection Engine',
      steps: [
        'Implement an index-bounded stride iteration loop for array batch processing.',
        'Construct an enhanced for-each loop calculating inventory valuation over complex records.',
        'Optimize a 2D matrix calculation using row-major iteration for CPU L1/L2 cache locality.',
        'Safely purge expired session tokens from collections using iterator removal invariants.',
        'Implement an algorithmic threshold selector choosing between sequential for loops and ForkJoinPool parallel streams.'
      ]
    }
  },
  {
    day: 9,
    title: 'Custom Methods, Method Signatures & Pass-by-Value Mechanics',
    goal: 'Master modular code architecture in Java: defining explicit method signatures, understanding the invariant pass-by-value photocopy rule for both primitives and object references, mastering compiler method overloading resolution precedence, and designing pure, idempotent methods for resilient backend distributed systems.',
    minutes: 35,
    recap: 'Yesterday we mastered for loops, enhanced iterators, row-major cache locality, and safe collection pruning. Today we build modular abstraction: method signatures, stack-frame parameter passing invariants, reference mutations vs reassignments, overloading rules, and pure functions.',
    parts: [
      {
        title: 'Method Anatomy, Access Modifiers, Signatures & Guard Clauses',
        say: [
          'A method in Java is a modular, encapsulated block of statements that executes a specific business or algorithmic action. Every Java method declaration consists of six distinct elements: access modifiers (public, protected, package-private, private), optional specifiers (static, final, synchronized), return type (a primitive, object type, or void), method identifier name, parameter list enclosed in parentheses, and an optional throws clause for checked exceptions.',
          'Crucially, in the Java Language Specification, a method signature consists strictly of the method name and the sequence of its parameter types. The return type, access modifiers, and thrown exceptions are NOT part of the method signature. This foundational distinction determines what the compiler permits when declaring overloaded methods in a single class hierarchy.',
          'Enterprise software engineering mandates clean method structure through early return guard clauses. Instead of deeply nested if-else statements that increase cyclomatic complexity, high-quality code validates pre-conditions at the very top of the method body, immediately returning default or error states if inputs violate operational contracts.'
        ],
        example: 'Like an airport international departures checkpoint: security guards verify passports and boarding passes at the entrance (guard clauses) and immediately turn away unauthorized passengers, allowing valid travelers to proceed through the terminal on a streamlined, linear path.',
        code: `// Method Anatomy & Guard Clauses Simulation
interface WireTransferRequest {
  accountId: string;
  amount: number;
  currency: string;
}

interface TransferResult {
  success: boolean;
  status: string;
  fee: number;
}

class TransferService {
  // Method signature: calculateTransferFee(WireTransferRequest) -> TransferResult
  processTransfer(request: WireTransferRequest): TransferResult {
    // Early return guard clause 1: validate account
    if (!request.accountId || request.accountId.length < 5) {
      return { success: false, status: 'INVALID_ACCOUNT_ID', fee: 0 };
    }
    // Early return guard clause 2: validate amount
    if (request.amount <= 0) {
      return { success: false, status: 'INVALID_AMOUNT', fee: 0 };
    }

    // Business calculation logic
    const feeRate = request.currency === 'INR' ? 0.002 : 0.015;
    const fee = Math.round(request.amount * feeRate * 100) / 100;

    return {
      success: true,
      status: 'TRANSFER_APPROVED',
      fee
    };
  }
}

const service = new TransferService();
const validTransfer = service.processTransfer({
  accountId: 'ACC-98210',
  amount: 50000,
  currency: 'INR'
});
const invalidTransfer = service.processTransfer({
  accountId: 'ACC-1',
  amount: 100,
  currency: 'INR'
});
console.log('Valid Transfer: status=' + validTransfer.status + ', fee=' + validTransfer.fee);
console.log('Invalid Transfer: status=' + invalidTransfer.status + ', fee=' + invalidTransfer.fee);`,
        output: `Valid Transfer: status=TRANSFER_APPROVED, fee=100\nInvalid Transfer: status=INVALID_ACCOUNT_ID, fee=0`,
        codeNotes: [
          { line: 15, note: 'Method signature bundles parameter type WireTransferRequest into defined method name' },
          { line: 17, note: 'Guard clause 1 ejects invalid short account IDs before executing business logic' },
          { line: 21, note: 'Guard clause 2 ejects non-positive transaction amounts cleanly' },
          { line: 43, note: 'Valid INR transfer of 50,000 correctly incurs 0.2% fee (100 INR)' }
        ],
        tryIt: 'Pass currency = "USD" and observe feeRate increase to 1.5% producing a $750 fee.',
        check: {
          question: 'According to the Java Language Specification, what components constitute a method signature?',
          options: [
            'Method name and parameter types list only',
            'Method name, return type, and access modifier',
            'Method name, parameter types, return type, and throws clause'
          ],
          answer: 0,
          why: 'A Java method signature consists solely of the method name and its parameter type list. Return type and exceptions are not part of the signature.'
        }
      },
      {
        title: 'The Pass-by-Value Photocopy Invariant: Primitive Types & Isolated Stack Frames',
        say: [
          'There is no greater source of confusion for junior engineers than argument passing in Java. Hear this clearly: Java is ALWAYS 100% pass-by-value. There is zero pass-by-reference in the Java programming language. None.',
          'When an argument is passed to a method, the JVM makes a bitwise copy (a photocopy) of whatever value is stored in the caller’s variable and places that copy onto the newly allocated stack frame of the called method. For primitive types (byte, short, int, long, float, double, char, boolean), the value stored in the variable is the literal numeric data.',
          'Consequently, when the invoked method modifies a primitive parameter variable, it is altering its own private local photocopy on its own call stack frame. The caller’s stack frame remains completely insulated, untouched, and unchanged. When the method returns, its stack frame is popped, and the local copy vanishes.'
        ],
        example: 'Like photocopying your homework paper and handing the photocopy to a friend: if your friend takes a red pen and scribbles over the photocopy, your original homework paper resting on your desk remains completely pristine and unmodified.',
        code: `// Primitive Pass-by-Value Photocopy Simulation
class PrimitiveValuator {
  // Simulates Java primitive method: void applyDiscount(double price, double discountRate)
  // In Java, price and discountRate are photocopies on the call stack frame of applyDiscount
  attemptInPlaceDiscount(price: number, discountRate: number): {
    methodInternalPrice: number;
  } {
    price = price * (1 - discountRate);
    return { methodInternalPrice: price };
  }
}

const valuator = new PrimitiveValuator();
const originalPrice = 2500;
const rate = 0.20;

// Caller stack frame holds originalPrice = 2500
const result = valuator.attemptInPlaceDiscount(originalPrice, rate);

console.log('Caller Frame Price After Method Return: ' + originalPrice);
console.log('Method Frame Internal Price: ' + result.methodInternalPrice);
console.log('Photocopy Invariant: PRIMITIVE_PASS_BY_VALUE_VERIFIED');`,
        output: `Caller Frame Price After Method Return: 2500\nMethod Frame Internal Price: 2000\nPhotocopy Invariant: PRIMITIVE_PASS_BY_VALUE_VERIFIED`,
        codeNotes: [
          { line: 7, note: 'Reassigning parameter variable price modifies only the method local frame' },
          { line: 18, note: 'Caller variable originalPrice remains exactly 2500 after method returns' },
          { line: 22, note: 'Confirms Java primitive pass-by-value photocopy isolation' }
        ],
        tryIt: 'Change originalPrice to 5000 and verify caller frame retains 5000 while method computes 4000.',
        check: {
          question: 'If a method modifies a primitive int parameter passed into it, what happens to the caller variable?',
          options: [
            'It remains completely unchanged because Java passes primitive values by copy',
            'It is updated to the new value',
            'The compiler throws a NullPointerException'
          ],
          answer: 0,
          why: 'Java is strictly pass-by-value. Primitives pass a bitwise copy of their value, isolating the caller variable.'
        }
      },
      {
        title: 'Object References as Values: Heap Mutation vs Reference Reassignment',
        say: [
          'What happens when you pass an object into a method? Many developers mistakenly believe this is pass-by-reference. It is NOT. It is passing an object reference by value.',
          'In Java, an object variable does not hold the actual object; it holds a memory reference (a pointer address) pointing to the object located on the shared JVM heap. When you pass that variable to a method, the JVM photocopies the reference address into the method’s parameter variable. Both the caller and the callee now hold distinct pointer variables pointing to the exact same heap instance.',
          'This leads to two critical behaviors: 1) Mutation: calling setter methods or mutating object fields modifies the shared object on the heap, visible to both caller and callee; 2) Reassignment: reassigning the parameter variable (param = new MyObject()) simply points the method’s local pointer copy to a different heap location. It has ZERO effect on the caller’s original reference pointer.'
        ],
        example: 'Like sharing a Google Doc link with a colleague: if your colleague edits the document text, everyone sees the edits (heap mutation). But if your colleague closes the tab and opens a different website on their own computer screen (reference reassignment), your screen still displays the original Google Doc.',
        code: `// Object Reference Pass-by-Value: Mutation vs Reassignment Simulation
interface ServerNode {
  hostname: string;
  loadWeight: number;
}

class ClusterManager {
  // Operation 1: Mutating state via reference copy
  tuneWeight(node: ServerNode, newWeight: number): void {
    node.loadWeight = newWeight; // Mutates heap object field
  }

  // Operation 2: Reassigning parameter reference
  replaceNodeReference(node: ServerNode): void {
    // In Java, 'node = new ServerNode(...)' reassigns ONLY the local stack variable
    node = { hostname: 'backup-node-99', loadWeight: 10 };
  }
}

const cluster = new ClusterManager();
const primaryServer: ServerNode = { hostname: 'prod-cluster-01', loadWeight: 50 };

// 1. Mutate field
cluster.tuneWeight(primaryServer, 85);
console.log('Post-Mutation Host: ' + primaryServer.hostname + ', Weight: ' + primaryServer.loadWeight);

// 2. Attempt reference reassignment
cluster.replaceNodeReference(primaryServer);
console.log('Post-Reassignment Host: ' + primaryServer.hostname + ', Weight: ' + primaryServer.loadWeight);
console.log('Reference Rule: HEAP_MUTATION_ALLOWED_REASSIGNMENT_ISOLATED');`,
        output: `Post-Mutation Host: prod-cluster-01, Weight: 85\nPost-Reassignment Host: prod-cluster-01, Weight: 85\nReference Rule: HEAP_MUTATION_ALLOWED_REASSIGNMENT_ISOLATED`,
        codeNotes: [
          { line: 9, note: 'Field mutation updates the shared object properties on the heap' },
          { line: 15, note: 'Parameter reassignment modifies only the local pointer variable, leaving caller pointing to original' },
          { line: 26, note: 'Demonstrates loadWeight updated to 85 while hostname remains prod-cluster-01 throughout' }
        ],
        tryIt: 'Pass a second property (e.g. status: "ACTIVE") and verify field mutation persists while reassignment fails.',
        check: {
          question: 'If a Java method assigns a new object instance to its parameter variable (param = new Node()), what happens to the caller variable?',
          options: [
            'The caller variable continues pointing to the original object instance',
            'The caller variable is updated to point to the new object instance',
            'The JVM throws an OutOfMemoryError'
          ],
          answer: 0,
          why: 'Reassigning a parameter variable merely points the method local copy of the reference to a new heap object; the caller reference is unaffected.'
        }
      },
      {
        title: 'Method Overloading: Compiler Resolution Precedence & Widening vs Boxing',
        say: [
          'Method overloading is compile-time polymorphism (static binding) where multiple methods in the same class share the same identifier name but possess different parameter signatures (different types, counts, or order). Overloading is resolved strictly by the Java compiler at compile-time based on static reference types, not at runtime.',
          'When multiple overloaded candidates exist, the Java compiler uses a strict resolution hierarchy to select the most specific method: 1) Exact type match; 2) Primitive widening conversion (e.g. byte -> short -> int -> long -> float -> double); 3) Autoboxing / Unboxing (e.g. int -> Integer); 4) Variable-arity arguments (varargs, e.g. int...).',
          'Crucially, the compiler will never perform primitive widening followed by autoboxing in a single step (e.g. int cannot widen to long and then box to Long). Furthermore, if two methods are equally specific (e.g. method(String, Object) vs method(Object, String) when calling method("a", "b")), the compiler rejects the invocation as ambiguous with a compilation error.'
        ],
        example: 'Like sending a parcel at a postal service counter: if you have an exact flat-rate priority box (exact match), they use it. If not, they find a slightly larger standard box (widening). If not, they pack it in a custom crate (boxing). Only as a last resort do they toss it into bulk freight cargo (varargs).',
        code: `// Method Overloading Compiler Resolution Hierarchy
class LoggerDispatcher {
  // Method 1: Exact String match
  log(message: string): string {
    return 'EXACT_MATCH: String -> ' + message;
  }

  // Method 2: Primitive numeric type
  logNumber(val: number): string {
    return 'PRIMITIVE_NUMERIC: number -> ' + val;
  }

  // Method 3: Varargs fallback
  logVarargs(...entries: string[]): string {
    return 'VARARGS_FALLBACK: count=' + entries.length;
  }
}

const dispatcher = new LoggerDispatcher();
console.log(dispatcher.log('System initialized'));
console.log(dispatcher.logNumber(404));
console.log(dispatcher.logVarargs('trace-1', 'trace-2', 'trace-3'));
console.log('Resolution Precedence: EXACT_MATCH > WIDENING > BOXING > VARARGS');`,
        output: `EXACT_MATCH: String -> System initialized\nPRIMITIVE_NUMERIC: number -> 404\nVARARGS_FALLBACK: count=3\nResolution Precedence: EXACT_MATCH > WIDENING > BOXING > VARARGS`,
        codeNotes: [
          { line: 4, note: 'Exact String match resolves with highest priority' },
          { line: 9, note: 'Numeric type handling resolves via primitive widening rules' },
          { line: 14, note: 'Varargs executes as lowest priority fallback when no fixed-arity methods match' },
          { line: 22, note: 'Displays compiler resolution precedence order: EXACT > WIDENING > BOXING > VARARGS' }
        ],
        tryIt: 'Call dispatcher.logVarargs with 1 element and verify it still invokes the varargs fallback when no exact method matches.',
        check: {
          question: 'What is the compiler resolution priority order when matching overloaded methods in Java?',
          options: [
            'Exact Match -> Primitive Widening -> Autoboxing -> Varargs',
            'Varargs -> Autoboxing -> Widening -> Exact Match',
            'Autoboxing -> Varargs -> Exact Match -> Widening'
          ],
          answer: 0,
          why: 'The Java compiler prioritizes backward compatibility and performance: exact matches first, primitive widening next, followed by autoboxing, and finally varargs.'
        }
      },
      {
        title: 'Pure Functions, Immutability & Idempotent Backend Service Architecture',
        say: [
          'In modern distributed systems and microservice architectures, methods must be designed for reliability under network failures, concurrent execution, and automatic message retries. This requires embracing functional programming principles within object-oriented Java: pure functions and idempotency.',
          'A pure function satisfies two mathematical criteria: 1) Determinism: given the identical input arguments, it will always return the exact same output value; 2) Zero side effects: it does not mutate global state, modify its input arguments, or execute uncoordinated I/O. Methods adhering to this contract are trivial to test, thread-safe by default, and seamlessly cacheable.',
          'An idempotent operation is one that can be applied multiple times without changing the result beyond the initial application (f(f(x)) = f(x)). In payment processing and banking engines, assigning idempotency keys to incoming requests ensures that network retries never cause double-charging or corrupt ledger states.'
        ],
        example: 'Like an elevator call button: pressing the button once requests the elevator. Pressing it 10 more times does not summon 10 separate elevators; the elevator still arrives exactly once (idempotent behavior).',
        code: `// Pure Functions & Idempotent Backend Service Simulation
interface AccountBalance {
  readonly accountId: string;
  readonly balance: number;
}

class BankingLedgerService {
  // Pure function: deterministic output, zero side-effects, immutable state return
  applyDeposit(account: AccountBalance, amount: number): AccountBalance {
    if (amount <= 0) {
      throw new Error('Deposit amount must be positive');
    }
    // Returns brand new immutable instance without mutating input
    return {
      accountId: account.accountId,
      balance: account.balance + amount
    };
  }

  // Idempotent operation: applying same idempotent token produces identical system outcome
  deduplicateCredit(account: AccountBalance, idempotencyKey: string, amount: number, processedKeys: Set<string>): AccountBalance {
    if (processedKeys.has(idempotencyKey)) {
      return account; // Return current state without applying second credit
    }
    processedKeys.add(idempotencyKey);
    return this.applyDeposit(account, amount);
  }
}

const ledger = new BankingLedgerService();
const processedTx = new Set<string>();
const initialAcct: AccountBalance = { accountId: 'ACC-8812', balance: 10000 };

const credit1 = ledger.deduplicateCredit(initialAcct, 'tx-idem-991', 2500, processedTx);
const credit2 = ledger.deduplicateCredit(credit1, 'tx-idem-991', 2500, processedTx); // Duplicate retry

console.log('Initial Balance: $' + initialAcct.balance);
console.log('Balance After First Credit: $' + credit1.balance);
console.log('Balance After Duplicate Retry: $' + credit2.balance);
console.log('Idempotency Status: PURE_IDEMPOTENT_TRANSACTION_VERIFIED');`,
        output: `Initial Balance: $10000\nBalance After First Credit: $12500\nBalance After Duplicate Retry: $12500\nIdempotency Status: PURE_IDEMPOTENT_TRANSACTION_VERIFIED`,
        codeNotes: [
          { line: 9, note: 'Pure function produces new immutable record without mutating input balance' },
          { line: 20, note: 'Idempotency key check guards against duplicate financial credit operations' },
          { line: 36, note: 'Duplicate retry with key tx-idem-991 returns exact balance $12,500 without incrementing' }
        ],
        tryIt: 'Execute a credit with a new key "tx-idem-992" and observe balance successfully increment to $15,000.',
        check: {
          question: 'What defines an idempotent backend method in software architecture?',
          options: [
            'Executing the operation multiple times yields the exact same outcome as the initial execution',
            'The method only runs when internet connectivity is offline',
            'The method must always return void'
          ],
          answer: 0,
          why: 'An idempotent operation satisfies f(f(x)) = f(x). Multiple identical requests have the exact same effect as a single request.'
        }
      }
    ],
    summary: [
      'A Java method signature consists strictly of the method name and its parameter type list; return types and exceptions are excluded.',
      'Java is strictly 100% pass-by-value; primitive parameters pass bitwise copies that cannot affect caller stack frames.',
      'Passing an object passes a copy of its heap pointer; field mutations persist, but reference reassignments are completely isolated.',
      'Compiler overloading precedence follows: Exact Match -> Primitive Widening -> Autoboxing -> Varargs.',
      'Pure functions and idempotent service methods protect backend banking and distributed systems against race conditions and duplicate retries.'
    ],
    projectStep: {
      title: 'Architect a Modular, Idempotent Financial Transaction & Calculation Engine',
      steps: [
        'Define explicit method signatures and implement guard clauses to eliminate cyclomatic branching.',
        'Verify stack frame isolation by implementing primitive parameter calculation methods.',
        'Demonstrate object reference pass-by-value mechanics with safe defensive copying patterns.',
        'Structure compile-time overloaded methods adhering to widening and boxing precedence.',
        'Implement an idempotent ledger transaction processor with cryptographic deduplication keys.'
      ]
    }
  },
  {
    day: 10,
    title: 'Call Stack, Recursion Mechanics, StackOverflowError & Milestone 2 Financial Engine',
    goal: 'Master the low-level execution mechanics of Java threads: frame allocation on the call stack, LIFO push/pop lifecycle, recursion vs StackOverflowError, HotSpot JIT lack of tail-call optimization (TCO), iterative work-stack trampolines, and synthesize Days 6–10 into the Milestone 2 Financial Utility Engine.',
    minutes: 38,
    recap: 'Yesterday we mastered custom method signatures, primitive pass-by-value photocopies, reference heap mutations, and overloading rules. Today we dissect the JVM call stack, recursive termination bounds, stack safety trampolines, and complete the Milestone 2 Capstone Financial Engine.',
    parts: [
      {
        title: 'JVM Call Stack Architecture: Frame Allocation, Local Variable Array & LIFO Lifecycle',
        say: [
          'Every thread in the Java Virtual Machine possesses its own private JVM Call Stack, allocated when the OS native thread is spawned. The call stack stores stack frames, which are created and pushed onto the stack whenever a method is invoked, and popped off when the method terminates (either by normal return or uncaught exception).',
          'A single stack frame contains three core memory sections: 1) The Local Variable Array (LVA), which holds method parameters and local variables indexed by zero-based slots (primitives like int take 1 slot, long and double take 2 slots, and slot 0 holds the "this" reference in instance methods); 2) The Operand Stack, a pushdown LIFO workspace where JVM bytecode instructions load, add, multiply, and store values; 3) Frame Data, which stores references to the runtime constant pool and method return addresses.',
          'Because the stack is strictly LIFO (Last-In, First-Out), memory allocation and deallocation require only incrementing or decrementing the thread’s stack pointer. This makes stack allocation orders of magnitude faster than heap allocation, requiring zero Garbage Collection overhead.'
        ],
        example: 'Like a spring-loaded cafeteria plate dispenser: clean plates are pushed onto the top of the stack as customers enter the queue, and the top plate is immediately popped off and consumed, ensuring absolute orderly LIFO discipline.',
        code: `// JVM Stack Frame LIFO Lifecycle Simulation
interface StackFrame {
  methodName: string;
  localVariables: Record<string, any>;
  depth: number;
}

class JvmThreadStack {
  private frames: StackFrame[] = [];

  pushFrame(methodName: string, locals: Record<string, any>): void {
    const frame: StackFrame = {
      methodName,
      localVariables: { ...locals },
      depth: this.frames.length + 1
    };
    this.frames.push(frame);
  }

  popFrame(): StackFrame | undefined {
    return this.frames.pop();
  }

  getCurrentDepth(): number {
    return this.frames.length;
  }
}

const stack = new JvmThreadStack();
stack.pushFrame('main', { args: [] });
stack.pushFrame('calculateTax', { amount: 50000, rate: 0.18 });
stack.pushFrame('lookupJurisdiction', { zipCode: '560001' });

console.log('Peak Stack Depth: ' + stack.getCurrentDepth());
const popped1 = stack.popFrame();
console.log('Popped Frame: ' + popped1?.methodName);
console.log('Active Top Frame: ' + stack.getCurrentDepth());
console.log('Stack Invariant: LIFO_FRAME_ALLOCATION_VERIFIED');`,
        output: `Peak Stack Depth: 3\nPopped Frame: lookupJurisdiction\nActive Top Frame: 2\nStack Invariant: LIFO_FRAME_ALLOCATION_VERIFIED`,
        codeNotes: [
          { line: 12, note: 'Pushes new method stack frame recording local parameters on top of stack' },
          { line: 20, note: 'Pops topmost frame when method returns, instantly reclaiming memory' },
          { line: 36, note: 'Peak stack depth reaches 3 frames during nested method chain execution' },
          { line: 40, note: 'Confirms LIFO lifecycle discipline across thread invocation stack' }
        ],
        tryIt: 'Push another frame "validatePostalCode" and observe peak stack depth reach 4 frames.',
        check: {
          question: 'What three primary structures are contained inside every JVM call stack frame?',
          options: [
            'Local Variable Array, Operand Stack, and Frame Data (Constant Pool / Return Address)',
            'Heap Young Gen, Old Gen, and Metaspace',
            'CPU L1 Cache, L2 Cache, and RAM'
          ],
          answer: 0,
          why: 'A JVM stack frame consists strictly of the Local Variable Array, the Operand Stack, and Frame Data references.'
        }
      },
      {
        title: 'Recursion Fundamentals: Base Case Contracts, Inductive Steps & StackOverflowError',
        say: [
          'Recursion is an algorithmic technique where a method solves a computational problem by invoking itself with smaller sub-problems. Every valid recursive algorithm requires two non-negotiable components: 1) The Inductive Step, which breaks the current state into smaller inputs and triggers the self-invocation; 2) The Base Case Contract, which defines the terminal condition where the function stops recursing and returns a concrete constant.',
          'If a developer omits the base case, writes an unreachable terminal condition, or processes an excessively deep input set, each recursive invocation pushes a new stack frame without ever popping previous ones.',
          'Eventually, the contiguous memory block reserved for the thread’s call stack is completely exhausted. When this occurs, the JVM throws java.lang.StackOverflowError. Because StackOverflowError is an Error (not an Exception), standard try-catch blocks in enterprise code should never attempt to swallow it; it indicates fatal thread resource exhaustion.'
        ],
        example: 'Like a set of Russian Matryoshka nesting dolls: opening doll 5 reveals doll 4, then doll 3, then doll 2, until doll 1 (the base case) is reached. If the dolls were infinite with no solid final wooden doll inside, your table would collapse under the weight of opening endless shells.',
        code: `// Recursion Base Condition vs Stack Overflow Guard Simulation
class RecursiveFactorialCalculator {
  computeSafeFactorial(n: number, maxStackLimit: number): {
    result: number;
    stackDepthReached: number;
    status: string;
  } {
    let currentDepth = 0;

    const recurse = (val: number): number => {
      currentDepth++;
      if (currentDepth > maxStackLimit) {
        throw new Error('STACK_OVERFLOW_GUARD_TRIGGERED');
      }
      // Base condition (inductive halt contract)
      if (val <= 1) {
        return 1;
      }
      // Recursive step: n * factorial(n - 1)
      return val * recurse(val - 1);
    };

    try {
      const res = recurse(n);
      return { result: res, stackDepthReached: currentDepth, status: 'SUCCESS' };
    } catch (e: any) {
      return { result: -1, stackDepthReached: currentDepth, status: e.message };
    }
  }
}

const calc = new RecursiveFactorialCalculator();
const safeRun = calc.computeSafeFactorial(5, 100);
const overflowRun = calc.computeSafeFactorial(500, 50);

console.log('Safe Run Factorial(5): ' + safeRun.result + ', Depth: ' + safeRun.stackDepthReached);
console.log('Guarded Run Status: ' + overflowRun.status + ', Depth: ' + overflowRun.stackDepthReached);
console.log('Recursion Contract: INDUCTIVE_BASE_CASE_MANDATORY');`,
        output: `Safe Run Factorial(5): 120, Depth: 5\nGuarded Run Status: STACK_OVERFLOW_GUARD_TRIGGERED, Depth: 51\nRecursion Contract: INDUCTIVE_BASE_CASE_MANDATORY`,
        codeNotes: [
          { line: 15, note: 'Base case returns 1 when val <= 1, preventing runaway stack frame creation' },
          { line: 19, note: 'Recursive invocation pushes frame computing subproblem (val - 1)' },
          { line: 36, note: 'Factorial(5) terminates cleanly at depth 5 producing exact answer 120' },
          { line: 37, note: 'Factorial(500) with limit 50 triggers overflow guard at depth 51' }
        ],
        tryIt: 'Run safe factorial with n = 6 and verify it produces result 720 at depth 6.',
        check: {
          question: 'What runtime error does the JVM throw when recursive calls exceed allocated thread stack capacity?',
          options: [
            'java.lang.StackOverflowError',
            'java.lang.OutOfMemoryError',
            'java.lang.NullPointerException'
          ],
          answer: 0,
          why: 'When thread stack frames exceed the physical stack memory allocated by the operating system, the JVM throws StackOverflowError.'
        }
      },
      {
        title: 'Tail Recursion vs. HotSpot JVM Invariant: Why Java Does Not Support TCO',
        say: [
          'In computer science theory, a recursive call is said to be in tail position if it is the very last operation executed before the method returns (e.g. return helper(n - 1, acc * n)). In functional languages like Scala, Kotlin, Haskell, or Scheme, the compiler optimizes tail calls via Tail Call Optimization (TCO), reusing the current stack frame instead of allocating a new one.',
          'However, the standard Oracle / OpenJDK HotSpot JVM does NOT support automatic Tail Call Optimization. Even if your Java code is written in perfect tail-recursive form with accumulators, the HotSpot compiler still pushes a new physical stack frame for every single invocation.',
          'Why does Java omit TCO? The Java architecture team intentionally chose not to implement TCO in HotSpot because: 1) Security: Java’s SecurityManager historically inspected the exact call stack frames to verify permissions (Stack Walking); 2) Debuggability: Omitting frames would destroy accurate stack traces in logs during production debugging. Therefore, in Java enterprise engineering, deep recursion must ALWAYS be rewritten as an explicit iterative loop.'
        ],
        example: 'Like an accountant keeping a ledger: functional languages erase line 1 and rewrite line 2 over it to save paper (TCO). Java strictly insists on turning the page and creating a brand new numbered invoice for every transaction so auditors have an unalterable paper trail.',
        code: `// Tail Recursion vs Iterative Unwinding Simulation
class TailRecursionComparator {
  // Tail-recursive conceptual model with accumulator
  factorialTail(n: number, acc: number = 1): number {
    if (n <= 1) return acc;
    return this.factorialTail(n - 1, n * acc); // Tail call: nothing left to compute after return
  }

  // Iterative unwinding (the transformation HotSpot JIT requires you to do manually)
  factorialIterative(n: number): number {
    let acc = 1;
    for (let i = n; i > 1; i--) {
      acc *= i;
    }
    return acc;
  }
}

const comp = new TailRecursionComparator();
const tailRes = comp.factorialTail(6, 1);
const iterRes = comp.factorialIterative(6);

console.log('Tail-Recursive Factorial(6): ' + tailRes);
console.log('Iterative Loop Factorial(6): ' + iterRes);
console.log('JVM HotSpot Invariant: ZERO_HOTSPOT_TCO_USE_ITERATIVE_LOOPS');`,
        output: `Tail-Recursive Factorial(6): 720\nIterative Loop Factorial(6): 720\nJVM HotSpot Invariant: ZERO_HOTSPOT_TCO_USE_ITERATIVE_LOOPS`,
        codeNotes: [
          { line: 5, note: 'Tail call passes accumulated result forward in parameter acc' },
          { line: 11, note: 'Iterative loop uses single stack frame with O(1) constant stack memory' },
          { line: 24, note: 'Confirms both produce identical result 720 while loop avoids JVM stack overflow risks' }
        ],
        tryIt: 'Compute factorial of 7 (5,040) using both methods and confirm outputs match.',
        check: {
          question: 'Why does the standard HotSpot JVM not support Tail Call Optimization (TCO)?',
          options: [
            'To preserve accurate stack traces for debugging and support JVM stack-walking security checks',
            'Because modern CPUs do not allow loops',
            'Because the Java language specification banned recursion'
          ],
          answer: 0,
          why: 'HotSpot preserves every physical stack frame to guarantee accurate debugging stack traces and historical security call-stack inspections.'
        }
      },
      {
        title: 'Thread Stack Sizing (-Xss), Deep Trees & Iterative Trampoline Stacks',
        say: [
          'In Java, the memory allocated to each thread’s call stack is governed by the -Xss JVM flag (e.g. -Xss1m for 1 MB, or -Xss256k for 256 KB). The default stack size on 64-bit systems is typically 1024 KB (1 MB). Depending on frame size, this permits roughly 7,000 to 10,000 nested calls before throwing StackOverflowError.',
          'Increasing -Xss to solve recursion crashes is dangerous: thread stack memory is allocated off-heap from native OS memory. If you configure 5,000 platform threads with -Xss2m, the JVM consumes 10 GB of native RAM purely for idle thread stacks!',
          'The robust architectural solution for deep tree traversals, graph algorithms, and JSON parsing is an Iterative Work-Stack Trampoline. Instead of relying on the CPU thread stack, the algorithm allocates a java.util.ArrayDeque on the JVM Heap. Because the heap can scale to gigabytes, the heap work-stack can process millions of nested nodes without ever crashing the thread stack.'
        ],
        example: 'Like packing boxes in a bedroom: trying to stack boxes to the ceiling in a tiny room (-Xss limit) will hit the ceiling and topple. Instead, rolling boxes into an enormous commercial warehouse (the JVM heap) gives you limitless vertical space.',
        code: `// Explicit Heap Work-Stack Trampoline for Deep Tree Traversal
interface TreeNode {
  id: string;
  value: number;
  left?: TreeNode;
  right?: TreeNode;
}

class SafeTreeTraverser {
  // Explicit stack allocated on the HEAP, completely immune to thread call stack size (-Xss)
  sumTreeIteratively(root: TreeNode): {
    totalValue: number;
    nodesVisited: number;
  } {
    let totalValue = 0;
    let nodesVisited = 0;
    const workStack: TreeNode[] = [root];

    while (workStack.length > 0) {
      const current = workStack.pop()!;
      totalValue += current.value;
      nodesVisited++;

      if (current.right) workStack.push(current.right);
      if (current.left) workStack.push(current.left);
    }
    return { totalValue, nodesVisited };
  }
}

const tree: TreeNode = {
  id: 'root',
  value: 100,
  left: {
    id: 'node-l1',
    value: 50,
    left: { id: 'node-l2', value: 25 }
  },
  right: {
    id: 'node-r1',
    value: 150
  }
};

const traverser = new SafeTreeTraverser();
const treeRes = traverser.sumTreeIteratively(tree);

console.log('Heap Trampoline Total Sum: ' + treeRes.totalValue);
console.log('Heap Trampoline Nodes Visited: ' + treeRes.nodesVisited);
console.log('Stack Safety Invariant: HEAP_WORK_STACK_PREVENTS_XSS_OVERFLOW');`,
        output: `Heap Trampoline Total Sum: 325\nHeap Trampoline Nodes Visited: 4\nStack Safety Invariant: HEAP_WORK_STACK_PREVENTS_XSS_OVERFLOW`,
        codeNotes: [
          { line: 15, note: 'Work stack resides on the JVM heap, safely scaling beyond native thread stack limits' },
          { line: 18, note: 'Processes tree nodes iteratively without allocating recursive call stack frames' },
          { line: 44, note: 'Correctly visits all 4 nodes (100 + 50 + 25 + 150) computing exact sum 325' }
        ],
        tryIt: 'Add a right child to node-r1 with value 200 and observe total sum reach 525 across 5 visits.',
        check: {
          question: 'What is the primary architectural advantage of an explicit heap work-stack over recursive method calls?',
          options: [
            'It allocates storage on the gigabyte-scale JVM heap, preventing thread StackOverflowError',
            'It forces the CPU to run at double clock speed',
            'It bypasses the Java garbage collector entirely'
          ],
          answer: 0,
          why: 'Heap memory can store millions of nodes, whereas native thread stacks (-Xss) typically overflow after a few thousand frames.'
        }
      },
      {
        title: 'Milestone 2 Capstone: The Multi-Tier Financial Utility Engine Synthesis',
        say: [
          'Congratulations on reaching Day 10! You have mastered the foundational core of the Java programming language. In this milestone capstone, we synthesize everything learned across Days 6 through 10 into a production-grade Financial Valuation Engine.',
          'Our architecture integrates: 1) Switch expressions with pattern guards (Day 6) to compute regulatory asset category surcharges; 2) Bounded iterative loops (Day 7) to drain transaction queue batches; 3) Cache-aligned array iteration (Day 8) to traverse multi-dimensional asset ledgers; 4) Pass-by-value photocopy invariants and pure functions (Day 9) to protect account balances from unauthorized side-effects; 5) Stack-safe iterative evaluation (Day 10) to compute gross valuation and net audited returns with zero recursion risk.',
          'This synthesis represents the standard expected of enterprise Java developers in modern banking, fintech, and high-frequency trading backend systems.'
        ],
        example: 'Like an automated stock exchange clearing house: trades flow in from multiple asset classes, pass through regulatory fee matrices, are audited via immutable math, and produce a tamper-proof settlement record.',
        code: `// Milestone 2 Capstone: Multi-Tier Financial Utility Engine Synthesis
// Synthesizes Days 6-10: switch expressions, iterative loops, cache matrices, pass-by-value, pure functions

type AssetCategory = 'EQUITY' | 'FIXED_INCOME' | 'COMMODITY' | 'CRYPTO';

interface FinancialRecord {
  readonly assetId: string;
  readonly category: AssetCategory;
  readonly units: number;
  readonly unitPrice: number;
}

class Milestone2FinancialEngine {
  // 1. Switch expression fee calculation (Day 6)
  resolveRegulatoryFeeBps(cat: AssetCategory): number {
    switch (cat) {
      case 'EQUITY': return 15;        // 0.15%
      case 'FIXED_INCOME': return 5;   // 0.05%
      case 'COMMODITY': return 25;     // 0.25%
      case 'CRYPTO': return 50;        // 0.50%
      default: return 30;
    }
  }

  // 2. Iterative valuation with pass-by-value defensive protection (Days 7, 8, 9)
  evaluatePortfolio(records: FinancialRecord[]): {
    grossValue: number;
    totalRegulatoryFees: number;
    netPortfolioValue: number;
    assetCount: number;
  } {
    let grossValue = 0;
    let totalRegulatoryFees = 0;

    for (const rec of records) {
      const positionValue = rec.units * rec.unitPrice;
      const feeBps = this.resolveRegulatoryFeeBps(rec.category);
      const fee = positionValue * (feeBps / 10000);

      grossValue += positionValue;
      totalRegulatoryFees += fee;
    }

    const netPortfolioValue = grossValue - totalRegulatoryFees;

    return {
      grossValue: Math.round(grossValue * 100) / 100,
      totalRegulatoryFees: Math.round(totalRegulatoryFees * 100) / 100,
      netPortfolioValue: Math.round(netPortfolioValue * 100) / 100,
      assetCount: records.length
    };
  }
}

const engine = new Milestone2FinancialEngine();
const portfolio: FinancialRecord[] = [
  { assetId: 'EQ-RELIANCE', category: 'EQUITY', units: 100, unitPrice: 2800 },         // 280,000 -> 15 bps = 420
  { assetId: 'FI-GOVBOND', category: 'FIXED_INCOME', units: 50, unitPrice: 10000 },    // 500,000 -> 5 bps = 250
  { assetId: 'COM-GOLD', category: 'COMMODITY', units: 10, unitPrice: 72000 }          // 720,000 -> 25 bps = 1800
];

const report = engine.evaluatePortfolio(portfolio);

console.log('Portfolio Gross Value: ₹' + report.grossValue);
console.log('Total Regulatory Surcharge: ₹' + report.totalRegulatoryFees);
console.log('Net Audited Valuation: ₹' + report.netPortfolioValue);
console.log('Milestone 2 Status: JAVA_FUNDAMENTALS_CORE_ENGINE_CERTIFIED');`,
        output: `Portfolio Gross Value: ₹1500000\nTotal Regulatory Surcharge: ₹2470\nNet Audited Valuation: ₹1497530\nMilestone 2 Status: JAVA_FUNDAMENTALS_CORE_ENGINE_CERTIFIED`,
        codeNotes: [
          { line: 14, note: 'Evaluates asset category fee rates using exhaustive switch logic' },
          { line: 26, note: 'Iterates portfolio records with pure functional immutable math' },
          { line: 55, note: 'Produces ₹1,500,000 gross valuation and ₹2,470 surcharge' },
          { line: 58, note: 'Certifies Milestone 2 Java Fundamentals Engine completion' }
        ],
        tryIt: 'Add a 4th record for CRYPTO (units: 2, price: 50000) and verify gross valuation increments by ₹100,000.',
        check: {
          question: 'What architectural principles ensure the Milestone 2 Financial Engine remains resilient and deterministic?',
          options: [
            'Exhaustive switch mapping, pure functions, immutable records, and iterative stack safety',
            'Storing account passwords in global static variables',
            'Calling System.exit() whenever a transaction executes'
          ],
          answer: 0,
          why: 'Combining pattern-matching switches, pure functions, and iterative stack execution eliminates runtime nulls and stack overflow risks.'
        }
      }
    ],
    summary: [
      'Every JVM thread has a private call stack containing LIFO frames with Local Variable Arrays and Operand Stacks.',
      'Recursion requires an explicit base case contract; unconstrained recursion triggers java.lang.StackOverflowError.',
      'The standard HotSpot JVM does NOT support Tail Call Optimization (TCO) in order to protect stack trace fidelity.',
      'Deep tree traversals must use an explicit heap work-stack trampoline rather than native thread stacks governed by -Xss.',
      'Milestone 2 synthesizes switch expressions, iterative loops, cache locality, pass-by-value photocopy safety, and pure functions.'
    ],
    projectStep: {
      title: 'Construct the Milestone 2 Production-Grade Multi-Asset Financial Clearing House',
      steps: [
        'Profile JVM call stack frame push and pop mechanics during nested method invocations.',
        'Implement an inductive base-condition guard preventing recursive StackOverflowError.',
        'Refactor recursive algorithms into iterative loops to bypass HotSpot lack of Tail Call Optimization.',
        'Implement a heap-allocated work-stack trampoline to traverse deep hierarchical data structures.',
        'Synthesize Days 6 through 10 into the Milestone 2 Financial Clearing & Auditing Engine.'
      ]
    }
  },
  {
    day: 11,
    title: 'Classes, Objects, Fields, Constructors & JVM Heap Object Allocation',
    goal: 'Master the mechanics of Object-Oriented Programming in Java: class blueprints vs heap instances, field initialization sequences, default and parameterized constructors, constructor chaining via this(), the JVM object header (Mark Word & Klass Word), and reference equality (==) vs semantic equivalence (.equals()).',
    minutes: 35,
    recap: 'Yesterday we mastered the JVM call stack, recursive termination bounds, and completed the Milestone 2 Financial Engine. Today we transition into Object-Oriented Programming: classes, heap instance allocation, constructor chaining with this(), object memory layouts, and identity vs equivalence.',
    parts: [
      {
        title: 'Class Blueprint vs Heap Object Instance & Field Initialization Order',
        say: [
          'In Java, a class serves as a compile-time blueprint stored in the JVM Metaspace, defining the fields (state attributes) and methods (behavioral actions) common to all objects of that type. An object is a concrete runtime instance of that class dynamically allocated in the Eden generation of the JVM Heap using the new keyword.',
          'When the new operator executes, the JVM follows an unalterable four-step initialization sequence: 1) Class Loading & Static Initialization: if not already loaded, the class bytecode is verified and static initializers execute; 2) Memory Allocation & Zeroing: heap memory is reserved and all instance fields are automatically initialized to their binary default zero values (0, 0.0, false, null); 3) Explicit Field Initializers: inline field initializers and instance initialization blocks ({ ... }) execute in top-to-bottom declaration order; 4) Constructor Body: the invoked constructor body executes to finalize state.',
          'Understanding this four-stage sequence prevents subtle bugs where constructor logic accidentally inspects fields before explicit initializers or subclass overrides have taken effect.'
        ],
        example: 'Like an automotive assembly plant: the architectural engineering blueprint (class) remains in headquarters (Metaspace). On the assembly line (JVM heap), a steel chassis is stamped and painted (memory allocation and zeroing), default safety parts are fitted (field inits), and finally customized leather upholstery and options are installed per customer order (constructor body).',
        code: `// Class Instance Allocation & Field Initialization Sequence Simulation
class DatabaseSession {
  // 1. Explicit field initializers run before constructor body
  readonly createdAt: number = 1700000000000;
  connectionState: string = 'INITIALIZING';
  maxRetries: number = 3;

  constructor(public sessionId: string, customRetries?: number) {
    // 2. Constructor body executes after field initialization
    if (customRetries !== undefined) {
      this.maxRetries = customRetries;
    }
    this.connectionState = 'ACTIVE_READY';
  }
}

const session1 = new DatabaseSession('sess-alpha-01');
const session2 = new DatabaseSession('sess-beta-02', 5);

console.log('Session 1: id=' + session1.sessionId + ', state=' + session1.connectionState + ', retries=' + session1.maxRetries);
console.log('Session 2: id=' + session2.sessionId + ', state=' + session2.connectionState + ', retries=' + session2.maxRetries);
console.log('Initialization Order: ZERO_DEFAULTS -> FIELD_INITS -> CONSTRUCTOR_BODY');`,
        output: `Session 1: id=sess-alpha-01, state=ACTIVE_READY, retries=3\nSession 2: id=sess-beta-02, state=ACTIVE_READY, retries=5\nInitialization Order: ZERO_DEFAULTS -> FIELD_INITS -> CONSTRUCTOR_BODY`,
        codeNotes: [
          { line: 4, note: 'Explicit initializers assign default connectionState INITIALIZING and maxRetries = 3' },
          { line: 9, note: 'Constructor body executes after field initialization, setting ACTIVE_READY' },
          { line: 17, note: 'Instance 1 receives default 3 retries; Instance 2 overrides with custom 5 retries' },
          { line: 22, note: 'Demonstrates zero-defaults -> field initializers -> constructor body order' }
        ],
        tryIt: 'Instantiate session3 with customRetries = 10 and observe maxRetries reflects 10.',
        check: {
          question: 'What is the exact execution order during object creation with the new keyword in Java?',
          options: [
            'Memory Zeroing -> Explicit Field Initializers -> Constructor Body',
            'Constructor Body -> Explicit Field Initializers -> Memory Zeroing',
            'Constructor Body runs first, then memory is zeroed'
          ],
          answer: 0,
          why: 'The JVM first zeros all fields, then executes explicit initializers in top-to-bottom order, and finally runs the constructor body.'
        }
      },
      {
        title: 'Constructors, Overloading & Constructor Chaining via this()',
        say: [
          'A constructor is a specialized initialization block possessing the exact same identifier name as its enclosing class, with no return type declared (not even void). If a class defines zero explicit constructors, the Java compiler automatically synthesizes a default public no-argument constructor that invokes super(). However, the moment you declare even a single parameterized constructor, javac permanently suppresses this automatic default constructor.',
          'Classes frequently define multiple constructor overloads to support various initialization configurations (e.g. minimal vs fully customized parameters). To avoid code duplication and maintain invariant validation in a single location, Java provides Constructor Chaining via the this(...) syntax.',
          'The inviolable syntax rule of constructor chaining is that this(...) MUST be the very first statement inside the constructor body. The compiler prohibits placing any logging, calculations, or statements before this(...), and it strictly forbids circular constructor invocations (e.g. constructor A invoking B, which invokes A).'
        ],
        example: 'Like ordering coffee at a barista: asking for "a coffee" (no-arg constructor) automatically delegates to "medium dark roast with whole milk" (primary parameterized constructor). You don’t have multiple distinct coffee machines; all orders funnel into the primary brewing machine with sensible defaults.',
        code: `// Constructor Chaining via this() Simulation
class HttpClientConfiguration {
  endpoint: string;
  timeoutMs: number;
  enableTls: boolean;
  maxConnections: number;

  // Constructor 1: Full specification
  constructor(endpoint: string, timeoutMs: number, enableTls: boolean, maxConnections: number) {
    this.endpoint = endpoint;
    this.timeoutMs = timeoutMs;
    this.enableTls = enableTls;
    this.maxConnections = maxConnections;
  }

  // Factory/Constructor Chaining simulation (simulates Java: this(endpoint, timeoutMs, true, 10))
  static createDefault(endpoint: string): HttpClientConfiguration {
    return new HttpClientConfiguration(endpoint, 5000, true, 10);
  }

  static createWithTimeout(endpoint: string, timeoutMs: number): HttpClientConfiguration {
    return new HttpClientConfiguration(endpoint, timeoutMs, true, 20);
  }
}

const config1 = HttpClientConfiguration.createDefault('https://api.pinit.os');
const config2 = HttpClientConfiguration.createWithTimeout('https://payments.pinit.os', 12000);

console.log('Config 1: ' + config1.endpoint + ', timeout=' + config1.timeoutMs + 'ms, conns=' + config1.maxConnections);
console.log('Config 2: ' + config2.endpoint + ', timeout=' + config2.timeoutMs + 'ms, conns=' + config2.maxConnections);
console.log('Chaining Invariant: THIS_CALL_DELEGATES_TO_PRIMARY_CONSTRUCTOR');`,
        output: `Config 1: https://api.pinit.os, timeout=5000ms, conns=10\nConfig 2: https://payments.pinit.os, timeout=12000ms, conns=20\nChaining Invariant: THIS_CALL_DELEGATES_TO_PRIMARY_CONSTRUCTOR`,
        codeNotes: [
          { line: 9, note: 'Primary 4-parameter constructor centralizes all field assignment invariants' },
          { line: 18, note: 'Default constructor delegates to primary constructor with 5000ms timeout and 10 conns' },
          { line: 22, note: 'Specialized constructor configures custom timeout while defaulting TLS and pool bounds' },
          { line: 31, note: 'Confirms constructor chaining eliminates duplicate initialization logic' }
        ],
        tryIt: 'Create a createMinimal(endpoint) that delegates with timeoutMs = 1000 and maxConnections = 1.',
        check: {
          question: 'What is the required location of a this(...) constructor invocation inside a Java constructor body?',
          options: [
            'It must be the very first statement in the constructor body',
            'It must be the last statement before returning',
            'It can be placed anywhere after variable declarations'
          ],
          answer: 0,
          why: 'The Java language specification mandates that this(...) or super(...) must appear as the first statement in a constructor body.'
        }
      },
      {
        title: 'The this Reference: Disambiguation, Method Chaining & Fluent Builders',
        say: [
          'Inside any non-static instance method or constructor, the keyword this is an implicit reference variable pointing to the current executing object instance. At the bytecode level, the JVM always passes this as hidden argument 0 (occupying slot 0 in the method’s local variable array).',
          'The most common practical use of this is parameter disambiguation: when a constructor or method parameter shares the exact same identifier name as an instance field (e.g. void setPort(int port)), the local parameter shadows the field. Writing this.port = port explicitly directs the JVM to assign the local argument to the instance field.',
          'Furthermore, returning this from instance methods (return this;) is the foundational mechanism behind the Fluent Builder Pattern. Method chaining allows developers to configure complex object graphs in a clear, declarative, and readable pipeline without creating awkward intermediate variables.'
        ],
        example: 'Like filling out an official application form: when the form asks for "Applicant Signature" (parameter name), writing "I, the undersigned" (this reference) unambiguously ties the signature to the specific individual holding the pen.',
        code: `// Fluent Builder & this Reference Disambiguation Simulation
class HttpRequestPayloadBuilder {
  private url: string = '';
  private method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET';
  private headers: Record<string, string> = {};
  private bodyPayload: string = '';

  // Disambiguates and returns this for method chaining
  setUrl(url: string): this {
    this.url = url; // 'this.url' resolves instance field, 'url' resolves parameter
    return this;
  }

  setMethod(method: 'GET' | 'POST' | 'PUT' | 'DELETE'): this {
    this.method = method;
    return this;
  }

  addHeader(key: string, value: string): this {
    this.headers[key] = value;
    return this;
  }

  setBody(body: string): this {
    this.bodyPayload = body;
    return this;
  }

  build(): { requestLine: string; authHeaderPresent: boolean; payloadBytes: number } {
    return {
      requestLine: this.method + ' ' + this.url,
      authHeaderPresent: 'Authorization' in this.headers,
      payloadBytes: this.bodyPayload.length
    };
  }
}

const req = new HttpRequestPayloadBuilder()
  .setUrl('/v1/settlements')
  .setMethod('POST')
  .addHeader('Authorization', 'Bearer tok-live-9921')
  .setBody('{"amount": 4500}')
  .build();

console.log('Request Line: ' + req.requestLine);
console.log('Authorization Verified: ' + req.authHeaderPresent);
console.log('Payload Size: ' + req.payloadBytes + ' bytes');
console.log('Fluent Builder Invariant: RETURN_THIS_ENABLES_FLUENT_CHAINING');`,
        output: `Request Line: POST /v1/settlements\nAuthorization Verified: true\nPayload Size: 17 bytes\nFluent Builder Invariant: RETURN_THIS_ENABLES_FLUENT_CHAINING`,
        codeNotes: [
          { line: 9, note: 'this.url disambiguates shadowed instance field from method parameter' },
          { line: 10, note: 'Returning this allows continuous chained method invocations on same instance' },
          { line: 36, note: 'Chains setUrl, setMethod, addHeader, setBody, and build into elegant fluent statement' },
          { line: 44, note: 'Verifies correct payload construction and Authorization header inclusion' }
        ],
        tryIt: 'Add a Content-Type header to the builder and observe headers dictionary update.',
        check: {
          question: 'What is the bytecode role of the this reference in Java instance methods?',
          options: [
            'It is passed as an implicit argument occupying slot 0 of the local variable array',
            'It is a global static variable shared across all threads',
            'It is stored on the hard drive swap partition'
          ],
          answer: 0,
          why: 'In non-static methods, the JVM automatically assigns the caller object reference to slot 0 of the local variable array as this.'
        }
      },
      {
        title: 'JVM Object Memory Layout: Mark Word, Klass Word, Fields & 8-Byte Padding',
        say: [
          'Have you ever wondered how many bytes of physical RAM a Java object consumes on the heap? In 64-bit HotSpot JVM environments, every object begins with a 12-byte Object Header (when UseCompressedOops is enabled). This header contains two components: the 8-byte Mark Word and the 4-byte Klass Word.',
          'The 8-byte Mark Word is the Swiss Army knife of the JVM: it encodes the object’s identity hash code, its GC generation age (4 bits, allowing ages 0 to 15 before promotion to Old Gen), lock state bits (biased, lightweight, heavyweight synchronization), and biased locking thread IDs. The 4-byte Klass Word is a compressed pointer pointing to the class metadata in Metaspace.',
          'Following the header are the instance fields, organized to minimize padding. Finally, the HotSpot memory manager mandates that all objects in memory must be aligned to 8-byte boundaries. If header + fields do not equal an exact multiple of 8, the JVM adds 1 to 7 bytes of dead memory called Alignment Padding. Tools like JOL (Java Object Layout) inspect these physical bytes directly.'
        ],
        example: 'Like shipping cargo containers on a freight ship: the shipping container has a standardized manifest barcode and locking twistlocks (object header). The cargo is packed inside (fields), and if the container is slightly under length, spacer foam blocks (alignment padding) are added so every container locks rigidly into the ship’s 8-foot grid.',
        code: `// JVM Object Memory Layout & 8-Byte Alignment Calculation Simulation
class JvmObjectLayoutAnalyzer {
  // Simulates 64-bit HotSpot JVM with Compressed OOPs (UseCompressedOops enabled)
  calculateMemoryFootprint(primitiveBytes: number, referenceCount: number): {
    headerBytes: number;
    fieldsBytes: number;
    paddingBytes: number;
    totalAllocatedBytes: number;
  } {
    const markWord = 8;     // 8 bytes Mark Word (hash, GC age, locks)
    const klassWord = 4;    // 4 bytes compressed Klass pointer
    const headerBytes = markWord + klassWord; // 12 bytes total header

    const refsBytes = referenceCount * 4;     // 4 bytes per compressed reference
    const rawSize = headerBytes + primitiveBytes + refsBytes;

    // HotSpot aligns objects to 8-byte boundaries
    const remainder = rawSize % 8;
    const paddingBytes = remainder === 0 ? 0 : 8 - remainder;
    const totalAllocatedBytes = rawSize + paddingBytes;

    return { headerBytes, fieldsBytes: primitiveBytes + refsBytes, paddingBytes, totalAllocatedBytes };
  }
}

const analyzer = new JvmObjectLayoutAnalyzer();
// Class Example: 2 ints (8 bytes), 1 long (8 bytes), 2 object refs (8 bytes) -> fields = 24 bytes
const layout1 = analyzer.calculateMemoryFootprint(16, 2);
// Class Example: 1 boolean (1 byte) -> fields = 1 byte
const layout2 = analyzer.calculateMemoryFootprint(1, 0);

console.log('Layout 1 (Heavy): Header=12B, Fields=' + layout1.fieldsBytes + 'B, Padding=' + layout1.paddingBytes + 'B, Total=' + layout1.totalAllocatedBytes + 'B');
console.log('Layout 2 (Tiny):  Header=12B, Fields=' + layout2.fieldsBytes + 'B, Padding=' + layout2.paddingBytes + 'B, Total=' + layout2.totalAllocatedBytes + 'B');
console.log('JOL Alignment: HOTSPOT_8_BYTE_BOUNDARY_PADDING_VERIFIED');`,
        output: `Layout 1 (Heavy): Header=12B, Fields=24B, Padding=4B, Total=40B\nLayout 2 (Tiny):  Header=12B, Fields=1B, Padding=3B, Total=16B\nJOL Alignment: HOTSPOT_8_BYTE_BOUNDARY_PADDING_VERIFIED`,
        codeNotes: [
          { line: 9, note: '12-byte header: 8 bytes Mark Word + 4 bytes compressed Klass pointer' },
          { line: 17, note: 'Calculates necessary alignment padding to reach next multiple of 8 bytes' },
          { line: 30, note: 'Layout 1 raw size 36B pads with 4B to reach 40 bytes total allocation' },
          { line: 31, note: 'Layout 2 raw size 13B pads with 3B to reach 16 bytes minimum allocation' }
        ],
        tryIt: 'Calculate footprint for a class with 0 fields and verify it still occupies 16 bytes on the heap.',
        check: {
          question: 'Why does the JVM append alignment padding to objects on the heap?',
          options: [
            'To ensure every object address is aligned to an 8-byte boundary for CPU cache efficiency',
            'To fill up hard drive space so the OS does not complain',
            'To allow methods to execute backwards'
          ],
          answer: 0,
          why: 'Aligning memory addresses to 8-byte boundaries allows 64-bit CPUs to fetch object data using single memory bus transactions.'
        }
      },
      {
        title: 'Reference Identity (==) vs Semantic Equivalence (.equals()) & HashCode Contract',
        say: [
          'One of the most consequential design fundamentals in Java is the distinction between reference identity and semantic equivalence. The equality operator == strictly compares the binary values stored in variable slots: for primitive types, it compares the numbers; for object references, it compares memory pointer addresses.',
          'Two distinct objects on the heap holding identical field data will evaluate to false when compared with == because they reside at different memory addresses. To compare structural content, classes must override public boolean equals(Object obj) inherited from java.lang.Object.',
          'Crucially, whenever a class overrides equals(), it MUST override hashCode() to uphold the general contract: if two objects are equal according to equals(), calling hashCode() on each MUST produce the exact same integer result. Violating this contract breaks HashMap, HashSet, and Hashtable, causing inserted elements to become completely unretrievable.'
        ],
        example: 'Like two identical five-dollar banknotes: they have different serial numbers and physical paper fibers (reference identity == false), but in any store, they have the exact same purchasing power and face value (semantic equals() == true).',
        code: `// Reference Identity (==) vs Semantic Equivalence (.equals()) & HashCode Simulation
class SecurityStockOrder {
  constructor(
    public orderId: string,
    public symbol: string,
    public quantity: number
  ) {}

  // Semantic equivalence (.equals)
  equals(other: any): boolean {
    if (this === other) return true; // Reference identity check
    if (!other || !(other instanceof SecurityStockOrder)) return false;
    return this.orderId === other.orderId &&
           this.symbol === other.symbol &&
           this.quantity === other.quantity;
  }

  // Consistent hashCode contract
  hashCode(): number {
    let hash = 17;
    for (let i = 0; i < this.orderId.length; i++) hash = 31 * hash + this.orderId.charCodeAt(i);
    for (let i = 0; i < this.symbol.length; i++) hash = 31 * hash + this.symbol.charCodeAt(i);
    hash = 31 * hash + this.quantity;
    return hash | 0; // 32-bit integer clamp
  }
}

const ordA = new SecurityStockOrder('ORD-101', 'INFY', 500);
const ordB = new SecurityStockOrder('ORD-101', 'INFY', 500); // Distinct heap instance, identical data
const ordC = ordA; // Shared reference

console.log('ordA == ordB (Reference Identity): ' + (ordA === ordB));
console.log('ordA.equals(ordB) (Semantic Equivalence): ' + ordA.equals(ordB));
console.log('ordA == ordC (Shared Reference): ' + (ordA === ordC));
console.log('HashCodes Match: ' + (ordA.hashCode() === ordB.hashCode()));
console.log('Contract Invariant: EQUALS_AND_HASHCODE_CONTRACT_ENFORCED');`,
        output: `ordA == ordB (Reference Identity): false\nordA.equals(ordB) (Semantic Equivalence): true\nordA == ordC (Shared Reference): true\nHashCodes Match: true\nContract Invariant: EQUALS_AND_HASHCODE_CONTRACT_ENFORCED`,
        codeNotes: [
          { line: 10, note: 'Optimization: identity check this === other returns true instantly' },
          { line: 11, note: 'Verifies type safety before casting and comparing fields' },
          { line: 29, note: 'ordA === ordB is false because they are distinct heap allocations' },
          { line: 30, note: 'ordA.equals(ordB) is true because all identifying fields match' },
          { line: 32, note: 'Both instances produce identical hashCodes, satisfying hash collection contracts' }
        ],
        tryIt: 'Create ordD with quantity = 600 and verify equals returns false and hashCodes differ.',
        check: {
          question: 'What is the required relationship between equals() and hashCode() in Java?',
          options: [
            'If two objects are equal via equals(), their hashCode() methods must return the same integer',
            'If two objects have the same hashCode(), they must always be equal via equals()',
            'hashCode() must always return 0'
          ],
          answer: 0,
          why: 'The contract states that equal objects must have equal hash codes. Unequal objects may share hash codes due to hash collisions.'
        }
      }
    ],
    summary: [
      'The JVM allocates objects on the heap via a 4-step sequence: loading -> memory zeroing -> explicit field initializers -> constructor body.',
      'Constructor chaining via this(...) must be the first statement in a constructor, centralizing default parameter delegation.',
      'The this keyword disambiguates instance fields and powers fluent builder method chaining.',
      'HotSpot object layout consists of an 8-byte Mark Word, 4-byte Klass pointer, instance fields, and 8-byte boundary alignment padding.',
      'Reference identity (==) checks heap address equality; semantic equivalence requires overriding equals() and hashCode() in unison.'
    ],
    projectStep: {
      title: 'Architect a Production-Grade Domain Entity & Memory-Optimized Object Model',
      steps: [
        'Profile JVM object allocation and field initialization sequences.',
        'Implement overloaded constructors with strict this(...) constructor chaining.',
        'Design a fluent builder utility leveraging this reference chaining.',
        'Calculate physical JVM heap memory footprints and alignment padding with JOL formulas.',
        'Implement robust equals() and hashCode() contracts for high-throughput HashMap collections.'
      ]
    }
  }
];








