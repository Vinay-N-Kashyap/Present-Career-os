// scripts/visuals/database-masterclass-spec.ts
// Exhaustive 60-Day Masterclass Specification for Database Engineering & Query Performance (course-database-eng)
// Total Quests: 240 Quests (Month 1: 120 Quests, Month 2: 120 Quests)
// Conforming strictly to Gate v2 semantic standard, 3-Tier Socratic Hint Ladders, ARIES recovery, MVCC, and High-Scale Storage Systems.

import { MasterclassDaySpec } from './java-masterclass-spec';

export const DATABASE_MONTH_1_SPECS: MasterclassDaySpec[] = [
  {
    "day": 1,
    "month": 1,
    "blockNum": 1,
    "title": "Relational Foundations: Codd's Relational Algebra, Tuples & Physical Storage Model",
    "stageName": "Stage 1: Mental Model Grounding",
    "stageNum": 1,
    "pedagogicalRole": "High Guidance (Relational Theory & Physical Decoupling)",
    "spokenGoal": "Deconstruct the foundational theory of relational databases: explore Edgar F. Codd's 1970 paper on Relational Algebra (Selection \u03c3, Projection \u03c0, Cartesian Product \u00d7, Join \u22c8), understand how logical relation schemas decouple completely from physical disk storage, and analyze why declarative SQL outlived procedural navigational network models.",
    "conceptInvariant": "Physical Data Independence Invariant: Applications express WHAT data they need declaratively using relational operators; the database engine retains absolute architectural freedom to decide HOW data is physically organized, indexed, cached, and retrieved on hardware disk pages without breaking application queries.",
    "failureMode": "Designing an application where business logic relies on the physical insertion order of rows in a table without an explicit ORDER BY clause, causing critical reports to return corrupted, non-deterministic orderings after an autovacuum or table reorganization.",
    "tryItFriction": "Write a relational algebra query evaluation simulator in TypeScript that takes relational expressions (Selection, Projection, Join) and evaluates them against in-memory tuple sets, verifying set semantics and attribute projection.",
    "socraticHints": [
      "Why does a SQL table have no guaranteed row order without an explicit ORDER BY?",
      "Because relational tables are defined mathematically as unordered sets of tuples!",
      "If you need deterministic order, you must supply ORDER BY column; never rely on physical disk layout."
    ],
    "situationalPuzzle": {
      "scenario": "A developer writes SELECT * FROM users LIMIT 10 to fetch the 'first 10 registered users'. Over time, as users are updated and deleted, the query suddenly returns recently registered users instead of the oldest users. What fundamental relational database rule did the developer violate?",
      "options": [
        "PostgreSQL ran out of storage space.",
        "Unordered Set Trap: Relational tables are unordered bags of tuples. LIMIT without an explicit ORDER BY id ASC returns arbitrary disk order (heap page traversal order). When rows are updated in PostgreSQL, MVCC inserts new row versions into free page slots, changing their physical position.",
        "The primary key was corrupted.",
        "LIMIT only works on sorted tables."
      ],
      "answerIdx": 1,
      "debrief": "A table is mathematically an unordered set. Without an ORDER BY clause, LIMIT merely returns whatever rows the storage engine encounters first during a physical sequential scan. MVCC updates move physical tuples, breaking any naive assumptions of insertion-order stability."
    },
    "quests": [
      {
        "id": "db-m1-d01-q1",
        "name": "Codd's Relational Algebra Operator Matrix",
        "type": "concept",
        "desc": "Map formal definitions of Selection, Projection, Set Difference, Cartesian Product, and Natural Join."
      },
      {
        "id": "db-m1-d01-q2",
        "name": "Detective Lab: Profiling Heap Traversal Order Drift under MVCC Updates",
        "type": "detective",
        "desc": "Execute updates on a test table and observe how physical heap page pointers shift while logical IDs remain constant."
      },
      {
        "id": "db-m1-d01-q3",
        "name": "Mastery Assignment: In-Memory Relational Algebra Query Evaluator",
        "type": "assignment",
        "desc": "Build a TypeScript relational algebra engine that parses and executes composite algebraic expressions against tuple sets."
      },
      {
        "id": "db-m1-d01-q4",
        "name": "Production Incident Lab: Unsorted Financial Ledger Audit Mismatch Triage",
        "type": "detective",
        "desc": "Investigate an audit discrepancy caused by an application relying on implicit heap ordering in transaction logs."
      }
    ]
  },
  {
    "day": 2,
    "month": 1,
    "blockNum": 1,
    "title": "Disk Page Layout: 8KB Slotted Pages, Tuple Headers & Row Fragmentation",
    "stageName": "Stage 1: Mental Model Grounding",
    "stageNum": 1,
    "pedagogicalRole": "High Guidance (Physical Hardware Disk Page Anatomy)",
    "spokenGoal": "Inspect the physical byte layout of database storage: explore PostgreSQL's canonical 8KB Slotted Page architecture (Page Header, Line Pointers / ItemIds growing forward, Tuples growing backward from page end), analyze tuple headers (xmin, xmax, infomask), and understand row fragmentation and TOAST overflow storage.",
    "conceptInvariant": "Slotted Page Indirection Invariant: External indexes and foreign keys reference physical tuples via a 6-byte Item Pointer (Tuple ID / TID: (block_number, offset_number)). The offset number points to a fixed 4-byte Line Pointer at the top of the page, not the raw row data. Moving or defragmenting row data inside the page does not invalidate external indexes.",
    "failureMode": "Designing a schema with an excessively wide 15KB uncompressed row: failing to understand that rows exceeding 2KB trigger out-of-line TOAST table storage, causing sudden 10x query latency spikes due to secondary TOAST B-tree lookups.",
    "tryItFriction": "Construct a binary parser in TypeScript that reads raw 8192-byte PostgreSQL page buffers, parses the 24-byte PageHeaderData, extracts line pointer arrays, and calculates free space holes between pd_lower and pd_upper.",
    "socraticHints": [
      "Why do line pointers grow from the beginning of the page while tuple data grows from the end?",
      "Because growing them towards each other maximizes contiguous free space in the center of the page without pre-allocating fixed slots!",
      "Free space equals pd_upper - pd_lower; when pd_lower >= pd_upper, the page is 100% full."
    ],
    "situationalPuzzle": {
      "scenario": "An engineer queries a table with 1,000,000 rows. The table has a description TEXT column. Queries selecting id, status run in 15ms. Queries selecting id, description take 1,200ms, even with an index. EXPLAIN (BUFFERS) shows 10x more shared buffer hits. What storage mechanism is causing this difference?",
      "options": [
        "The CPU text rendering is slow.",
        "TOAST Out-of-Line Storage Penalty: Large text columns exceeding 2KB are compressed and moved out of the main 8KB heap page into a dedicated TOAST table. Fetching the text column requires additional random disk seeks across the TOAST B-tree index, multiplying buffer reads.",
        "PostgreSQL disabled SSD caching.",
        "The description column has an invalid collation."
      ],
      "answerIdx": 1,
      "debrief": "PostgreSQL uses The Oversized-Attribute Storage Technique (TOAST) to store large values outside the primary 8KB page. Selecting TOASTed columns forces secondary I/O reads across TOAST chunks, whereas querying non-TOAST columns reads only the contiguous heap page."
    },
    "quests": [
      {
        "id": "db-m1-d02-q1",
        "name": "PostgreSQL 8KB Slotted Page Memory Layout",
        "type": "concept",
        "desc": "Deconstruct PageHeaderData (24 bytes), ItemIdData (4 bytes), pd_lower, pd_upper, and HeapTupleHeaderData (23 bytes)."
      },
      {
        "id": "db-m1-d02-q2",
        "name": "Detective Lab: Hexdump Dissection of Real Database Page Files",
        "type": "detective",
        "desc": "Use pageinspect and hexdump tools to parse raw database file pages and trace line pointers to tuple offsets."
      },
      {
        "id": "db-m1-d02-q3",
        "name": "Mastery Assignment: Slotted Page Binary Buffer Allocator",
        "type": "assignment",
        "desc": "Implement a TypeScript 8KB slotted page manager that inserts variable-length binary tuples, manages line pointers, and detects page exhaustion."
      },
      {
        "id": "db-m1-d02-q4",
        "name": "Production Incident Lab: Table Bloat & TOAST Decompression Outage Triage",
        "type": "detective",
        "desc": "Triage a production latency spike caused by excessive TOAST chunk decompression during full table scans."
      }
    ]
  },
  {
    "day": 3,
    "month": 1,
    "blockNum": 1,
    "title": "Buffer Pool Management: Clock Sweep (Second Chance), LRU-K & Dirty Page Eviction",
    "stageName": "Stage 1: Mental Model Grounding",
    "stageNum": 1,
    "pedagogicalRole": "High Guidance (In-Memory Buffer Caching & Eviction Policies)",
    "spokenGoal": "Master database memory architecture: understand why databases bypass the operating system page cache using O_DIRECT, explore the Buffer Pool shared memory array, analyze the Clock Sweep (Second-Chance) eviction algorithm, and calculate dirty page flushing thresholds to prevent I/O write stalls.",
    "conceptInvariant": "Clock Sweep Reference Bit Invariant: When an in-memory page frame is accessed, its usage count is incremented (up to a max of 5 in Postgres). When eviction is required, the clock hand sweeps through buffer frames: if usage count > 0, it decrements the count; if usage count is 0 and the page is unpinned, it selects that frame for eviction, protecting hot working sets from one-off sequential table scan floods.",
    "failureMode": "Running an analytics batch query (SELECT * FROM historical_logs) during peak production hours on a poorly configured database: the sequential scan sweeps the entire buffer pool, evicting the entire active OLTP working set and dropping cache hit ratio from 99% to 20%.",
    "tryItFriction": "Implement a Clock Sweep Buffer Pool simulator in TypeScript: simulate concurrent page lookups, track reference bits and pin counts, and verify that pinned pages are never evicted during sweeps.",
    "socraticHints": [
      "What is a buffer pin in database engines?",
      "An in-memory lock indicating that an active worker thread is currently reading or modifying that page frame!",
      "A buffer frame can only be evicted if its pin count is exactly 0; evicting a pinned page causes immediate memory corruption."
    ],
    "situationalPuzzle": {
      "scenario": "A database has 64 GB of RAM and a 48 GB buffer pool. Cache hit ratio is normally 99.5%. At 2:00 AM, a nightly backup script runs pg_dump. At 2:05 AM, customer transaction latency jumps from 2ms to 450ms. The buffer pool cache hit ratio dropped to 15%. Why did the backup destroy cache performance?",
      "options": [
        "The backup script deleted database indexes.",
        "Buffer Pool Cache Pollution: The full table sequential scan performed by the backup swept across gigabytes of cold historical data, decrementing usage counts of hot pages and evicting the active working set from the buffer pool.",
        "The operating system disabled the SSD driver.",
        "The backup script ran out of TCP ports."
      ],
      "answerIdx": 1,
      "debrief": "Large sequential scans can evict hot OLTP pages unless the database employs scan resistance (such as PostgreSQL's dedicated 256KB ring buffer for sequential scans, which restricts scan allocations to prevent cache pollution)."
    },
    "quests": [
      {
        "id": "db-m1-d03-q1",
        "name": "Buffer Pool Architecture & Frame Descriptors",
        "type": "concept",
        "desc": "Diagram shared memory buffer descriptors, buffer hash table lookups, pin counters, and dirty flags."
      },
      {
        "id": "db-m1-d03-q2",
        "name": "Detective Lab: Profiling pg_buffercache to Measure Working Set Residence",
        "type": "detective",
        "desc": "Query pg_buffercache to inspect which relation pages occupy memory frames and track dirty page fractions."
      },
      {
        "id": "db-m1-d03-q3",
        "name": "Mastery Assignment: Clock Sweep Buffer Pool Manager in TypeScript",
        "type": "assignment",
        "desc": "Build a multi-frame buffer pool with pin/unpin semantics, dirty page tracking, and Clock Sweep eviction."
      },
      {
        "id": "db-m1-d03-q4",
        "name": "Production Incident Lab: Sequential Scan Cache Eviction Collapse Postmortem",
        "type": "detective",
        "desc": "Resolve a high-severity OLTP latency spike caused by an unindexed reporting query blowing out the buffer pool."
      }
    ]
  },
  {
    "day": 4,
    "month": 1,
    "blockNum": 1,
    "title": "Write-Ahead Logging (WAL) & Crash Recovery: ARIES Redo/Undo Protocols",
    "stageName": "Stage 1: Mental Model Grounding",
    "stageNum": 1,
    "pedagogicalRole": "High Guidance (Crash Durability & Recovery Semantics)",
    "spokenGoal": "Unravel the mechanics of database durability: examine C. Mohan's seminal ARIES recovery algorithm (Analysis, Redo, Undo phases), explore Write-Ahead Logging (WAL) record structures (Log Sequence Numbers / LSN), and understand why dirty pages must never hit disk before their corresponding WAL record is synced.",
    "conceptInvariant": "WAL Protocol Invariant (Page LSN vs Flushed LSN): A dirty page in the buffer pool may only be written to persistent table storage if and only if the page's Page_LSN is less than or equal to the Flushed_LSN (the highest LSN written and synced to disk in the WAL stream).",
    "failureMode": "Writing a dirty buffer page to disk before the WAL record is flushed to persistent storage: if power fails mid-write, the database crashes with modified data pages that have no corresponding log record, rendering transaction rollback impossible and corrupting state.",
    "tryItFriction": "Construct a simplified ARIES recovery engine in TypeScript: given an append-only WAL log with transaction Begin, Update, Commit, and Abort records, simulate system crash and execute Analysis, Redo, and Undo passes.",
    "socraticHints": [
      "What are the three distinct phases of ARIES recovery?",
      "Analysis (reconstruct active transaction table and dirty page table), Redo (repeat history forward from oldest unwritten page), and Undo (rollback uncommitted transactions backward)!",
      "Redo repeats history to bring the database to the exact state at crash; Undo cleans up loser transactions."
    ],
    "situationalPuzzle": {
      "scenario": "A database server loses power during a peak traffic hour. Upon reboot, the recovery log reports: 'Redo starts at LSN 104200. Undo phase rolling back 3 active transactions'. Why does the Redo phase replay transactions that were uncommitted at the time of the crash?",
      "options": [
        "The recovery engine has a bug.",
        "ARIES Repeating History Principle: Redo repeats all operations\u2014both committed and uncommitted\u2014to restore the database to the exact state it was in at the instant of failure. Once the exact state is restored, the Undo phase can safely reverse operations performed by uncommitted loser transactions.",
        "PostgreSQL assumes all crashed transactions should be committed.",
        "WAL logs cannot be read in reverse."
      ],
      "answerIdx": 1,
      "debrief": "ARIES fundamental insight is 'Repeating History': Redo brings the physical state of all pages to the exact point of the crash so that Undo can safely roll back active transactions using Compensation Log Records (CLRs)."
    },
    "quests": [
      {
        "id": "db-m1-d04-q1",
        "name": "The ARIES Recovery Protocol Architecture",
        "type": "concept",
        "desc": "Map Log Sequence Numbers (LSN), Transaction Table, Dirty Page Table (DPT), and Checkpoints."
      },
      {
        "id": "db-m1-d04-q2",
        "name": "Detective Lab: Tracing PostgreSQL WAL Records with pg_waldump",
        "type": "detective",
        "desc": "Decode raw WAL segment files, identify resource managers (Heap, Btree, Transaction), and trace LSN chains."
      },
      {
        "id": "db-m1-d04-q3",
        "name": "Mastery Assignment: ARIES Crash Recovery Simulator in TypeScript",
        "type": "assignment",
        "desc": "Implement an ARIES recovery engine executing Analysis, Redo (repeating history), and Undo phases."
      },
      {
        "id": "db-m1-d04-q4",
        "name": "Production Incident Lab: Torn Page Write Corruption & Full Page Writes (FPW) Fix",
        "type": "detective",
        "desc": "Investigate database restart failure caused by a torn 4KB sector write and configure full_page_writes to guarantee recovery."
      }
    ]
  },
  {
    "day": 5,
    "month": 1,
    "blockNum": 1,
    "title": "\u2b50 MILESTONE 1: Slotted Page Storage Engine & Buffer Pool Manager",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Milestone Gate: Physical Storage & Memory Engine)",
    "spokenGoal": "Assemble Milestone 1: Combine 8KB slotted page binary layout, line pointer allocation, Clock Sweep buffer pool eviction, and WAL write logging into a unified, functioning in-memory and disk storage engine in TypeScript.",
    "conceptInvariant": "Engine Storage Invariant: The storage manager must guarantee that any tuple inserted can be retrieved deterministically by its Item Pointer (Tuple ID). If the buffer pool is full, it must evict unpinned pages using Clock Sweep, flushing dirty pages only after corresponding WAL records are synced.",
    "failureMode": "Failing to acquire buffer page pins during concurrent reads and writes, allowing the eviction clock sweep to swap out an active page while another thread is reading its slotted line pointers, causing segmentation faults.",
    "tryItFriction": "Build and pass the Milestone 1 test harness: insert 10,000 variable-length tuples across 50 pages into a 16-frame buffer pool, verifying zero memory leaks, correct pin tracking, and deterministic page recovery after simulated crash.",
    "socraticHints": [
      "What happens when an inserted tuple is larger than the available free space on the current page?",
      "The storage engine must allocate a new 8KB disk page, add it to the relation file, and link it into the buffer pool!",
      "Always check pd_upper - pd_lower against tuple size + sizeof(ItemIdData)."
    ],
    "situationalPuzzle": {
      "scenario": "In your Milestone 1 engine, concurrent threads report corrupted data when reading rows. Debugging reveals that thread A read line pointer 3, but received data belonging to line pointer 4. What race condition occurred in the buffer pool?",
      "options": [
        "The OS filesystem failed to sync.",
        "Unpinned Buffer Eviction Race: Thread A located the page in the buffer pool, but failed to increment the buffer pin count before yielding. The eviction thread evicted the page and loaded a completely different table page into that exact frame while Thread A read from it.",
        "The TypeScript compiler optimized away the buffer array.",
        "PostgreSQL port was blocked by firewall."
      ],
      "answerIdx": 1,
      "debrief": "Pins are the fundamental synchronization mechanism in buffer pool managers. Before accessing any memory inside a buffer frame, a worker must pin the buffer. Eviction must strictly ignore pinned buffers."
    },
    "quests": [
      {
        "id": "db-m1-d05-q1",
        "name": "Milestone 1 Architecture: Storage Engine & Buffer Manager Blueprint",
        "type": "concept",
        "desc": "Design the class interfaces and binary layouts for SlottedPage, BufferPoolManager, and DiskStorageManager."
      },
      {
        "id": "db-m1-d05-q2",
        "name": "Detective Lab: Auditing Buffer Pin Leaks & Memory Frame Starvation",
        "type": "detective",
        "desc": "Run automated leak detection to find unreleased buffer pins and diagnose unevictable buffer pool stalls."
      },
      {
        "id": "db-m1-d05-q3",
        "name": "Mastery Assignment: Full Slotted Page & Buffer Pool Engine in TypeScript",
        "type": "assignment",
        "desc": "Build the complete Milestone 1 storage manager supporting insert, read by TID, update, pin/unpin, and Clock Sweep eviction."
      },
      {
        "id": "db-m1-d05-q4",
        "name": "Production Incident Lab: Buffer Pool Out of Memory Crash Triage",
        "type": "detective",
        "desc": "Triage and fix an engine crash caused by buffer pool exhaustion under heavy concurrent write loads."
      }
    ]
  },
  {
    "day": 6,
    "month": 1,
    "blockNum": 2,
    "title": "B+ Tree Index Internals: Node Splitting, Fan-Out & Pointer Alignment",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Tree Structure & Hardware Cache Alignment)",
    "spokenGoal": "Dissect the workhorse of relational databases: analyze B+ Tree architecture (Internal routing nodes vs Leaf data nodes), calculate node fan-out based on 8KB page alignment, examine 50/50 node splitting and parent key elevation, and trace logarithmic search complexity O(log_B N).",
    "conceptInvariant": "B+ Tree Invariant: All leaf nodes reside at the exact same depth from root to maintain perfect balance. Internal nodes store only routing keys and child page pointers; leaf nodes store actual keys and 6-byte heap Item Pointers (TIDs), linked sequentially via next/prev leaf sibling pointers.",
    "failureMode": "Assuming B-Trees and B+ Trees are identical: failing to realize that B+ Trees store data pointers only in leaf nodes, which allows internal nodes to fit 4x more routing keys per 8KB page, achieving fan-outs of 300+ and reducing tree height to 3 levels for billions of rows.",
    "tryItFriction": "Construct a B+ Tree node splitting visualizer in TypeScript: insert sequential and random integer keys into fixed-capacity nodes, triggering bottom-up node splits and parent pointer updates.",
    "socraticHints": [
      "Why are leaf nodes linked bidirectionally in a B+ Tree?",
      "To allow fast horizontal range scans (e.g. BETWEEN 10 AND 50) without having to traverse back up to parent internal nodes!",
      "Once you find the starting key at O(log N), range queries are simply linear linked list traversals."
    ],
    "situationalPuzzle": {
      "scenario": "A table has 100,000,000 rows. Keys are 8-byte integers, and page pointers are 6 bytes. 8KB pages are used. The database administrator claims that searching for any primary key requires at most 3 disk page reads. How is this mathematically possible?",
      "options": [
        "The database skips checking the index.",
        "High Fan-Out Tree Geometry: With 14-byte entries, each 8KB internal page holds over 500 child pointers (fan-out B = 500). Height = ceil(log_500(100,000,000)) = 3. Level 1 (Root) holds 500 keys, Level 2 holds 250,000 keys, and Level 3 leaves hold 125,000,000 keys. Root and Level 2 are permanently cached in RAM, requiring only 1 leaf disk read.",
        "B+ trees compress all 100M keys into 8KB.",
        "The OS uses linear search."
      ],
      "answerIdx": 1,
      "debrief": "B+ Trees achieve shallow tree heights (typically 3 to 4 levels) due to massive fan-out (hundreds of keys per 8KB page). Because top levels are cached in the buffer pool, lookups cost 1 or fewer physical disk I/Os."
    },
    "quests": [
      {
        "id": "db-m1-d06-q1",
        "name": "B+ Tree Mathematical Anatomy & Fan-Out Math",
        "type": "concept",
        "desc": "Calculate page capacity, fan-out ratios, and maximum tree capacity across 1 to 4 levels for 8KB pages."
      },
      {
        "id": "db-m1-d06-q2",
        "name": "Detective Lab: Visualizing Real PostgreSQL B-Tree Metapages with amcheck",
        "type": "detective",
        "desc": "Use amcheck and pageinspect to examine B-tree root, internal, and leaf pages in live database tables."
      },
      {
        "id": "db-m1-d06-q3",
        "name": "Mastery Assignment: In-Memory B+ Tree with Dynamic Node Splitting",
        "type": "assignment",
        "desc": "Implement a TypeScript B+ Tree supporting insert, find, range scan, and recursive bottom-up node splitting."
      },
      {
        "id": "db-m1-d06-q4",
        "name": "Production Incident Lab: Unbalanced B-Tree Index Bloat & Root Split Stall",
        "type": "detective",
        "desc": "Diagnose write latency spikes caused by cascading node splits during high-concurrency batch inserts."
      }
    ]
  },
  {
    "day": 7,
    "month": 1,
    "blockNum": 2,
    "title": "Clustered vs Secondary Indexes: InnoDB Index Organization vs Postgres Heap & HOT Updates",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Storage Engine Comparative Architecture)",
    "spokenGoal": "Compare the two dominant database storage paradigms: MySQL InnoDB's Clustered Index (Index-Organized Table where leaf pages store the actual table row data) versus PostgreSQL's Heap Storage with Secondary Indexes, and master Heap-Only Tuple (HOT) updates to avoid secondary index write amplification.",
    "conceptInvariant": "Clustered vs Secondary Indirection Invariant: In InnoDB, secondary index leaves store the Primary Key value (requiring a double-lookup: secondary index -> primary index -> row data). In PostgreSQL, all indexes store physical TIDs (block, offset). To prevent updating every index on row update, PostgreSQL uses HOT: if the update fits in the same page and no indexed column changed, secondary indexes are untouched.",
    "failureMode": "Designing a high-update table in PostgreSQL where every single column is indexed: updating any column invalidates HOT, forcing write amplification where 1 row update requires writing new entries into 15 distinct B-tree indexes.",
    "tryItFriction": "Simulate and compare write amplification in TypeScript: benchmark update throughput on a table with 5 indexes when HOT is active vs when HOT is disabled due to insufficient page fillfactor.",
    "socraticHints": [
      "What is required for a PostgreSQL update to qualify for HOT (Heap-Only Tuples)?",
      "Two conditions: 1) The updated row version must fit in the exact same 8KB page as the original, and 2) No indexed column is modified!",
      "Lowering the table fillfactor (e.g. to 80%) reserves 20% free space in each page specifically for HOT updates."
    ],
    "situationalPuzzle": {
      "scenario": "A high-frequency tracking table receives 20,000 updates/sec on a status column. Write latency suddenly spikes by 800% after an engineer adds an index on an unrelated column updated_at. Why did adding this index destroy update performance?",
      "options": [
        "The CPU cannot calculate timestamps.",
        "HOT Optimization Disqualification: Previously, updating status did not touch any indexed column, allowing PostgreSQL to use HOT (Heap-Only Tuple) updates without touching indexes. Because updated_at is updated on every write and is now indexed, HOT is disabled, forcing the database to insert entries into every index on the table for every update.",
        "PostgreSQL indexes are limited to 3 columns.",
        "The SSD ran out of inode numbers."
      ],
      "answerIdx": 1,
      "debrief": "When any indexed column is updated, PostgreSQL cannot use HOT updates. It must insert a new index pointer for every index on the table, multiplying write I/O and causing index bloat. Never index high-churn timestamp columns blindly."
    },
    "quests": [
      {
        "id": "db-m1-d07-q1",
        "name": "Storage Engine Showdown: InnoDB Clustered vs Postgres Heap",
        "type": "concept",
        "desc": "Compare secondary index lookup overhead, primary key churn, and space amplification between models."
      },
      {
        "id": "db-m1-d07-q2",
        "name": "Detective Lab: Verifying HOT Updates with pg_stat_user_tables (n_tup_hot_upd)",
        "type": "detective",
        "desc": "Profile n_tup_upd vs n_tup_hot_upd and verify fillfactor adjustments to maximize HOT update ratios."
      },
      {
        "id": "db-m1-d07-q3",
        "name": "Mastery Assignment: HOT Update Heap Storage Emulator in TypeScript",
        "type": "assignment",
        "desc": "Build an in-memory page manager that implements HOT chains and pruning without updating secondary indexes."
      },
      {
        "id": "db-m1-d07-q4",
        "name": "Production Incident Lab: Index Write Amplification Outage Remediation",
        "type": "detective",
        "desc": "Remediate a disk I/O saturation crisis caused by redundant secondary indexes disabling HOT on high-churn tables."
      }
    ]
  },
  {
    "day": 8,
    "month": 1,
    "blockNum": 2,
    "title": "Composite Indexes & The Leftmost Prefix Rule: Index Skip Scans & Covering Indexes",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Composite Index Search Geometry)",
    "spokenGoal": "Master multi-column indexing: understand lexicographical tuple ordering in composite indexes (col1, col2, col3), apply the Leftmost Prefix Rule to predict when indexes can and cannot be used, explore Index Skip Scans, and design Covering Indexes (Index-Only Scans) using the INCLUDE clause.",
    "conceptInvariant": "Leftmost Prefix Invariant: A composite index on (A, B, C) can satisfy queries filtering on (A), (A, B), or (A, B, C). It CANNOT directly satisfy queries filtering only on (B) or (C) via an index range scan because the index is sorted primarily by A.",
    "failureMode": "Creating three separate single-column indexes on (user_id), (status), and (created_at) on a 50-million-row table, expecting them to accelerate WHERE user_id = 5 AND status = 'ACTIVE' ORDER BY created_at DESC, forcing the database to perform an expensive Bitmap Index Scan and Sort.",
    "tryItFriction": "Construct a composite key lexicographical comparator in TypeScript and prove why queries with equality on column A and range on column B can utilize the composite index, but range on column A prevents index usage on column B.",
    "socraticHints": [
      "What is the difference between filtering on WHERE A = 1 AND B > 5 versus WHERE A > 1 AND B = 5 on index (A, B)?",
      "In A = 1 AND B > 5, all matching rows are contiguous in the index! In A > 1 AND B = 5, matching B values are scattered across different A ranges.",
      "Equality predicates must always come first in composite index column ordering!"
    ],
    "situationalPuzzle": {
      "scenario": "An engineer has an index ON orders(tenant_id, created_at, status). Query 1: WHERE tenant_id = 42 AND created_at > '2026-01-01' AND status = 'COMPLETED'. Query 2: WHERE tenant_id = 42 AND status = 'COMPLETED' AND created_at > '2026-01-01'. Will Query 2 use the index efficiently?",
      "options": [
        "No, because the WHERE clause order does not match the index definition order.",
        "Yes, the SQL query optimizer reorders commutative AND predicates automatically: Both queries match the exact same index path (equality on tenant_id, then range on created_at). However, status will be evaluated as a filter rather than an index seek boundary because it follows a range predicate.",
        "Query 2 will cause a syntax error.",
        "PostgreSQL requires separate indexes for each permutation."
      ],
      "answerIdx": 1,
      "debrief": "SQL query WHERE clauses are unordered Boolean conjunctions; the optimizer matches predicates against index columns regardless of their written order in SQL. However, once a range filter occurs (created_at > ...), subsequent index columns cannot narrow the seek range."
    },
    "quests": [
      {
        "id": "db-m1-d08-q1",
        "name": "Composite Index Lexicographical Ordering Mathematics",
        "type": "concept",
        "desc": "Map composite search keys into multidimensional search spaces and formalize the Leftmost Prefix theorem."
      },
      {
        "id": "db-m1-d08-q2",
        "name": "Detective Lab: Profiling Index Scans vs Index-Only Scans with EXPLAIN",
        "type": "detective",
        "desc": "Compare execution time between Index Scan (visiting heap) and Index-Only Scan with INCLUDE clauses."
      },
      {
        "id": "db-m1-d08-q3",
        "name": "Mastery Assignment: Composite B+ Tree Key Search Engine in TypeScript",
        "type": "assignment",
        "desc": "Implement a composite key comparator supporting multi-column prefixes, equality bounds, and range iterators."
      },
      {
        "id": "db-m1-d08-q4",
        "name": "Production Incident Lab: Suboptimal Composite Index Column Order Triage",
        "type": "detective",
        "desc": "Fix a production latency regression by reordering composite index columns from (range, equality) to (equality, range)."
      }
    ]
  },
  {
    "day": 9,
    "month": 1,
    "blockNum": 2,
    "title": "Specialized Index Types: Hash, GIN (Inverted), GiST & BRIN for Massive Datasets",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Specialized Access Method Selection)",
    "spokenGoal": "Move beyond standard B+ Trees: explore specialized index access methods including Hash Indexes for exact equality, Generalized Inverted Indexes (GIN) for JSONB and array containment (@>), Generalized Search Trees (GiST) for geometric/range data, and Block Range Indexes (BRIN) for massive append-only tables.",
    "conceptInvariant": "BRIN Space-Efficiency Invariant: In append-only datasets where physical data correlates with column values (e.g. created_at or auto-incrementing IDs), a BRIN index stores only the minimum and maximum values for each range of physical disk pages (e.g. every 128 pages = 1MB). A BRIN index on a 1-billion-row table occupies only 100KB of RAM compared to a 30GB B+ Tree.",
    "failureMode": "Creating a standard B+ tree index on a 500-million-row append-only IoT sensor table: the B+ tree grows to 40 GB, exceeding server RAM and causing write latency to collapse, when a 500 KB BRIN index would provide identical range query speed.",
    "tryItFriction": "Compare storage footprint and query performance in TypeScript between a B+ Tree, a GIN inverted index for JSONB documents, and a BRIN block range index over 1,000,000 simulated records.",
    "socraticHints": [
      "How does a GIN (Generalized Inverted Index) index semi-structured JSONB data?",
      "It creates an inverted index entry for every individual key-value pair and array element inside the JSON document, pointing to all rows containing that item!",
      "GIN indexes accelerate containment queries (data @> '{\"status\": \"active\"}') at the cost of slower writes."
    ],
    "situationalPuzzle": {
      "scenario": "A time-series table ingests 50,000 log events per second. The table is 2 TB in size. Queries filter on WHERE log_timestamp BETWEEN '2026-10-01' AND '2026-10-02'. The team cannot afford the 50 GB RAM cost of a B+ Tree. What index type should they choose and why?",
      "options": [
        "A Hash index.",
        "BRIN (Block Range Index): Because logs are inserted chronologically, physical disk pages naturally correspond to timestamp ranges. A BRIN index stores only the min/max timestamp for each 1MB disk block. It occupies under 5 MB of RAM, imposes near-zero write overhead, and enables the optimizer to skip 99% of irrelevant disk blocks during queries.",
        "Disable indexes and run sequential scans.",
        "Convert the database to MongoDB."
      ],
      "answerIdx": 1,
      "debrief": "BRIN indexes are designed for massive tables where column values correlate with physical block allocation (e.g. chronological logs). Storing only min/max summaries per block range yields a 99.9% smaller index footprint with near-zero write overhead."
    },
    "quests": [
      {
        "id": "db-m1-d09-q1",
        "name": "Index Access Methods: B-Tree vs Hash vs GIN vs GiST vs BRIN",
        "type": "concept",
        "desc": "Map PostgreSQL access methods (pg_am), operator classes, and suitable query operators (=, <, @>, &&)."
      },
      {
        "id": "db-m1-d09-q2",
        "name": "Detective Lab: Auditing GIN Index Write Bloat & Pending List Performance",
        "type": "detective",
        "desc": "Inspect gin_pending_list_limit and profile how GIN fastupdate buffers defer index insertion costs."
      },
      {
        "id": "db-m1-d09-q3",
        "name": "Mastery Assignment: BRIN Block Range Index Simulator & Block Pruner",
        "type": "assignment",
        "desc": "Build a TypeScript BRIN index emulator tracking min/max bounds across disk pages and pruning irrelevant blocks during scans."
      },
      {
        "id": "db-m1-d09-q4",
        "name": "Production Incident Lab: Unindexed JSONB Search Outage Triage",
        "type": "detective",
        "desc": "Resolve a production CPU saturation incident caused by sequential scans on unindexed JSONB attributes in user profiles."
      }
    ]
  },
  {
    "day": 10,
    "month": 1,
    "blockNum": 2,
    "title": "\u2b50 MILESTONE 2: B+ Tree Index Engine with Node Splitting & Leftmost Prefix Matcher",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Milestone Gate: Index Access Engine)",
    "spokenGoal": "Assemble Milestone 2: Build a production-grade B+ Tree indexing engine supporting high fan-out page alignment, multi-column composite keys with leftmost prefix matching, horizontal range scans via leaf sibling pointers, and index-only scan capabilities.",
    "conceptInvariant": "Index Correctness & Traversal Invariant: The index must guarantee that for any search key K, tree traversal from root to leaf visits strictly O(log_M N) pages. All leaf nodes must maintain sorted order and bidirectional sibling links, enabling efficient forward and backward range scans without heap lookups for covered queries.",
    "failureMode": "Failing to update parent routing keys when a right-side leaf node splits: the internal parent retains outdated separator keys, rendering the right half of the split leaf permanently invisible to subsequent lookups.",
    "tryItFriction": "Complete Milestone 2 by integrating your B+ Tree with the Milestone 1 Slotted Page Storage Engine, validating that composite index searches locate records in <= 3 page reads across 50,000 inserted rows.",
    "socraticHints": [
      "What is an Index-Only Scan?",
      "When all columns requested by a query (SELECT id, status) are stored directly inside the index itself, allowing the engine to return the result without ever reading the heap table!",
      "Include covered columns in the composite index or use PostgreSQL's INCLUDE clause."
    ],
    "situationalPuzzle": {
      "scenario": "During testing of your Milestone 2 index engine, inserting 10,000 rows in reverse order causes the tree height to grow to 8 levels, whereas inserting in sorted order produces a height of only 3. What flaw in the page split logic caused this imbalance?",
      "options": [
        "The computer ran out of virtual memory.",
        "Flawed Symmetrical Node Splitting: A correct B+ Tree guarantees that all leaf nodes remain at the exact same depth regardless of insertion order. If height varies by insertion order, the split routine is failing to maintain the balance invariant or is creating degenerate one-sided splits instead of true 50/50 splits.",
        "B+ trees cannot store reverse-sorted data.",
        "The primary key was an odd number."
      ],
      "answerIdx": 1,
      "debrief": "A fundamental mathematical invariant of B+ Trees is that all leaf nodes are at the identical height (H). Tree height grows strictly from the bottom up when the root node splits. Imbalanced heights indicate a broken B+ tree split invariant."
    },
    "quests": [
      {
        "id": "db-m1-d10-q1",
        "name": "Milestone 2 Architecture: Multi-Column B+ Tree Blueprint",
        "type": "concept",
        "desc": "Design the complete specification for multi-column composite key comparisons, page splitting, and leaf chaining."
      },
      {
        "id": "db-m1-d10-q2",
        "name": "Detective Lab: Verifying B+ Tree Depth Balance under Adversarial Insertion Orders",
        "type": "detective",
        "desc": "Test the index engine with ascending, descending, random, and duplicate keys to prove all leaf nodes remain at uniform depth."
      },
      {
        "id": "db-m1-d10-q3",
        "name": "Mastery Assignment: Full Composite B+ Tree Index Engine in TypeScript",
        "type": "assignment",
        "desc": "Implement a complete TypeScript B+ Tree with composite keys, leftmost prefix matching, and leaf range iterators."
      },
      {
        "id": "db-m1-d10-q4",
        "name": "Production Incident Lab: Corrupted Index B-Tree Reindex War Room",
        "type": "detective",
        "desc": "Execute an emergency zero-downtime re-indexing workflow (REINDEX CONCURRENTLY) after index corruption was detected."
      }
    ]
  },
  {
    "day": 11,
    "month": 1,
    "blockNum": 3,
    "title": "Query Lifecycle: Lexer Tokens, Abstract Syntax Trees (AST) & Logical Relational Algebra Plans",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "High Guidance (Query Compilation & Logical Optimization)",
    "spokenGoal": "Trace the path of a SQL query from raw ASCII string to executable machine representation: dissect lexical tokenization, parser grammar rules producing an Abstract Syntax Tree (AST), semantic analysis verifying table and column schemas, and the transformation of AST nodes into an unoptimized Logical Relational Algebra operator tree.",
    "conceptInvariant": "Logical Plan Equivalence Invariant: A logical plan describes WHAT relational operations must occur (Selections, Projections, Joins) independent of physical execution methods. Logical rewrite rules (predicate pushdown, projection pruning, constant folding) must preserve relational algebraic equivalence: \u03c3_{C1 \u2227 C2}(R) \u2261 \u03c3_{C1}(\u03c3_{C2}(R)).",
    "failureMode": "Writing complex queries with non-sargable functions in WHERE clauses (e.g. WHERE DATE(created_at) = '2026-10-10'), preventing the planner from pushing down predicates to the index scan and forcing a full table sequential scan of 100 million rows.",
    "tryItFriction": "Build a TypeScript SQL AST tokenizer and logical plan transformer that parses simple SELECT queries with WHERE and JOIN clauses into a tree of logical operators and applies predicate pushdown optimization.",
    "socraticHints": [
      "What is a 'sargable' predicate?",
      "Search Argument Able: a predicate formatted such that the query engine can leverage an index directly without applying runtime functions to the indexed column!",
      "Instead of WHERE YEAR(created_at) = 2026, write WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01'."
    ],
    "situationalPuzzle": {
      "scenario": "An e-commerce query SELECT * FROM orders WHERE LOWER(customer_email) = 'user@example.com' takes 4,500ms on a table of 20,000,000 orders with an index on customer_email. What is causing the index to be completely ignored?",
      "options": [
        "Email addresses cannot be indexed.",
        "Non-Sargable Predicate Suppression: Wrapping the indexed column customer_email in the function LOWER() forces the database to evaluate the function for every single row in the table, preventing B+ tree index lookups unless an explicit functional index ON orders(LOWER(customer_email)) is created.",
        "The query lacks a GROUP BY clause.",
        "PostgreSQL converted the table to an unindexed heap."
      ],
      "answerIdx": 1,
      "debrief": "Applying functions to indexed columns in WHERE clauses disables direct index access unless an expression/functional index exists. Transforming the query or creating an expression index restores index seeks."
    },
    "quests": [
      {
        "id": "db-m1-d11-q1",
        "name": "SQL Grammar, Lexer Tokens, AST Nodes & Rewriter Pipeline",
        "type": "concept",
        "desc": "Map lexical tokens, grammar production rules, AST trees, and logical operator representations."
      },
      {
        "id": "db-m1-d11-q2",
        "name": "Detective Lab: Inspecting Parser AST Trees & Logical Rewrite Trees in Debug Builds",
        "type": "detective",
        "desc": "Use internal query debugging flags (debug_print_parse, debug_print_rewritten) to inspect AST nodes."
      },
      {
        "id": "db-m1-d11-q3",
        "name": "Mastery Assignment: TypeScript SQL Parser & Logical Plan Expression Optimizer",
        "type": "assignment",
        "desc": "Build an AST parser that decomposes SELECT/JOIN/WHERE statements and executes predicate pushdown optimization."
      },
      {
        "id": "db-m1-d11-q4",
        "name": "Production Incident Lab: Non-Sargable WHERE Clause Sequential Scan CPU Spike Triage",
        "type": "detective",
        "desc": "Triage a 100% CPU saturation incident caused by non-sargable timestamp conversions in high-traffic endpoints."
      }
    ]
  },
  {
    "day": 12,
    "month": 1,
    "blockNum": 3,
    "title": "Cost-Based Optimizer (CBO): Disk I/O vs CPU Cost Models, Selectivity & pg_statistic Histograms",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Statistical Estimation & Cost Modeling)",
    "spokenGoal": "Understand the mathematical brain of the database: analyze how the Cost-Based Optimizer (CBO) estimates plan costs using disk I/O costs (seq_page_cost, random_page_cost) and CPU operations (cpu_tuple_cost, cpu_operator_cost), and explore how catalog statistics (pg_statistic, Most Common Values (MCV), equi-depth histograms) estimate predicate selectivity.",
    "conceptInvariant": "CBO Cost Minimization Invariant: The optimizer calculates Total Cost = (pages read \u00d7 page_cost) + (tuples evaluated \u00d7 cpu_cost). It evaluates multiple physical candidate paths (Seq Scan, Index Scan, Bitmap Index Scan) and chooses the path with minimal estimated total cost based on statistical selectivity.",
    "failureMode": "Allowing ANALYZE statistics to grow stale after bulk-loading 50 million rows: the optimizer assumes the table has only 1,000 rows, chooses a nested loop join with sequential inner scans, and turns a 50ms query into a 45-minute production outage.",
    "tryItFriction": "Calculate the exact estimated cost in TypeScript for both a Sequential Scan and an Index Scan given table pages, tuple count, correlation factor, and selectivity, matching PostgreSQL's cost formulas.",
    "socraticHints": [
      "Why does PostgreSQL default seq_page_cost = 1.0 and random_page_cost = 4.0?",
      "Because on spinning HDDs, random disk seeks incurred a 4x mechanical latency penalty over contiguous sequential reads!",
      "On modern NVMe SSDs, random_page_cost is commonly reduced to 1.1 to reflect near-zero random seek latency."
    ],
    "situationalPuzzle": {
      "scenario": "A developer notices that for WHERE status = 'FAILED', the database uses an index scan. But for WHERE status = 'SUCCESS', it performs a sequential scan, even though the same index exists on status. Why did the optimizer make different choices for the same column?",
      "options": [
        "The index is broken for the value 'SUCCESS'.",
        "Selectivity & Most Common Values (MCV) Disparity: If 'SUCCESS' accounts for 95% of rows, reading via the index would cause 950,000 random page reads plus heap visits, which is far slower than a single contiguous sequential scan of the table pages. 'FAILED' accounts for only 0.1% of rows, making the index scan dramatically cheaper.",
        "PostgreSQL randomly alternates scan types for load balancing.",
        "The table has too many foreign keys."
      ],
      "answerIdx": 1,
      "debrief": "The CBO evaluates selectivity using pg_statistic MCV lists. When a predicate matches a large fraction of the table (low selectivity), sequential scans are mathematically cheaper than jumping back and forth between index pages and heap pages."
    },
    "quests": [
      {
        "id": "db-m1-d12-q1",
        "name": "CBO Cost Formula Math: seq_page_cost, random_page_cost, cpu_tuple_cost",
        "type": "concept",
        "desc": "Derive the mathematical cost formulas used by System R and PostgreSQL cost optimizers."
      },
      {
        "id": "db-m1-d12-q2",
        "name": "Detective Lab: Dissecting pg_stats, Most Common Values (MCV) & Histogram Bounds",
        "type": "detective",
        "desc": "Query pg_stats to inspect null_frac, n_distinct, most_common_vals, and histogram_bounds."
      },
      {
        "id": "db-m1-d12-q3",
        "name": "Mastery Assignment: CBO Cost Estimator & Selectivity Calculation Engine in TypeScript",
        "type": "assignment",
        "desc": "Build a cost estimation module that evaluates candidate physical scan paths using statistical histograms."
      },
      {
        "id": "db-m1-d12-q4",
        "name": "Production Incident Lab: Stale Table Statistics Join Explosion & Emergency ANALYZE War Room",
        "type": "detective",
        "desc": "Recover a degraded production database after an overnight bulk data load corrupted optimizer statistics."
      }
    ]
  },
  {
    "day": 13,
    "month": 1,
    "blockNum": 3,
    "title": "Join Algorithms: Nested Loop, Hash Join (In-Memory & Grace Spill) & Sort-Merge Join",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Physical Join Operator Mechanics)",
    "spokenGoal": "Demystify physical relational join execution: compare the three canonical join algorithms\u2014Nested Loop (ideal for small outer sets with indexed inner lookups), Hash Join (ideal for large unindexed equijoins using in-memory hash tables with Grace multi-pass disk spilling), and Sort-Merge Join (optimal for presorted inputs or range joins).",
    "conceptInvariant": "Hash Join Space & Memory Invariant: An in-memory hash join builds an in-memory hash table on the smaller relation (inner table). If the inner relation exceeds available memory (work_mem), the engine partitions both relations into hash buckets on disk (Grace Hash Join) to process joins iteratively without running out of RAM.",
    "failureMode": "Setting work_mem too low (e.g. default 4MB) for high-volume analytics joins, forcing Hash Joins to spill to disk (Batch 0, Batch 1, etc.), turning fast memory hashing into thousands of temporary disk I/O operations.",
    "tryItFriction": "Implement all three join algorithms (Nested Loop, Hash Join with bucket overflow, and Sort-Merge Join) in TypeScript, benchmarking CPU operations and memory footprints across varying dataset distributions.",
    "socraticHints": [
      "When is Sort-Merge Join preferred over Hash Join?",
      "When both inputs are already sorted by the join key (e.g. from B+ tree index scans), or when the join condition is an inequality/range join!",
      "Sort-Merge scans both tables linearly in O(N + M) without building large in-memory hash tables."
    ],
    "situationalPuzzle": {
      "scenario": "An analytics query joining two tables of 5,000,000 rows each runs in 3 seconds on an engineer's laptop, but takes 180 seconds on the staging server. Looking at EXPLAIN (ANALYZE, BUFFERS) reveals: 'Hash Join (Batches: 64, Disk Spill: 450 MB)'. What configuration difference caused this disk spill?",
      "options": [
        "The staging database has corrupted network sockets.",
        "work_mem Memory Constraint: On the laptop, work_mem was set high enough (1 GB) for the hash table to reside entirely in RAM. On staging, work_mem was set to the default 4 MB, forcing PostgreSQL to partition the join into 64 disk batches with massive temporary file write/read cycles.",
        "The staging database lacks a primary key.",
        "Hash joins cannot run in production environments."
      ],
      "answerIdx": 1,
      "debrief": "When the build relation exceeds work_mem, PostgreSQL switches from single-batch in-memory hashing to multi-batch Grace Hash Join, spilling partitions to temporary disk files. Increasing work_mem for the query session eliminates disk spills."
    },
    "quests": [
      {
        "id": "db-m1-d13-q1",
        "name": "Physical Join Mechanics: Nested Loop vs Hash Join vs Sort-Merge Matrix",
        "type": "concept",
        "desc": "Compare asymptotic complexity, memory bounds, prerequisite index structures, and operator pipelining."
      },
      {
        "id": "db-m1-d13-q2",
        "name": "Detective Lab: Profiling work_mem Sizing & Temp File Spills with EXPLAIN ANALYZE",
        "type": "detective",
        "desc": "Measure temp read/write bytes in query plans and calculate optimal session-level work_mem parameters."
      },
      {
        "id": "db-m1-d13-q3",
        "name": "Mastery Assignment: In-Memory & Grace Partitioned Hash Join Engine in TypeScript",
        "type": "assignment",
        "desc": "Implement a complete Grace Hash Join simulator that partitions records to virtual disk files when memory limit is exceeded."
      },
      {
        "id": "db-m1-d13-q4",
        "name": "Production Incident Lab: 3 AM Batch Analytics Temp File Disk Exhaustion Outage Triage",
        "type": "detective",
        "desc": "Investigate disk volume exhaustion caused by concurrent unconstrained hash join temp file spills."
      }
    ]
  },
  {
    "day": 14,
    "month": 1,
    "blockNum": 3,
    "title": "Execution Plan Diagnostics: EXPLAIN (ANALYZE, BUFFERS), Cost Estimation vs Actuals & Scan Types",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Query Plan Autopsy & Buffer Telemetry)",
    "spokenGoal": "Master query plan autopsy like a principal database engineer: decode EXPLAIN (ANALYZE, BUFFERS, TIMING, COSTS, VERBOSE), differentiate estimated startup cost vs total cost, spot estimation skew (estimated rows vs actual rows), and analyze memory/buffer hits (shared hit, read, dirtied, written).",
    "conceptInvariant": "Estimation Accuracy Invariant: If Estimated Rows differs from Actual Rows by more than 10\u00d7 (e.g. Estimated: 1, Actual: 500,000), the optimizer's cost equations are invalidated, often leading to disastrous physical operator choices (e.g. choosing Nested Loop instead of Hash Join).",
    "failureMode": "Reading only EXPLAIN without ANALYZE or BUFFERS: missing that a query scanning 10 rows actually reads 50,000 buffer pages from disk because of extreme physical table bloat or missing join filter indexes.",
    "tryItFriction": "Build a TypeScript EXPLAIN plan visualizer that parses PostgreSQL JSON plan outputs, identifies cost bottlenecks, highlights estimation skew ratios, and flags unindexed sequential scans.",
    "socraticHints": [
      "What does 'shared hit: 1024, read: 4' mean in PostgreSQL buffer telemetry?",
      "1024 8KB pages were found already in RAM buffer pool (cache hit), while 4 pages required physical disk reads from the OS filesystem/storage!",
      "A query with high shared hit numbers is consuming substantial memory bandwidth even if disk reads are low."
    ],
    "situationalPuzzle": {
      "scenario": "An execution plan reveals: Nested Loop (cost=0.42..150000.00 rows=1 actual rows=120000 loops=1). The query takes 45 seconds. The estimated row count was 1, but actual rows was 120,000. Why did the database choose Nested Loop, and why did it perform poorly?",
      "options": [
        "The database was running in debug mode.",
        "Severe Selectivity Skew: Because the optimizer incorrectly estimated that the outer table would return only 1 row, Nested Loop appeared mathematically cheaper than building a Hash Join table. In reality, executing 120,000 inner index seeks caused 120,000 random seeks and 45 seconds of latency.",
        "Nested Loops are always faster than Hash Joins.",
        "The CPU clock speed was throttled."
      ],
      "answerIdx": 1,
      "debrief": "When cardinality estimation fails by orders of magnitude (1 estimated vs 120,000 actual), the optimizer picks operators optimized for single-row lookups (Nested Loop), which collapse into massive random seek loops when executed against 120,000 rows."
    },
    "quests": [
      {
        "id": "db-m1-d14-q1",
        "name": "EXPLAIN Grammar & Telemetry: Startup Cost, Total Cost, Loops, Shared Buffers",
        "type": "concept",
        "desc": "Deconstruct every metric produced by EXPLAIN (ANALYZE, BUFFERS, TIMING, FORMAT JSON)."
      },
      {
        "id": "db-m1-d14-q2",
        "name": "Detective Lab: Auditing 10 Production Query Plans: Spotting Row Skew & Operator Regressions",
        "type": "detective",
        "desc": "Analyze a catalog of production query plans, identifying bad index scans, cartesian products, and missing stats."
      },
      {
        "id": "db-m1-d14-q3",
        "name": "Mastery Assignment: TypeScript EXPLAIN ANALYZE Parser & Automated Bottleneck Auditor",
        "type": "assignment",
        "desc": "Build an automated tool that flags bad row estimations, disk spills, and high buffer reads in plan JSON."
      },
      {
        "id": "db-m1-d14-q4",
        "name": "Production Incident Lab: 100x Estimation Skew Cascading Lock Outage War Room",
        "type": "detective",
        "desc": "Resolve a cascading lock queue caused by a runaway nested loop executing against 500,000 unexpected rows."
      }
    ]
  },
  {
    "day": 15,
    "month": 1,
    "blockNum": 3,
    "title": "\u2b50 MILESTONE 3: Cost-Based Query Optimizer Simulator & Join Plan Evaluator",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Milestone Gate: CBO Engine & Physical Plan Selector)",
    "spokenGoal": "Assemble Milestone 3: Build a functional Cost-Based Query Optimizer simulator that parses SQL ASTs, generates candidate physical execution plans (SeqScan vs IndexScan, NestedLoop vs HashJoin vs SortMerge), computes disk I/O and CPU costs using statistical catalog metadata, and selects the optimal physical execution plan.",
    "conceptInvariant": "Global Plan Optimization Invariant: Given an input query with N joined relations, the optimizer must explore join order permutations (Dynamic Programming / System R style for N <= 8, Genetic Query Optimization for N > 8), pruning strictly dominated plans while ensuring the chosen plan satisfies physical sorting and output invariants.",
    "failureMode": "Evaluating join order permutations naively with O(N!) brute-force recursion: joining 12 tables causes the optimizer itself to consume 100% CPU and freeze for 10 minutes before the query even starts executing.",
    "tryItFriction": "Complete Milestone 3 by demonstrating that your optimizer correctly chooses an Index Scan when selectivity is < 2%, switches to a Sequential Scan when selectivity > 20%, and picks Hash Join over Nested Loop for large table joins.",
    "socraticHints": [
      "How did the 1979 IBM System R optimizer solve the join ordering problem?",
      "Using bottom-up Dynamic Programming to find optimal join orders for sub-relations and memoizing optimal physical access paths!",
      "Prune sub-plans that have higher costs and identical or worse sort orders."
    ],
    "situationalPuzzle": {
      "scenario": "Your Milestone 3 optimizer produces a plan with Cost 420.0 for a Hash Join, but the actual execution takes 10x longer than a plan with Cost 550.0 using Sort-Merge. Upon inspection, the downstream consumer required an ORDER BY clause. Why was the higher-cost plan actually faster overall?",
      "options": [
        "The optimizer crashed.",
        "Interesting Orders Principle: The Sort-Merge plan produced sorted output as a natural byproduct of its algorithm, eliminating an expensive downstream O(N log N) Sort operator. The Hash Join was cheaper in isolation, but adding the subsequent Sort made the total end-to-end execution much slower.",
        "Hash Joins are prohibited with ORDER BY.",
        "Sort-Merge joins bypass the buffer pool."
      ],
      "answerIdx": 1,
      "debrief": "In System R and modern optimizers, 'Interesting Orders' track whether a physical operator produces tuples sorted on keys needed by subsequent operators (ORDER BY, GROUP BY). A slightly more expensive join that yields sorted tuples can avoid an expensive external sort."
    },
    "quests": [
      {
        "id": "db-m1-d15-q1",
        "name": "System R Dynamic Programming Join Enumeration & Interesting Orders Theory",
        "type": "concept",
        "desc": "Formalize memoization, search space pruning, and interesting orders in relational optimizers."
      },
      {
        "id": "db-m1-d15-q2",
        "name": "Detective Lab: Benchmarking CBO Plan Decisions against Real PostgreSQL Planner Outputs",
        "type": "detective",
        "desc": "Compare synthetic simulator plan choices against PostgreSQL EXPLAIN outputs on identical schemas."
      },
      {
        "id": "db-m1-d15-q3",
        "name": "Mastery Assignment: Full Cost-Based Query Optimizer & Join Plan Simulator in TypeScript",
        "type": "assignment",
        "desc": "Build the complete Milestone 3 CBO engine exploring access paths, join permutations, and cost rankings."
      },
      {
        "id": "db-m1-d15-q4",
        "name": "Production Incident Lab: Planner Freeze on 15-Table Join Outage Triage",
        "type": "detective",
        "desc": "Resolve a query latency crisis caused by exponential join enumeration on complex multi-table analytics queries."
      }
    ]
  },
  {
    "day": 16,
    "month": 1,
    "blockNum": 4,
    "title": "ACID Invariants & Write-Ahead Logging (WAL) Synchronization: fsync & ARIES Redo Logging",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Transaction Durability & WAL Contracts)",
    "spokenGoal": "Deep-dive into database reliability guarantees: explore Atomicity, Consistency, Isolation, and Durability (ACID), analyze why in-memory dirty pages cannot be immediately written to random disk locations, and master the Write-Ahead Logging (WAL) contract: WAL records must be synced to persistent disk via fsync() BEFORE dirty data pages reach disk.",
    "conceptInvariant": "WAL Protocol Durability Invariant: A transaction is committed if and only if its commit record is physically flushed to persistent non-volatile storage (fsync) in the sequential WAL log file. Modifying data pages in the buffer pool before writing WAL is strictly prohibited (Write-Ahead rule).",
    "failureMode": "Disabling fsync (fsync = off) in production to achieve 10x higher write throughput: during a power outage or kernel panic, unwritten data buffers and incomplete WAL writes cause massive page corruption, rendering the entire database unrecoverable.",
    "tryItFriction": "Construct a TypeScript WAL logger that appends transaction log records to an emulated disk file, simulates crashes at arbitrary execution points, and verifies that only transactions with completed flushed commit records survive recovery.",
    "socraticHints": [
      "Why is appending to a WAL log faster than writing dirty pages directly to the table files?",
      "Because WAL writes are strictly sequential appends to a single file, whereas flushing table pages requires hundreds of random I/O writes across scattered 8KB pages!",
      "Sequential disk writes achieve orders of magnitude higher throughput on both spinning disks and NVMe SSDs."
    ],
    "situationalPuzzle": {
      "scenario": "A high-frequency trading platform processes 10,000 transactions per second. Disk I/O waits spike to 95%, and latency jumps to 100ms. SRE discovers that every COMMIT statement blocks waiting for fdatasync() on the NVMe drive. How can they achieve high throughput while maintaining safety?",
      "options": [
        "Delete the transaction log.",
        "Group Commit & Synchronous Commit Tuning: Configure commit_delay and commit_siblings (Group Commit) so multiple concurrent committing transactions share a single disk fsync() flush, amortizing the physical I/O cost across hundreds of concurrent transactions.",
        "Turn off WAL logging completely.",
        "Switch to single-threaded transactions."
      ],
      "answerIdx": 1,
      "debrief": "Group Commit allows multiple worker transactions ready to commit to piggyback on a single physical fsync call. Instead of 10,000 separate disk syncs per second, the engine performs 50 group syncs per second, slashing disk latency while preserving strict durability."
    },
    "quests": [
      {
        "id": "db-m1-d16-q1",
        "name": "The ACID Contract, Physical Disk Flushing (fsync, fdatasync), and WAL Topology",
        "type": "concept",
        "desc": "Map POSIX file synchronization semantics, disk cache flushes, and write-ahead log structures."
      },
      {
        "id": "db-m1-d16-q2",
        "name": "Detective Lab: Measuring fsync Latency & Disk Flush Bottlenecks with pg_test_fsync",
        "type": "detective",
        "desc": "Execute pg_test_fsync across different filesystem configurations to measure physical commit boundaries."
      },
      {
        "id": "db-m1-d16-q3",
        "name": "Mastery Assignment: TypeScript Write-Ahead Log Manager with Group Commit Engine",
        "type": "assignment",
        "desc": "Build an append-only WAL manager with concurrent transaction grouping and asynchronous flush queues."
      },
      {
        "id": "db-m1-d16-q4",
        "name": "Production Incident Lab: fsync=off Production Database Post-Crash Corruption Rescue",
        "type": "detective",
        "desc": "Perform forensics and salvage uncorrupted data blocks after a crash on a server running with unsafe flush settings."
      }
    ]
  },
  {
    "day": 17,
    "month": 1,
    "blockNum": 4,
    "title": "Multi-Version Concurrency Control (MVCC): Tuple Visibility, xmin/xmax & Read Views",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Tuple Versioning & Visibility Rules)",
    "spokenGoal": "Inspect how modern relational databases achieve massive concurrent read/write concurrency without locking readers: analyze PostgreSQL's MVCC tuple visibility rules (xmin, xmax, t_infomask), transaction ID (XID) ordering, and how Read Snapshots (xmin:xmax:xip_list) determine whether a given row version is visible to a transaction.",
    "conceptInvariant": "Readers Never Block Writers Invariant: An UPDATE does not overwrite data in place; it marks the existing tuple's xmax with the current XID and inserts a brand new tuple version with its xmin set to the current XID. A SELECT reads only tuple versions committed prior to the snapshot's creation, ensuring readers never block writers and writers never block readers.",
    "failureMode": "A long-running analytical query runs for 18 hours: while running, millions of OLTP updates occur. Because the old snapshot is still active, autovacuum cannot clean up any dead tuples created after that snapshot, causing the entire database to bloat by 500 GB and exhaust disk space.",
    "tryItFriction": "Build a TypeScript MVCC visibility engine that accepts a list of tuples with (xmin, xmax) and evaluates visibility against different active transaction snapshots.",
    "socraticHints": [
      "What does a snapshot like 100:105:101,103 mean in PostgreSQL?",
      "xmin=100 (all transactions below 100 are committed), xmax=105 (all transactions >= 105 are in the future/invisible), and active transactions 101, 103 in progress!",
      "Any tuple created by 101 or 103 is invisible because those transactions had not yet committed when the snapshot was taken."
    ],
    "situationalPuzzle": {
      "scenario": "Transaction 100 begins. Transaction 101 updates row 5 from 'Pending' to 'Complete' and commits. Transaction 102 updates row 5 from 'Complete' to 'Archived' and commits. Transaction 100 runs SELECT status FROM orders WHERE id = 5. Under standard MVCC snapshot isolation, what value does Transaction 100 see and why?",
      "options": [
        "An error: Concurrent modification detected.",
        "'Pending': Because Transaction 100 took its snapshot before Transactions 101 and 102 committed, the newer tuple versions have xmin > snapshot.xmax or belong to transactions committed after the snapshot boundary, making them invisible. Transaction 100 sees the version that was valid when its query/transaction started.",
        "'Archived': Queries always see the latest committed state.",
        "NULL: The row is locked."
      ],
      "answerIdx": 1,
      "debrief": "Under MVCC snapshot visibility, a transaction observes a point-in-time snapshot. Any tuple versions created by transactions that committed after the snapshot was established are invisible, guaranteeing repeatable and isolated reads."
    },
    "quests": [
      {
        "id": "db-m1-d17-q1",
        "name": "MVCC Internals: HeapTupleHeaderData (xmin, xmax, t_infomask), XID Counters & Read Views",
        "type": "concept",
        "desc": "Map physical tuple header flags, transaction ID bitmasks, and snapshot structures."
      },
      {
        "id": "db-m1-d17-q2",
        "name": "Detective Lab: Inspecting Live Tuple Visibility & Page Inspect Flags with heap_page_items",
        "type": "detective",
        "desc": "Use pageinspect extension to observe xmin, xmax, and t_infomask bit shifts across live transactions."
      },
      {
        "id": "db-m1-d17-q3",
        "name": "Mastery Assignment: TypeScript MVCC Snapshot Visibility & Read View Evaluation Engine",
        "type": "assignment",
        "desc": "Implement a pure TypeScript snapshot visibility evaluator matching PostgreSQL HeapTupleSatisfiesVisibility rules."
      },
      {
        "id": "db-m1-d17-q4",
        "name": "Production Incident Lab: Long-Running Analytics Query Blocking Autovacuum Table Bloat Outage",
        "type": "detective",
        "desc": "Triage an emergency disk bloat incident caused by a forgotten pgAdmin query holding xmin open for 3 days."
      }
    ]
  },
  {
    "day": 18,
    "month": 1,
    "blockNum": 4,
    "title": "ANSI SQL Isolation Levels vs Reality: Dirty Reads, Non-Repeatable Reads & Phantom Reads",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Isolation Anomaly Deconstruction)",
    "spokenGoal": "Deconstruct transaction isolation guarantees: examine the ANSI SQL-92 isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable), define the classical read phenomena (P1 Dirty Read, P2 Non-Repeatable Read, P3 Phantom Read), and uncover why ANSI-92 definitions were fundamentally flawed when applied to modern MVCC implementations (as proven by Berenson et al. 1995).",
    "conceptInvariant": "Read Committed Statement Snapshot Invariant: In Read Committed isolation, every individual SQL statement acquires a fresh snapshot of the database at statement start. In Repeatable Read isolation, the entire transaction retains the snapshot created at the start of the first statement for its entire lifetime.",
    "failureMode": "Executing two consecutive SELECT queries inside a financial reconciliation transaction under default Read Committed isolation: an intervening transaction commits between statement 1 and statement 2, causing statement 2 to observe different balances, resulting in an unreconciled ledger error.",
    "tryItFriction": "Write a test suite in TypeScript simulating two concurrent transactions executing under Read Committed vs Repeatable Read, demonstrating non-repeatable reads and phantom inserts under concurrent schedules.",
    "socraticHints": [
      "What is a Phantom Read?",
      "When Transaction A reads a set of rows satisfying a condition (WHERE age > 30), and Transaction B inserts a new row satisfying that condition and commits, causing Transaction A to see the new 'phantom' row upon re-executing the query!",
      "Repeatable Read prevents phantom reads in PostgreSQL via transaction-level snapshots, whereas SQL Server requires predicate locks."
    ],
    "situationalPuzzle": {
      "scenario": "An inventory deduction transaction runs under Read Committed: SELECT qty FROM stock WHERE item_id = 42 returns 1. The application checks if (qty > 0) and issues UPDATE stock SET qty = qty - 1 WHERE item_id = 42. Another concurrent user does the exact same thing simultaneously. The final quantity is -1 (oversold). What isolation anomaly occurred?",
      "options": [
        "A hardware race condition.",
        "Lost Update / Read-Modify-Write Race: Under Read Committed, checking a value with an unlocked SELECT and later modifying it allows concurrent transactions to interleave their reads and updates. Both read qty = 1, and both decrement, overwriting each other's updates.",
        "A dirty read.",
        "A table deadlock."
      ],
      "answerIdx": 1,
      "debrief": "The check-then-act pattern without row-level locking (SELECT ... FOR UPDATE) or atomic SQL expressions (UPDATE stock SET qty = qty - 1 WHERE item_id = 42 AND qty > 0) is susceptible to lost updates in Read Committed isolation."
    },
    "quests": [
      {
        "id": "db-m1-d18-q1",
        "name": "ANSI SQL-92 Phenomena (P1, P2, P3) vs Berenson 1995 Extended Phenomena (A1, A2, A3)",
        "type": "concept",
        "desc": "Formalize isolation levels against dirty write, lost update, non-repeatable read, and phantom anomalies."
      },
      {
        "id": "db-m1-d18-q2",
        "name": "Detective Lab: Reproducing Non-Repeatable Reads & Phantoms across Multi-Client DB Connections",
        "type": "detective",
        "desc": "Execute concurrent psql sessions to observe read anomalies in Read Committed vs Repeatable Read."
      },
      {
        "id": "db-m1-d18-q3",
        "name": "Mastery Assignment: Multi-Level Isolation Transaction Simulator in TypeScript",
        "type": "assignment",
        "desc": "Build an in-memory transactional database with configurable isolation levels (Read Committed vs Repeatable Read)."
      },
      {
        "id": "db-m1-d18-q4",
        "name": "Production Incident Lab: E-Commerce Inventory Oversell Lost Update Financial Audit Triage",
        "type": "detective",
        "desc": "Fix a high-volume flash sale inventory bug that allowed 500 items to be oversold due to missing concurrency control."
      }
    ]
  },
  {
    "day": 19,
    "month": 1,
    "blockNum": 4,
    "title": "Snapshot Isolation Anomalies: Write Skew, Read-Only Anomalies & Serializable Snapshot Isolation (SSI)",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Advanced Concurrency Anomalies & SSI)",
    "spokenGoal": "Confront the subtle anomalies that bypass Repeatable Read: analyze Write Skew (where two transactions read overlapping sets and update disjoint rows, violating a global business invariant), examine Read-Only Anomalies, and explore Cahill, R\u00f6hm, and Fekete's breakthrough algorithm: Serializable Snapshot Isolation (SSI) using SIREAD locks and dependency graph cycle detection.",
    "conceptInvariant": "Serialization Graph Acyclicity Invariant: A concurrent transaction history is truly serializable if and only if its Serialization Graph (with Directed edges T1 \u2192 T2 representing read-write dependencies) contains zero directed cycles. SSI tracks dangerous rw-antidependencies in memory and aborts the first transaction that forms a cycle.",
    "failureMode": "Hospital on-call doctor scheduling: Invariant requires at least 1 doctor on call. Doctors Alice and Bob are on call. Simultaneously, Alice takes leave (checking Bob is on call), and Bob takes leave (checking Alice is on call). Under Snapshot Isolation, both commit: 0 doctors remain on call!",
    "tryItFriction": "Implement a Serialization Dependency Graph cycle detector in TypeScript: track read-write conflict edges between transactions, detect cycles, and issue serialization failure aborts (ERROR: 40001 serialization_failure).",
    "socraticHints": [
      "Why didn't Snapshot Isolation prevent the doctor on-call disaster?",
      "Because Alice updated Alice's row, and Bob updated Bob's row! There was no write-write conflict on any single row, so Snapshot Isolation allowed both to commit, even though the global invariant was violated.",
      "Only true Serializable isolation (or explicit locking) prevents Write Skew."
    ],
    "situationalPuzzle": {
      "scenario": "Two bank account transfers execute concurrently: Account A has $100, Account B has $100. Invariant: A + B >= 0. Transaction 1 withdraws $150 from A (checking A + B = 200 >= 150). Transaction 2 withdraws $150 from B (checking A + B = 200 >= 150). Both run under Repeatable Read. What is the result?",
      "options": [
        "One transaction blocks indefinitely.",
        "Write Skew Anomaly: Both transactions read consistent snapshots where A + B = 200. Since T1 modifies A and T2 modifies B, no row-level write locks collide. Both commit successfully, leaving balances A = -50, B = -50, Total = -100, violating the global invariant.",
        "The database automatically calculates total sum and rejects both.",
        "PostgreSQL converts the accounts to JSON."
      ],
      "answerIdx": 1,
      "debrief": "Write skew occurs when transactions make decisions based on values they read, but modify separate rows. Because standard Snapshot Isolation only detects conflicts when two transactions attempt to update the exact same row, write skew passes through unless Serializable isolation is used."
    },
    "quests": [
      {
        "id": "db-m1-d19-q1",
        "name": "Write Skew, Read-Only Anomalies & Serialization Graph Analysis",
        "type": "concept",
        "desc": "Formally prove why Snapshot Isolation is strictly weaker than Serializability using dependency graphs."
      },
      {
        "id": "db-m1-d19-q2",
        "name": "Detective Lab: Triggering Write Skew in Repeatable Read vs Blocking in Serializable Isolation",
        "type": "detective",
        "desc": "Write concurrent test scripts to execute the doctor on-call dilemma in PostgreSQL under both isolation levels."
      },
      {
        "id": "db-m1-d19-q3",
        "name": "Mastery Assignment: SSI Dependency Graph Conflict Tracker & Cycle Detector in TypeScript",
        "type": "assignment",
        "desc": "Build an SSI concurrency manager that tracks SIREAD locks and aborts transactions upon detecting dangerous rw-cycles."
      },
      {
        "id": "db-m1-d19-q4",
        "name": "Production Incident Lab: 3 AM Financial Balance Violation Write Skew Forensic Investigation",
        "type": "detective",
        "desc": "Investigate a negative account balance incident caused by write skew in concurrent currency conversion transactions."
      }
    ]
  },
  {
    "day": 20,
    "month": 1,
    "blockNum": 4,
    "title": "\u2b50 MILESTONE 4: MVCC Snapshot Isolation Engine with Concurrent Transaction Simulator",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Milestone Gate: MVCC Engine & Concurrency Control)",
    "spokenGoal": "Assemble Milestone 4: Construct a complete Multi-Version Concurrency Control (MVCC) engine in TypeScript. Support concurrent transactions, tuple version creation with xmin and xmax, transaction state arrays (Running, Committed, Aborted), dynamic Snapshot generation, visibility filtering, and first-committer-wins write-write conflict detection.",
    "conceptInvariant": "First-Committer-Wins Invariant: If Transaction T2 attempts to update or delete a tuple that has already been updated by an uncommitted concurrent Transaction T1, T2 must wait for T1 to finish. If T1 commits, T2 must abort with a serialization failure or re-evaluate the tuple (in Read Committed).",
    "failureMode": "Failing to handle aborted transaction tuple garbage: when a transaction aborts, its inserted tuples remain in the heap with uncommitted xmin. If the visibility checker erroneously treats aborted xmin as valid, phantom uncommitted data leaks to subsequent queries.",
    "tryItFriction": "Complete Milestone 4 by running a stress test with 100 concurrent transactions performing interleaved reads and writes, verifying 100% snapshot consistency and zero dirty reads or lost updates.",
    "socraticHints": [
      "How does the visibility engine know if a transaction is aborted without consulting a disk file on every row?",
      "By checking the in-memory Commit Status Log (CLOG / pg_xact), which stores a 2-bit state (IN_PROGRESS, COMMITTED, ABORTED) for every transaction ID!",
      "Once checked, hint bits (HEAP_XMIN_COMMITTED, HEAP_XMIN_INVALID) are written directly onto the tuple header to avoid future lookups."
    ],
    "situationalPuzzle": {
      "scenario": "During testing of your Milestone 4 engine, Transaction A updates row 10 and aborts. Transaction B then executes SELECT * FROM table WHERE id = 10. The query returns Transaction A's uncommitted data. Which component of the visibility check failed?",
      "options": [
        "The network layer failed.",
        "CLOG Status Verification Failure: The visibility engine checked that xmin was set, but failed to verify whether xmin committed in the Transaction Status Log (CLOG). Because Transaction A aborted, the tuple must be treated as dead/invisible to all other transactions.",
        "The primary key was an even number.",
        "The buffer pool was full."
      ],
      "answerIdx": 1,
      "debrief": "A tuple is only visible if its creating transaction (xmin) successfully committed. If xmin is aborted, the tuple is invisible to all transactions and eligible for physical cleanup by vacuum."
    },
    "quests": [
      {
        "id": "db-m1-d20-q1",
        "name": "Complete MVCC Architecture Blueprint: CLOG (pg_xact), Hint Bits & Snapshots",
        "type": "concept",
        "desc": "Design the data structures for transaction status arrays, snapshots, and version chain traversal."
      },
      {
        "id": "db-m1-d20-q2",
        "name": "Detective Lab: Stress Testing Snapshot Isolation Consistency under High Concurrency",
        "type": "detective",
        "desc": "Execute automated randomized transaction schedules to verify isolation properties against known test vectors."
      },
      {
        "id": "db-m1-d20-q3",
        "name": "Mastery Assignment: Production-Grade TypeScript MVCC Storage & Concurrency Engine",
        "type": "assignment",
        "desc": "Build the complete Milestone 4 MVCC engine supporting begin, commit, abort, snapshot creation, and version pruning."
      },
      {
        "id": "db-m1-d20-q4",
        "name": "Production Incident Lab: Phantom Uncommitted Data Leak Forensic Triage",
        "type": "detective",
        "desc": "Resolve a high-severity bug where uncommitted aborted transaction rows were served to API clients."
      }
    ]
  },
  {
    "day": 21,
    "month": 1,
    "blockNum": 5,
    "title": "Database Locking Hierarchy: Shared (S), Exclusive (X), Intent Locks (IS/IX) & Table vs Row Locks",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Lock Hierarchies & Granular Concurrency)",
    "spokenGoal": "Understand how relational databases maintain consistency during concurrent writes: explore the locking hierarchy (Database -> Table -> Page -> Tuple), lock modes (Shared vs Exclusive, Intent Shared vs Intent Exclusive), lock escalation prevention, and why lock conversion deadlocks occur.",
    "conceptInvariant": "Multiple-Granularity Locking Invariant: Before a transaction can acquire a lock on a child node (e.g. exclusive lock on a row), it must first acquire an intent lock (IX) on all ancestor nodes in the hierarchy (table, database), preventing concurrent transactions from acquiring conflicting coarse-grained locks (e.g. table locks).",
    "failureMode": "Executing an unindexed UPDATE or ALTER TABLE statement inside a high-throughput OLTP table: the operation requests an AccessExclusiveLock on the table, queuing behind running queries and blocking all incoming reads, causing a total connection pool exhaustion.",
    "tryItFriction": "Implement a Multi-Granularity Lock Manager in TypeScript supporting Shared, Exclusive, Intent-Shared, and Intent-Exclusive locks with lock compatibility matrix verification.",
    "socraticHints": [
      "Why is an Intent lock needed before locking an individual row?",
      "So that another transaction wanting to lock the entire table doesn't have to scan millions of rows to check if any row is locked!",
      "Checking the table's intent lock takes O(1) time."
    ],
    "situationalPuzzle": {
      "scenario": "A developer executes ALTER TABLE users ADD COLUMN age INT DEFAULT 0 on PostgreSQL 10. The table has 100M rows. Immediately, all API endpoints serving users lock up and time out. What happened?",
      "options": [
        "PostgreSQL crashed.",
        "Table Rewrite & AccessExclusiveLock Lockout: Adding a column with a non-null default prior to PostgreSQL 11 required acquiring an AccessExclusiveLock and physically rewriting every 8KB heap page, blocking all concurrent SELECT and UPDATE queries until the multi-hour rewrite completed.",
        "PostgreSQL ran out of memory.",
        "The age column created a deadlock."
      ],
      "answerIdx": 1,
      "debrief": "AccessExclusiveLock blocks even read-only SELECT queries. In modern PostgreSQL 11+, constant defaults are stored in catalog metadata without table rewrites, but DDL still requires short exclusive locks."
    },
    "quests": [
      {
        "id": "db-m1-d21-q1",
        "name": "Multi-Granularity Locking Hierarchy & Compatibility Matrix (S, X, IS, IX, SIX)",
        "type": "concept",
        "desc": "Construct the formal 5x5 lock compatibility matrix and ancestor traversal rules."
      },
      {
        "id": "db-m1-d21-q2",
        "name": "Detective Lab: Inspecting Active Locks in pg_locks & Identifying Blocked Queries",
        "type": "detective",
        "desc": "Query pg_locks joined with pg_stat_activity to map blocker and waiter process IDs."
      },
      {
        "id": "db-m1-d21-q3",
        "name": "Mastery Assignment: Multi-Granularity Lock Manager & Escalation Engine in TypeScript",
        "type": "assignment",
        "desc": "Implement a hierarchical lock manager with resource grant queues, release hooks, and compatibility checks."
      },
      {
        "id": "db-m1-d21-q4",
        "name": "Production Incident Lab: DDL AccessExclusiveLock Table Freeze Cascading Outage Triage",
        "type": "detective",
        "desc": "Resolve a production outage caused by an unindexed migration script locking an active transactional table."
      }
    ]
  },
  {
    "day": 22,
    "month": 1,
    "blockNum": 5,
    "title": "Row-Level Locking Patterns: SELECT FOR UPDATE, FOR NO KEY UPDATE, SKIP LOCKED & NOWAIT",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Row-Level Locking Patterns & Concurrency Control)",
    "spokenGoal": "Master fine-grained concurrency control: examine PostgreSQL's explicit row-level locking clauses (FOR UPDATE, FOR NO KEY UPDATE, FOR SHARE, FOR KEY SHARE), evaluate the performance and safety trade-offs of NOWAIT vs SKIP LOCKED, and design high-concurrency reservation systems without lock contention.",
    "conceptInvariant": "Pessimistic Row Lock Invariant: SELECT ... FOR UPDATE acquires an exclusive row-level lock on selected tuples until transaction commit, guaranteeing that concurrent transactions attempting to read with FOR UPDATE or mutate the rows must block. SKIP LOCKED skips already locked rows entirely, enabling lock-free distributed worker queues.",
    "failureMode": "Building a job queue using SELECT * FROM jobs WHERE status = 'PENDING' LIMIT 1 FOR UPDATE: multiple concurrent worker processes all fight for the first pending row, serializing throughput and causing massive lock wait queues.",
    "tryItFriction": "Build a multi-worker job dispatcher in TypeScript comparing standard FOR UPDATE vs FOR UPDATE SKIP LOCKED under 50 concurrent worker threads.",
    "socraticHints": [
      "What is the difference between FOR UPDATE and FOR NO KEY UPDATE?",
      "FOR NO KEY UPDATE locks row attributes for modification but does NOT block foreign key references (which only need FOR KEY SHARE)!",
      "Using FOR NO KEY UPDATE avoids unnecessary deadlocks with foreign key parent-child checks."
    ],
    "situationalPuzzle": {
      "scenario": "A payment gateway processes concurrent capture webhooks for the same order. Webhook A and Webhook B both execute SELECT balance FROM accounts WHERE id = 123 followed by an update. Webhook B overwrites Webhook A's deduction. How should the transaction be rewritten?",
      "options": [
        "Run the update twice.",
        "Pessimistic Locking with FOR UPDATE: Rewrite the initial read as SELECT balance FROM accounts WHERE id = 123 FOR UPDATE. This locks the account row at the database level, forcing Webhook B to block until Webhook A commits, ensuring serialized balance modifications.",
        "Disable transactions.",
        "Convert the account balance to a string."
      ],
      "answerIdx": 1,
      "debrief": "Using SELECT ... FOR UPDATE acquires an exclusive row lock, preventing concurrent read-modify-write races on critical financial records."
    },
    "quests": [
      {
        "id": "db-m1-d22-q1",
        "name": "Row Locking Modes: FOR UPDATE vs FOR NO KEY UPDATE vs FOR SHARE vs FOR KEY SHARE",
        "type": "concept",
        "desc": "Analyze lock interaction between row updates, foreign key constraints, and read locks."
      },
      {
        "id": "db-m1-d22-q2",
        "name": "Detective Lab: Measuring Lock Wait Times & Lock Queues with pg_stat_activity",
        "type": "detective",
        "desc": "Profile lock wait durations (wait_event_type = 'Lock') and calculate queue congestion indices."
      },
      {
        "id": "db-m1-d22-q3",
        "name": "Mastery Assignment: Concurrent Job Worker Queue Engine with FOR UPDATE SKIP LOCKED",
        "type": "assignment",
        "desc": "Build an in-memory queue engine demonstrating non-blocking worker batch claims with SKIP LOCKED."
      },
      {
        "id": "db-m1-d22-q4",
        "name": "Production Incident Lab: Worker Thread Starvation on Queues without SKIP LOCKED Triage",
        "type": "detective",
        "desc": "Resolve a queue processor bottleneck where 100 workers were serialized behind a single locked job."
      }
    ]
  },
  {
    "day": 23,
    "month": 1,
    "blockNum": 5,
    "title": "Deadlock Detection: Wait-For Graphs, Cycle Detection (Tarjan/DFS), Lock Timeouts & SRE Triage",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Deadlock Graph Theory & Incident Response)",
    "spokenGoal": "Master deadlock theory and avoidance: analyze how circular wait dependencies arise when transactions acquire locks in inconsistent orders (T1 locks A then requests B; T2 locks B then requests A), dissect database Wait-For Graph cycle detection algorithms, and configure deadlock_timeout and statement timeouts to prevent cascading connection stalls.",
    "conceptInvariant": "Global Lock Ordering Invariant: Deadlocks are mathematically impossible if all application transactions acquire locks in a globally consistent canonical order (e.g. sorted by primary key ID: SELECT ... WHERE id IN (1, 2) ORDER BY id FOR UPDATE). If order is inconsistent, Wait-For Graph cycle detection is required.",
    "failureMode": "Transaction 1 transfers money from Account A to B (locking A then B). Transaction 2 transfers money from B to A (locking B then A). When executed simultaneously, both transactions lock their first row and block on the second, resulting in a mutual deadlock.",
    "tryItFriction": "Construct a Wait-For Graph cycle detector in TypeScript using Depth-First Search / Tarjan's Strongly Connected Components algorithm, identifying deadlocked transactions and selecting the cheapest transaction to abort.",
    "socraticHints": [
      "Why doesn't the database run deadlock detection continuously on every single lock request?",
      "Because building and traversing Wait-For Graphs is computationally expensive!",
      "Databases wait for deadlock_timeout (typically 1 second) before running cycle detection, resolving 99% of transient lock waits without CPU overhead."
    ],
    "situationalPuzzle": {
      "scenario": "A batch job updates 1,000 user records in random order inside a transaction: UPDATE users SET points = points + 10 WHERE id = ANY($1). When two batch jobs run concurrently, PostgreSQL throws ERROR: 40P01: deadlock detected. How can the application permanently eliminate these deadlocks?",
      "options": [
        "Delete the table indexes.",
        "Canonical Ordering Rule: Sort the input array of IDs before executing the batch update (IDs.sort((a,b) => a - b)). When both transactions lock rows in ascending primary key order, circular wait conditions cannot form, mathematically preventing deadlocks.",
        "Increase the server CPU.",
        "Switch to MySQL."
      ],
      "answerIdx": 1,
      "debrief": "Deadlocks require circular wait dependencies (A \u2192 B and B \u2192 A). Enforcing a strict canonical lock order (e.g. ascending ID order) guarantees an acyclic wait graph, eliminating deadlocks."
    },
    "quests": [
      {
        "id": "db-m1-d23-q1",
        "name": "Deadlock Theory, Coffman Conditions, and Wait-For Graph Topology",
        "type": "concept",
        "desc": "Formalize Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait conditions."
      },
      {
        "id": "db-m1-d23-q2",
        "name": "Detective Lab: Reproducing Cross-Transaction Deadlocks & Analyzing PostgreSQL Deadlock Logs",
        "type": "detective",
        "desc": "Trigger intentional deadlocks across concurrent connections and decode PostgreSQL deadlock log messages."
      },
      {
        "id": "db-m1-d23-q3",
        "name": "Mastery Assignment: TypeScript Wait-For Graph Cycle Detector & Victim Selector",
        "type": "assignment",
        "desc": "Build an automated lock cycle detector using Tarjan's SCC algorithm with minimum-cost victim abort selection."
      },
      {
        "id": "db-m1-d23-q4",
        "name": "Production Incident Lab: 3 AM Batch Payment Processing Deadlock Storm Emergency Triage",
        "type": "detective",
        "desc": "Resolve a critical payment processing outage caused by concurrent un-ordered batch reconciliation jobs."
      }
    ]
  },
  {
    "day": 24,
    "month": 1,
    "blockNum": 5,
    "title": "Vacuuming Internals, Free Space Map (FSM), Visibility Map (VM) & Table Bloat Remediation (pg_repack)",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Physical Table Maintenance & Bloat Remediation)",
    "spokenGoal": "Examine the maintenance engine of PostgreSQL: explore autovacuum internals, understand how dead row versions (garbage) accumulate in 8KB pages after updates and deletes, analyze the Free Space Map (FSM) and Visibility Map (VM), and learn zero-downtime table bloat remediation using pg_repack.",
    "conceptInvariant": "Visibility Map & Index-Only Scan Invariant: The Visibility Map (VM) stores 2 bits per 8KB page: 1) all tuples are visible to all transactions (all-visible), and 2) all tuples are frozen (all-frozen). An Index-Only Scan can only skip reading the heap page if the page's bit in the Visibility Map is set to all-visible.",
    "failureMode": "Allowing a table with 10M updates/day to operate with autovacuum disabled: the table expands from 5 GB to 120 GB of dead tuple bloat. Queries that previously scanned 5 GB now scan 120 GB of empty space, degrading performance by 24x.",
    "tryItFriction": "Build a Table Bloat & Dead Tuple Space Reclaimer simulator in TypeScript: simulate MVCC tuple churn, measure line pointer defragmentation, and calculate space reclamation in 8KB pages.",
    "socraticHints": [
      "Why does standard VACUUM not return disk space to the operating system?",
      "Standard VACUUM marks dead tuples as free space in the Free Space Map (FSM) for future inserts, but does NOT shrink the physical file on disk (only VACUUM FULL or pg_repack does)!",
      "VACUUM FULL locks the table exclusively; pg_repack creates an online shadow table without locking reads or writes."
    ],
    "situationalPuzzle": {
      "scenario": "A table has 1,000,000 active rows (occupying 200 MB). Over 6 months, 50,000,000 updates occurred. The physical table file on disk is now 15 GB. Sequential scans take 8 seconds instead of 100ms. SRE cannot afford 2 hours of downtime for VACUUM FULL. How should they reclaim disk space?",
      "options": [
        "Drop the table and re-create it.",
        "Zero-Downtime Reorganization with pg_repack: Run pg_repack, which creates a new compact shadow table, copies active rows, streams concurrent changes via triggers, and swaps file descriptors using a brief lock, reclaiming 14.8 GB of bloated disk space without interrupting production queries.",
        "Delete all rows.",
        "Restart the database server."
      ],
      "answerIdx": 1,
      "debrief": "pg_repack builds a new table without bloat, synchronizes live modifications via trigger logs, and performs an atomic catalog swap, eliminating bloat with minimal locking."
    },
    "quests": [
      {
        "id": "db-m1-d24-q1",
        "name": "Autovacuum Architecture: Dead Tuples, FSM, Visibility Map & Freeze Maps",
        "type": "concept",
        "desc": "Map how line pointers are reclaimed, Free Space Map pages are updated, and Visibility Map bits are set."
      },
      {
        "id": "db-m1-d24-q2",
        "name": "Detective Lab: Measuring Table Bloat with pgstattuple & Tuning autovacuum_vacuum_cost_limit",
        "type": "detective",
        "desc": "Use pgstattuple to measure exact dead tuple percentages and profile vacuum throttle settings."
      },
      {
        "id": "db-m1-d24-q3",
        "name": "Mastery Assignment: TypeScript Free Space Map Allocator & Dead Tuple Compactor",
        "type": "assignment",
        "desc": "Build an FSM emulator tracking available bytes across disk blocks and packing tuples during vacuum sweeps."
      },
      {
        "id": "db-m1-d24-q4",
        "name": "Production Incident Lab: Autovacuum Starvation & 500GB Table Bloat Disk Full Emergency",
        "type": "detective",
        "desc": "Triage an emergency disk space alert where aggressive OLTP updates outpaced autovacuum capacity."
      }
    ]
  },
  {
    "day": 25,
    "month": 1,
    "blockNum": 5,
    "title": "\u2b50 MILESTONE 5: High-Throughput Lock-Free Distributed Job Queue Engine with SKIP LOCKED",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Milestone Gate: Concurrency & Lock-Free Queue)",
    "spokenGoal": "Assemble Milestone 5: Build a high-throughput, zero-contention distributed task queue engine in TypeScript leveraging pessimistic row locking, SELECT ... FOR UPDATE SKIP LOCKED, exponential backoff retry semantics, deadlock-free batch claiming, and dead-letter visibility monitoring.",
    "conceptInvariant": "Worker Isolation Invariant: In a distributed system with K concurrent worker nodes claiming batches of M jobs, no two workers may ever claim or process the same job instance. The queue must sustain linear throughput scaling without worker thread serialization or lock convoying.",
    "failureMode": "Using polling queries without SKIP LOCKED: workers lock row 1, forcing 99 other workers to block in lock queues, reducing a 100-worker distributed system to the throughput of a single worker.",
    "tryItFriction": "Complete Milestone 5 by running 32 concurrent worker threads processing 100,000 queued tasks, verifying zero duplicate claims, zero deadlocks, and near 100% linear CPU utilization.",
    "socraticHints": [
      "How does SKIP LOCKED prevent lock contention among workers?",
      "When a worker queries for pending jobs with LIMIT 10 FOR UPDATE SKIP LOCKED, the database skips any rows currently locked by other workers and immediately returns the next available 10 unlocked rows without waiting!",
      "Workers never block each other; throughput scales linearly with worker count."
    ],
    "situationalPuzzle": {
      "scenario": "During benchmark testing of your Milestone 5 queue engine, throughput collapses from 15,000 jobs/sec to 200 jobs/sec when workers claim jobs with WHERE status = 'PENDING' ORDER BY priority DESC LIMIT 10 FOR UPDATE SKIP LOCKED. Explain the bottleneck.",
      "options": [
        "The network cable is loose.",
        "Unindexed Priority Queue Sequential Scan: The query orders by priority DESC across 2,000,000 rows. Without a partial composite index ON jobs(priority DESC) WHERE status = 'PENDING', every worker executes an expensive full table sort before applying SKIP LOCKED. Adding the partial index restores 15,000 jobs/sec.",
        "PostgreSQL does not support priority queues.",
        "Workers are using too much memory."
      ],
      "answerIdx": 1,
      "debrief": "A query with ORDER BY ... FOR UPDATE SKIP LOCKED requires an index that matches the sort order and filter. Without it, the database must evaluate and sort the entire table on every fetch, destroying performance."
    },
    "quests": [
      {
        "id": "db-m1-d25-q1",
        "name": "Milestone 5 Architecture: SKIP LOCKED Queue State Machine & Partitioning Blueprint",
        "type": "concept",
        "desc": "Design table schemas, status transitions, lease timers, and heartbeat protocols for transactional queues."
      },
      {
        "id": "db-m1-d25-q2",
        "name": "Detective Lab: Benchmarking Contention Profiles: FOR UPDATE vs FOR UPDATE SKIP LOCKED",
        "type": "detective",
        "desc": "Measure worker throughput across increasing concurrency levels to demonstrate lock convoy elimination."
      },
      {
        "id": "db-m1-d25-q3",
        "name": "Mastery Assignment: Production-Grade TypeScript Distributed Task Queue Engine",
        "type": "assignment",
        "desc": "Build the complete Milestone 5 queue system with batch claims, heartbeat renewals, and dead-letter queues."
      },
      {
        "id": "db-m1-d25-q4",
        "name": "Production Incident Lab: Queue Worker Lock Convoy & Throughput Collapse Forensic Triage",
        "type": "detective",
        "desc": "Remediate a production payment webhook queue where 50 worker containers stalled due to unindexed row locks."
      }
    ]
  },
  {
    "day": 26,
    "month": 1,
    "blockNum": 6,
    "title": "Advanced Window Functions: Framing (ROWS/RANGE BETWEEN), Ranking & Sliding Aggregates",
    "stageName": "Stage 3: Autonomous Synthesis",
    "stageNum": 3,
    "pedagogicalRole": "Low Guidance (Analytical SQL & Window Frame Computation)",
    "spokenGoal": "Master analytical SQL without self-joins: explore window function execution mechanics, partition clauses, order clauses, frame specifications (ROWS vs RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW), ranking functions (ROW_NUMBER, RANK, DENSE_RANK), and lead/lag sliding aggregations.",
    "conceptInvariant": "Window Framing Invariant: Window functions compute aggregations over an ordered set of rows related to the current row without collapsing rows into a single group (unlike GROUP BY). The default frame specification when ORDER BY is present is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW, which treats peer duplicate values identically.",
    "failureMode": "Using the default RANGE frame instead of ROWS frame in large sliding aggregations: RANGE forces the engine to evaluate peer duplicate groups, multiplying memory consumption and preventing streaming aggregation.",
    "tryItFriction": "Write an analytical SQL query computing a 7-day moving average of user revenue and percentiles per region, verifying that output preserves row identity without joining back to raw tables.",
    "socraticHints": [
      "What is the difference between DENSE_RANK() and RANK()?",
      "RANK() leaves gaps after ties (e.g. 1, 2, 2, 4); DENSE_RANK() leaves no gaps (e.g. 1, 2, 2, 3)!",
      "Use DENSE_RANK() when you need consecutive rank buckets."
    ],
    "situationalPuzzle": {
      "scenario": "A financial report runs: SUM(amount) OVER (PARTITION BY account_id ORDER BY tx_date). On accounts with 100,000 transactions, the query consumes 8 GB of RAM and takes 2 minutes. Changing the clause to ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW reduces RAM to 50 MB and runs in 1.2 seconds. Why?",
      "options": [
        "The CPU cache was cold.",
        "RANGE vs ROWS Peer Grouping Memory Overhead: Without explicit ROWS framing, PostgreSQL uses RANGE framing by default. RANGE must buffer all rows with identical timestamps to check for peer duplicates before emitting a sum. ROWS processes tuples sequentially as an incremental running total without buffering.",
        "ROWS converts the query to C++.",
        "RANGE disables indexes."
      ],
      "answerIdx": 1,
      "debrief": "The default RANGE frame requires checking peer values, forcing row buffering. Specifying ROWS allows streaming one-pass evaluation with constant O(1) memory overhead."
    },
    "quests": [
      {
        "id": "db-m1-d26-q1",
        "name": "Window Function Execution Pipeline: WindowAgg, Window Frames & Peer Groups",
        "type": "concept",
        "desc": "Map how the database executor sorts data by PARTITION and ORDER keys and streams rows through WindowAgg."
      },
      {
        "id": "db-m1-d26-q2",
        "name": "Detective Lab: Profiling WindowAgg Execution Plans & Buffer Usage with EXPLAIN",
        "type": "detective",
        "desc": "Benchmark WindowAgg memory footprint between RANGE and ROWS specifications across 1M rows."
      },
      {
        "id": "db-m1-d26-q3",
        "name": "Mastery Assignment: In-Memory Window Function Evaluator in TypeScript",
        "type": "assignment",
        "desc": "Build an analytical query evaluator supporting PARTITION BY, ORDER BY, ROW_NUMBER, and sliding SUM frames."
      },
      {
        "id": "db-m1-d26-q4",
        "name": "Production Incident Lab: Analytical Dashboard Out of Memory Query Crash Triage",
        "type": "detective",
        "desc": "Optimize a runaway analytics reporting query that was crashing database pods due to unbounded RANGE buffering."
      }
    ]
  },
  {
    "day": 27,
    "month": 1,
    "blockNum": 6,
    "title": "Recursive Common Table Expressions (CTEs): Hierarchical Trees, Graph Traversal & Cycle Detection",
    "stageName": "Stage 3: Autonomous Synthesis",
    "stageNum": 3,
    "pedagogicalRole": "Low Guidance (Graph Algorithms & Recursive Relational Queries)",
    "spokenGoal": "Implement graph and tree traversals directly inside declarative SQL: master Recursive CTEs (WITH RECURSIVE), deconstruct the Anchor Member and Recursive Member execution loop, traverse organizational hierarchies and bill-of-materials graphs, and prevent infinite loops using array path cycle detection.",
    "conceptInvariant": "Recursive CTE Evaluation Invariant: The database initializes an intermediate Work Table with rows from the Anchor Member. In each iteration, it evaluates the Recursive Member against the current Work Table, populates a Next Work Table, appends results to the final result set, and terminates when the Work Table is empty.",
    "failureMode": "Writing a recursive CTE over a cyclic graph (e.g. A -> B -> C -> A) without a path tracking array or cycle detection clause: the query runs infinitely, allocating gigabytes of memory until the server terminates with Out Of Memory.",
    "tryItFriction": "Build a recursive CTE query that traverses a multi-level organizational chart, computes organizational depth, aggregates department budgets, and aborts upon detecting circular management links.",
    "socraticHints": [
      "How do you prevent infinite recursion in a cyclic graph using standard SQL?",
      "Maintain an array of visited node IDs in the CTE (e.g. ARRAY[id]) and add WHERE NOT id = ANY(path) in the recursive step!",
      "PostgreSQL 14+ also supports the standardized CYCLE clause: CYCLE id SET is_cycle USING path."
    ],
    "situationalPuzzle": {
      "scenario": "An e-commerce category hierarchy query crashes with 'ERROR: out of memory' after a user creates a category where Parent Category references a child category. How should the SQL engineer harden the recursive CTE?",
      "options": [
        "Delete all categories.",
        "Cycle Prevention with Visited Path Arrays: Add `path = ARRAY[category_id]` in the anchor member, append `path || child.category_id` in the recursive member, and add `WHERE NOT child.category_id = ANY(path)` to prune cycles immediately.",
        "Increase server swap memory.",
        "Disable foreign keys."
      ],
      "answerIdx": 1,
      "debrief": "Without cycle protection, recursive CTEs traverse cyclic graphs forever. Maintaining a visited path array and terminating when a node has already been visited ensures deterministic termination."
    },
    "quests": [
      {
        "id": "db-m1-d27-q1",
        "name": "Recursive CTE Execution Semantics: Anchor, Recursive Member & Work Tables",
        "type": "concept",
        "desc": "Trace the step-by-step state machine of the PostgreSQL RecursiveUnion executor operator."
      },
      {
        "id": "db-m1-d27-q2",
        "name": "Detective Lab: Profiling Recursive CTE Depth Limits & Memory Footprints",
        "type": "detective",
        "desc": "Benchmark graph traversals across deep hierarchical trees and verify execution cost profiles."
      },
      {
        "id": "db-m1-d27-q3",
        "name": "Mastery Assignment: TypeScript Recursive CTE & Graph Traversal Engine",
        "type": "assignment",
        "desc": "Build a relational graph traversal engine executing recursive queries with cycle detection."
      },
      {
        "id": "db-m1-d27-q4",
        "name": "Production Incident Lab: Infinite Loop Recursive CTE Category Crash Outage",
        "type": "detective",
        "desc": "Emergency triage and hotfix for a production database crash caused by circular category hierarchies."
      }
    ]
  },
  {
    "day": 28,
    "month": 1,
    "blockNum": 6,
    "title": "Database Connection Architecture: Process-Per-Connection vs Threading, PgBouncer & HikariCP",
    "stageName": "Stage 3: Autonomous Synthesis",
    "stageNum": 3,
    "pedagogicalRole": "Low Guidance (Connection Pool Topologies & Resource Sizing)",
    "spokenGoal": "Analyze database connection mechanics: compare PostgreSQL's process-per-connection model (forking backend processes, 10MB memory overhead per connection) vs threaded models (MySQL), explore the catastrophic performance cliff of 1,000+ unpooled connections, and architect multi-tier connection pooling using PgBouncer (Session vs Transaction pooling) and Java's HikariCP.",
    "conceptInvariant": "Little's Law Connection Pool Sizing Invariant: Optimal connection pool size is governed by hardware concurrency: Pool Size = 2 \u00d7 CPU_Cores + Disk_Spindles. Allocating hundreds of connections to a 16-core database causes severe context switching, lock contention, and cache thrashing, degrading throughput by 80%.",
    "failureMode": "Spinning up 200 Kubernetes microservice pods, each configured with a default database connection pool of 50 connections: 10,000 connections hit PostgreSQL simultaneously, consuming 100 GB of RAM in process overhead and crashing the database with OOM Killer.",
    "tryItFriction": "Calculate optimal connection pool sizing for a 32-core database serving 50 microservices and simulate transaction pooling throughput in TypeScript comparing direct connections vs pooled connections.",
    "socraticHints": [
      "Why is PgBouncer Transaction Pooling dangerous for applications using PREPARED statements or SET timezone?",
      "Because in Transaction Pooling, different queries within the same client session may execute on different backend server connections, losing session-level state!",
      "Use PgBouncer 1.21+ with named prepared statement support or configure application pools carefully."
    ],
    "situationalPuzzle": {
      "scenario": "A 16-core PostgreSQL database is running at 98% CPU during high traffic. max_connections is set to 2,000, and 1,800 active connections are connected. Transaction throughput is only 1,200 TPS. An SRE places PgBouncer in front with pool_size = 32. What happens to CPU and throughput?",
      "options": [
        "Throughput drops to zero.",
        "CPU Drops & Throughput Multiplies: Reducing active database backend processes from 1,800 to 32 eliminates massive OS context switching, spinlock contention, and memory thrashing. CPU drops to a healthy 65% while throughput surges from 1,200 TPS to 12,000 TPS.",
        "PgBouncer runs out of memory.",
        "PostgreSQL crashes."
      ],
      "answerIdx": 1,
      "debrief": "Databases perform best when active concurrency matches physical hardware cores. Oversubscribing connections wastes CPU cycles on context switching and lock contention. Pooling throttles concurrency to optimal hardware limits, multiplying throughput."
    },
    "quests": [
      {
        "id": "db-m1-d28-q1",
        "name": "Process-Per-Connection vs Threaded Concurrency: Memory & IPC Cost Models",
        "type": "concept",
        "desc": "Compare memory overhead, context-switch penalties, and cache locality across database concurrency models."
      },
      {
        "id": "db-m1-d28-q2",
        "name": "Detective Lab: Profiling PostgreSQL Connection Churn & pg_stat_activity Overhead",
        "type": "detective",
        "desc": "Measure the latency cost of establishing raw TCP/TLS database connections versus borrowing pooled connections."
      },
      {
        "id": "db-m1-d28-q3",
        "name": "Mastery Assignment: Multi-Tier Connection Pool Simulator in TypeScript",
        "type": "assignment",
        "desc": "Implement a high-performance connection pool with acquisition timeouts, leak detection, and transaction pooling."
      },
      {
        "id": "db-m1-d28-q4",
        "name": "Production Incident Lab: Black Friday 5,000-Connection Thundering Herd Crash Triage",
        "type": "detective",
        "desc": "Mitigate a severe database crash caused by autoscaling application pods overwhelming PostgreSQL connection limits."
      }
    ]
  },
  {
    "day": 29,
    "month": 1,
    "blockNum": 6,
    "title": "Zero-Downtime Database Migrations: Expand-Contract (Parallel Run) Pattern, Shadow Tables & Backfills",
    "stageName": "Stage 3: Autonomous Synthesis",
    "stageNum": 3,
    "pedagogicalRole": "Low Guidance (Schema Evolution & Backward Compatibility)",
    "spokenGoal": "Architect continuous delivery for relational databases: master the Expand-Contract (Parallel Run) migration pattern, rename and split columns without downtime, handle asynchronous batch backfills without locking tables, and implement dual-writing application pipelines with verification checksums.",
    "conceptInvariant": "Backward-Compatible Schema Invariant: At any point during a deployment, both Version N (old application code) and Version N+1 (new application code) must be able to read and write to the database simultaneously without errors. Destructive schema changes (dropping columns, changing constraints) must occur only after Version N code is completely decommissioned.",
    "failureMode": "Renaming a column in a single migration script (ALTER TABLE users RENAME COLUMN email TO user_email): running application pods immediately throw 500 errors on every query because they still reference the old column name email.",
    "tryItFriction": "Construct a 4-phase zero-downtime migration pipeline in TypeScript that migrates a full_name column into first_name and last_name across 1,000,000 active records with zero downtime or lost writes.",
    "socraticHints": [
      "What are the 4 distinct phases of the Expand-Contract pattern?",
      "1) Expand (add new column alongside old), 2) Dual-Write (write to both columns), 3) Backfill (populate historical rows in batches), 4) Contract (switch reads to new column, stop writing to old, drop old column)!",
      "Never combine Expand and Contract in the same deployment."
    ],
    "situationalPuzzle": {
      "scenario": "A team needs to backfill a new column status on a 100,000,000-row table. An engineer writes: UPDATE orders SET status = 'PROCESSED' WHERE status IS NULL. When executed in production, replication lag surges to 3 hours, and client write queries time out. How should the backfill be architected?",
      "options": [
        "Run the update during lunch hour.",
        "Batched Incremental Backfilling: Break the backfill into small primary-key bounded batches (e.g. 5,000 rows per transaction: UPDATE orders SET status = 'PROCESSED' WHERE id BETWEEN 1 AND 5000) with a 50ms pause between batches, preventing massive WAL surges, lock escalation, and replication lag.",
        "Disable WAL logging.",
        "Convert the table to MongoDB."
      ],
      "answerIdx": 1,
      "debrief": "A single massive UPDATE locks millions of rows, generates gigabytes of WAL logs instantly, and causes severe replication lag. Chunking backfills into small transactional batches bounded by primary keys preserves production stability."
    },
    "quests": [
      {
        "id": "db-m1-d29-q1",
        "name": "The Expand-Contract Migration Architecture & Zero-Downtime DDL Rules",
        "type": "concept",
        "desc": "Define the formal rules for column additions, renames, type changes, and foreign key additions without locks."
      },
      {
        "id": "db-m1-d29-q2",
        "name": "Detective Lab: Auditing Lock Types of Common DDL Operations in PostgreSQL",
        "type": "detective",
        "desc": "Analyze locks acquired by CREATE INDEX CONCURRENTLY, ADD COLUMN, and VALIDATE CONSTRAINT."
      },
      {
        "id": "db-m1-d29-q3",
        "name": "Mastery Assignment: Automated Expand-Contract Migration Pipeline in TypeScript",
        "type": "assignment",
        "desc": "Build a migration orchestrator that executes multi-phase schema transitions with validation checks."
      },
      {
        "id": "db-m1-d29-q4",
        "name": "Production Incident Lab: Breaking Column Rename Production Outage Rollback & Recovery",
        "type": "detective",
        "desc": "Execute emergency mitigation after an un-phased column drop breaks live production API traffic."
      }
    ]
  },
  {
    "day": 30,
    "month": 1,
    "blockNum": 6,
    "title": "\ud83c\udfc6 CAPSTONE 1 / GATEWAY: DataCore \u2014 Enterprise Relational Database Engine with MVCC, CBO & B+ Tree",
    "stageName": "Stage 4: Crucible & Viva",
    "stageNum": 4,
    "pedagogicalRole": "Open Challenge (Month 1 Gateway Viva Gate)",
    "spokenGoal": "Defend Month 1 Gateway: Deliver and defend 'DataCore', a complete, self-contained relational database engine in TypeScript. Integrate slotted page storage, Clock Sweep buffer pool, composite B+ Tree indexing, AST SQL parsing, Cost-Based Optimization, Grace Hash Joins, and MVCC Snapshot Isolation with ACID crash durability.",
    "conceptInvariant": "End-to-End Relational Correctness Invariant: DataCore must guarantee physical data independence, transactional atomicity, snapshot isolation consistency, logarithmic index search complexity, and cost-optimal query execution plans across all ACID workloads.",
    "failureMode": "Failing the rigorous Gateway Viva test harness: submitting an engine where concurrent transactions experience lost updates or where B+ tree node splits corrupt index lookups during high-volume inserts.",
    "tryItFriction": "Pass the DataCore comprehensive test battery: execute 50,000 transactional queries across 20 concurrent clients, verify 100% ACID consistency, and defend design trade-offs in a rigorous architectural viva session.",
    "socraticHints": [
      "What is the single most critical architectural boundary in DataCore?",
      "The contract between the Buffer Pool Manager and the Slotted Page Storage Engine: ensuring pages are pinned before use and dirty pages are logged to WAL before eviction!",
      "Mastery of this contract guarantees both performance and crash resilience."
    ],
    "situationalPuzzle": {
      "scenario": "During your DataCore Gateway Viva defense, the senior architect injects a simulated power failure immediately after a transaction commits in WAL, but before dirty pages are flushed to disk. Upon restart, your engine fails to restore the committed transaction. What component of your recovery manager failed?",
      "options": [
        "The CPU crashed.",
        "ARIES Redo Phase Failure: The recovery manager assumed that unwritten dirty pages were lost forever. In a correct ARIES implementation, the Redo phase scans the WAL from the last checkpoint forward and replays all committed operations onto in-memory pages, ensuring 100% durability even if pages were not yet written to disk.",
        "The B+ tree was missing.",
        "TypeScript does not support transactions."
      ],
      "answerIdx": 1,
      "debrief": "Durability does not require data pages to be flushed at commit; it strictly requires WAL records to be flushed. The recovery engine must replay WAL records during restart to reconstruct all committed updates."
    },
    "quests": [
      {
        "id": "db-m1-d30-q1",
        "name": "DataCore Master Architectural Blueprint & Invariant Specification",
        "type": "concept",
        "desc": "Document the end-to-end design: BufferPool, SlottedPage, B+Tree, CBO, and MVCC Engine."
      },
      {
        "id": "db-m1-d30-q2",
        "name": "Detective Lab: Auditing DataCore ACID Compliance & Crash Resilience under Fault Injection",
        "type": "detective",
        "desc": "Run automated chaos tests injecting random crashes and verifying transactional state recovery."
      },
      {
        "id": "db-m1-d30-q3",
        "name": "Mastery Assignment: DataCore Enterprise Relational Engine Complete Implementation",
        "type": "assignment",
        "desc": "Assemble and deliver the complete DataCore TypeScript database engine passing all 30-day specifications."
      },
      {
        "id": "db-m1-d30-q4",
        "name": "Gateway Viva: Defending DataCore Concurrency & Storage Architecture before Senior Panel",
        "type": "detective",
        "desc": "Defend architectural design decisions, isolation models, and recovery protocols in a master viva examination."
      }
    ]
  }
];

export const DATABASE_MONTH_2_SPECS: MasterclassDaySpec[] = [
  {
    "day": 31,
    "month": 2,
    "blockNum": 7,
    "title": "Write-Optimized Storage: LSM-Tree Architecture (MemTable, WAL, Immutable MemTable & SSTable Flush)",
    "stageName": "Stage 1: Mental Model Grounding",
    "stageNum": 1,
    "pedagogicalRole": "High Guidance (Write-Optimized Storage Foundations)",
    "spokenGoal": "Shift paradigms from update-in-place B+ Trees to write-optimized storage: explore the Log-Structured Merge-Tree (LSM-Tree) architecture popularized by Bigtable, LevelDB, and RocksDB. Analyze how incoming writes append to an in-memory sorted MemTable (SkipList/Red-Black Tree) and a sequential WAL, freeze into an Immutable MemTable, and flush sequentially to disk as an immutable Sorted String Table (SSTable).",
    "conceptInvariant": "LSM Sequential Append Invariant: An LSM-tree turns random disk writes into high-speed sequential writes. Mutations (inserts, updates, deletes as tombstones) are never applied in-place on existing disk files; they append to the in-memory MemTable and are persisted as immutable, sorted disk runs (SSTables).",
    "failureMode": "Designing a high-throughput write pipeline using an in-place B+ Tree on SSDs: random 8KB page writes trigger flash memory write amplification and frequent SSD block erase cycles, causing write throughput to collapse from 100,000 ops/sec to 3,000 ops/sec.",
    "tryItFriction": "Build an in-memory MemTable and write-ahead logger in TypeScript using a SkipList, demonstrating O(log N) sorted insertion and flushing to an immutable SSTable format upon reaching a 4MB size threshold.",
    "socraticHints": [
      "How do deletes work in an append-only LSM-Tree without updating existing SSTable files on disk?",
      "By inserting a Tombstone record (a marker indicating the key is deleted) into the MemTable!",
      "The tombstone shadows older versions of the key during reads and permanently removes them during compaction."
    ],
    "situationalPuzzle": {
      "scenario": "A financial telemetry service ingests 500,000 metrics per second. The engineering team notices that while write operations are sub-millisecond, checking whether an individual metric exists occasionally takes 45ms and reads 15 separate files from disk. Why does an LSM tree have slower point reads than a B+ Tree?",
      "options": [
        "The server CPU has thermal throttling.",
        "Multi-File Read Amplification: Unlike a B+ Tree where a key lives at a single deterministic page location, in an un-compacted LSM tree a key might reside in the active MemTable or across any of the 15 immutable SSTable files on disk, forcing the engine to search multiple files sequentially unless Bloom filters are used.",
        "The SSD cable is faulty.",
        "LSM trees cannot store metrics."
      ],
      "answerIdx": 1,
      "debrief": "LSM trees trade point read latency for extreme write throughput. A point read must check the MemTable, Immutable MemTable, and potentially multiple SSTable levels (Read Amplification) until the key or a tombstone is found."
    },
    "quests": [
      {
        "id": "db-m2-d31-q1",
        "name": "LSM-Tree Foundations: B+ Tree vs LSM-Tree Write Amplification Trade-offs",
        "type": "concept",
        "desc": "Formalize write amplification factor (WAF), random I/O vs sequential append, and hardware flash memory physics."
      },
      {
        "id": "db-m2-d31-q2",
        "name": "Detective Lab: Profiling RocksDB Flush Stalls & MemTable Sizing with LOG Telemetry",
        "type": "detective",
        "desc": "Analyze RocksDB engine logs to identify write stalls caused by lagging MemTable flush threads."
      },
      {
        "id": "db-m2-d31-q3",
        "name": "Mastery Assignment: TypeScript In-Memory MemTable with SkipList & Concurrent Flush",
        "type": "assignment",
        "desc": "Implement a high-concurrency SkipList MemTable that transitions to an Immutable MemTable and flushes to disk."
      },
      {
        "id": "db-m2-d31-q4",
        "name": "Production Incident Lab: Unbounded MemTable Growth Memory Exhaustion Outage Triage",
        "type": "detective",
        "desc": "Resolve a high-severity production outage caused by unconstrained MemTable allocations exhausting server RAM."
      }
    ]
  },
  {
    "day": 32,
    "month": 2,
    "blockNum": 7,
    "title": "SSTable File Format: Data Blocks, Index Blocks, Block Builder & Binary Search inside Blocks",
    "stageName": "Stage 1: Mental Model Grounding",
    "stageNum": 1,
    "pedagogicalRole": "High Guidance (Binary Storage Layout & On-Disk Formats)",
    "spokenGoal": "Dissect the physical binary structure of a Sorted String Table (SSTable): examine fixed-size Data Blocks (typically 4KB), Delta Key Encoding, Restart Points for binary search, Footer Metadata, and the Index Block that maps block boundary keys to 64-bit byte offsets on disk.",
    "conceptInvariant": "SSTable Two-Tier Search Invariant: Because keys in an SSTable are sorted globally, point search requires strictly two steps: 1) Binary search across the in-memory Index Block to locate the single candidate 4KB Data Block, and 2) Binary search across the Data Block's Restart Points to locate the exact key, guaranteeing O(log N) search without loading the entire file into memory.",
    "failureMode": "Designing an SSTable reader that deserializes the entire 64MB file into JSON/memory on every query: reading 1,000 files causes massive GC pauses, 100% CPU exhaustion, and out-of-memory crashes.",
    "tryItFriction": "Construct a binary SSTable serializer and reader in TypeScript: serialize 10,000 sorted key-value pairs into 4KB data blocks with delta encoding, append a footer and index block, and perform point lookups using binary search.",
    "socraticHints": [
      "What is Delta Key Encoding in SSTable data blocks?",
      "Storing only the suffix difference between consecutive sorted keys (e.g. 'user_1001' followed by 'user_1002' stores prefix_len=8, suffix='2')!",
      "Restart points are inserted every K keys (e.g. 16) where full keys are stored, enabling binary search within the compressed block."
    ],
    "situationalPuzzle": {
      "scenario": "An engineer implements an SSTable format where keys are compressed using standard Gzip across the entire 64MB file. While file size drops by 70%, point lookup latency explodes from 0.1ms to 85ms. Why did whole-file compression ruin point lookup speed?",
      "options": [
        "The CPU cannot decompress Gzip.",
        "Block-Level vs Whole-File Decompression: In a production SSTable (RocksDB/LevelDB), compression is applied to individual 4KB Data Blocks independently. Whole-file compression forces the engine to decompress the entire 64MB file from beginning to end just to read a single 32-byte key.",
        "Gzip corrupts binary integers.",
        "The file was missing an extension."
      ],
      "answerIdx": 1,
      "debrief": "SSTables require independent block compression (e.g. LZ4/Snappy per 4KB data block). The Index Block allows seeking directly to the compressed block offset, decompressing only 4KB instead of the whole file."
    },
    "quests": [
      {
        "id": "db-m2-d32-q1",
        "name": "SSTable Binary Specification: BlockBuilder, Restart Points & Footer Layout",
        "type": "concept",
        "desc": "Design the byte-level specification for data blocks, filter blocks, index blocks, and table footers."
      },
      {
        "id": "db-m2-d32-q2",
        "name": "Detective Lab: Parsing Real RocksDB SSTable Files with sst_dump",
        "type": "detective",
        "desc": "Use sst_dump tool to inspect block boundaries, index handles, and restart arrays in live RocksDB SSTables."
      },
      {
        "id": "db-m2-d32-q3",
        "name": "Mastery Assignment: TypeScript SSTable Serializer, Indexer & Binary Search Reader",
        "type": "assignment",
        "desc": "Build an SSTable writer and reader supporting variable data blocks, delta encoding, and index seeking."
      },
      {
        "id": "db-m2-d32-q4",
        "name": "Production Incident Lab: Corrupted SSTable Block Checksum Crash Forensic Triage",
        "type": "detective",
        "desc": "Triage and recover data from an SSTable file with corrupted data block CRC32 checksums."
      }
    ]
  },
  {
    "day": 33,
    "month": 2,
    "blockNum": 7,
    "title": "Compaction Strategies: Size-Tiered vs Leveled Compaction (RocksDB), Space vs Write Amplification",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Compaction Dynamics & Amplification Trade-offs)",
    "spokenGoal": "Master the maintenance engine of LSM trees: compare Size-Tiered Compaction (STCS - Cassandra style, optimized for write throughput) versus Leveled Compaction (LCS - RocksDB style, optimized for read performance and space minimization). Analyze Space Amplification, Write Amplification, and how background compaction threads purge obsolete versions and tombstones.",
    "conceptInvariant": "Leveled Compaction Non-Overlapping Invariant: In Leveled Compaction, Level 0 contains overlapping SSTables flushed directly from MemTables. For every subsequent level (L1, L2, ..., LN), all SSTables within the same level have strictly non-overlapping key ranges. A key can exist in at most ONE SSTable per level.",
    "failureMode": "Choosing Size-Tiered Compaction on a database with 80% disk utilization: STCS requires 50% free disk space to compact large tier files, causing disk exhaustion and complete database write halts during major compaction runs.",
    "tryItFriction": "Build a Leveled Compaction simulator in TypeScript: take overlapping SSTables in Level 0, merge-sort them with Level 1 SSTables, prune shadowed keys and expired tombstones, and generate non-overlapping Level 1 output SSTables.",
    "socraticHints": [
      "Why is Write Amplification higher in Leveled Compaction than in Size-Tiered Compaction?",
      "Because every key is rewritten multiple times as it is pushed down from L0 through L1, L2, to LN, multiplying write I/O by 10x to 30x!",
      "However, Leveled Compaction restricts Space Amplification to ~1.1x and guarantees fast reads."
    ],
    "situationalPuzzle": {
      "scenario": "A 10 TB Cassandra cluster using Size-Tiered Compaction experiences sudden disk full crashes even though active data is only 5 TB. An SRE notices that a 2.5 TB compaction job started right before the crash. What caused this space crisis?",
      "options": [
        "Cassandra has a memory leak.",
        "Size-Tiered Compaction Space Overhead: STCS merges SSTables of similar sizes by reading 4 existing files and writing a brand new merged file. During compaction, the old files cannot be deleted until the new file is fully written and verified, requiring up to 100% temporary free disk headroom equal to the size of the data being compacted.",
        "The disk sectors were corrupted.",
        "Tombstones multiply file sizes by 10x."
      ],
      "answerIdx": 1,
      "debrief": "Size-Tiered Compaction requires up to 50% temporary disk headroom because old files must remain on disk until the new consolidated file is finalized. Leveled Compaction operates on small ~64MB chunks, keeping temporary space overhead under 10%."
    },
    "quests": [
      {
        "id": "db-m2-d33-q1",
        "name": "Compaction Theory: Size-Tiered vs Leveled vs FIFO Compaction Matrix",
        "type": "concept",
        "desc": "Formalize formulas for Write Amplification (WA), Read Amplification (RA), and Space Amplification (SA)."
      },
      {
        "id": "db-m2-d33-q2",
        "name": "Detective Lab: Profiling RocksDB Compaction Latency & Write Stalls with Prometheus",
        "type": "detective",
        "desc": "Monitor compaction backlog metrics (compaction_pending, write_delay) under heavy ingest workloads."
      },
      {
        "id": "db-m2-d33-q3",
        "name": "Mastery Assignment: TypeScript Multi-Level LSM Compaction Engine",
        "type": "assignment",
        "desc": "Implement an automated compaction orchestrator that triggers L0 -> L1 merges, removes tombstones, and splits files."
      },
      {
        "id": "db-m2-d33-q4",
        "name": "Production Incident Lab: 3 AM Compaction Write Stall & Tail Latency Explosion Triage",
        "type": "detective",
        "desc": "Resolve a production write stall caused by compaction thread starvation under high write volume."
      }
    ]
  },
  {
    "day": 34,
    "month": 2,
    "blockNum": 7,
    "title": "Read Acceleration in LSM Trees: Bloom Filters, Block Caches & Amplification Metrics (WA, RA, SA)",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Probabilistic Data Structures & Cache Acceleration)",
    "spokenGoal": "Eliminate the LSM read penalty: master Bloom Filters (probabilistic set membership using k independent hash functions), calculate false positive probability math $p \\approx (1 - e^{-kn/m})^k$, embed Bloom filters directly into SSTable metadata to prune 99% of negative disk reads, and architect multi-tier LRU Block Caches.",
    "conceptInvariant": "Bloom Filter Zero False-Negative Invariant: A Bloom filter never produces false negatives. If the filter returns false, the key is guaranteed NOT to exist in the SSTable, allowing the read path to skip disk I/O completely. If it returns true, the key MIGHT exist (requiring disk block verification).",
    "failureMode": "Disabling Bloom filters on an LSM-tree database: point lookups for non-existent keys (e.g. checking user session validity) must read every single SSTable across all levels from disk, turning a 0.2ms query into a 60ms disk thrashing nightmare.",
    "tryItFriction": "Implement an optimal Bloom filter in TypeScript using Murmur3 hashing, tune bits-per-key to achieve a 1% false positive rate (10 bits per key), and measure read query throughput across 100 SSTable files.",
    "socraticHints": [
      "Why is a 1% false positive rate Bloom filter considered optimal in database engineering?",
      "Because 10 bits per key requires only 1.25 bytes per entry in RAM while eliminating 99 out of 100 unnecessary disk reads!",
      "Diminishing returns: halving false positives to 0.1% requires doubling memory to 20 bits per key."
    ],
    "situationalPuzzle": {
      "scenario": "A cache-aside architecture queries an LSM database on cache misses: `db.get(non_existent_key)`. Profiling shows that 90% of requests are for non-existent keys, and disk I/O is pinned at 100%. SRE enables 10-bit Bloom filters on all SSTables. What is the immediate impact on disk I/O?",
      "options": [
        "Disk I/O increases due to filter computation.",
        "99% Disk I/O Elimination: The Bloom filters immediately evaluate in memory that the keys do not exist in the SSTables, returning `null` without touching physical disk. Disk seeks drop by 99%, and query latency plummets from 40ms to 0.05ms.",
        "The database runs out of disk space.",
        "Bloom filters corrupt existing data."
      ],
      "answerIdx": 1,
      "debrief": "Bloom filters are the critical read accelerator in LSM trees. For non-existent keys (the worst-case LSM read scenario), Bloom filters evaluate in RAM and skip disk reads entirely, eliminating negative read amplification."
    },
    "quests": [
      {
        "id": "db-m2-d34-q1",
        "name": "Bloom Filter Mathematics & Optimal Bit-Allocation Formula",
        "type": "concept",
        "desc": "Derive optimal hash count k = (m/n) * ln(2) and false positive rate equations for database storage."
      },
      {
        "id": "db-m2-d34-q2",
        "name": "Detective Lab: Profiling Filter Hits vs False Positives with RocksDB Statistics",
        "type": "detective",
        "desc": "Measure rocksdb.bloom.filter.useful vs rocksdb.bloom.filter.full.positive counters in production."
      },
      {
        "id": "db-m2-d34-q3",
        "name": "Mastery Assignment: TypeScript Bloom Filter Block Builder & Multi-SSTable Reader",
        "type": "assignment",
        "desc": "Implement a high-speed Murmur3 Bloom filter and integrate it into SSTable generation and lookup."
      },
      {
        "id": "db-m2-d34-q4",
        "name": "Production Incident Lab: Missing Bloom Filter Negative Read Latency Crisis",
        "type": "detective",
        "desc": "Resolve a severe API latency spike caused by a missing Bloom filter on an un-cached verification endpoint."
      }
    ]
  },
  {
    "day": 35,
    "month": 2,
    "blockNum": 7,
    "title": "\u2b50 MILESTONE 6: Production LSM-Tree Storage Engine with Leveled Compaction & Bloom Filters",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Milestone Gate: Complete LSM Engine)",
    "spokenGoal": "Assemble Milestone 6: Build a fully functional, production-grade LSM-Tree Key-Value storage engine in TypeScript. Integrate SkipList MemTable, WAL durability logging, immutable SSTable binary encoding with 4KB data blocks, in-memory Index Blocks, 10-bit Bloom Filters, and background Leveled Compaction.",
    "conceptInvariant": "LSM Engine Correctness Invariant: The storage engine must support concurrent Put, Get, Delete, and Range Scan operations. It must maintain strict linearizability, ensure deleted keys (tombstones) shadow older versions across all levels, and guarantee zero data loss across simulated crashes.",
    "failureMode": "Failing to handle tombstone propagation during compaction: if a tombstone in Level 1 is deleted before it reaches older versions in Level 2, the resurrected old version reappears, causing phantom deleted records to return to clients.",
    "tryItFriction": "Pass the Milestone 6 test harness: write 100,000 keys with 20% updates and 10% deletes, trigger background compaction across 3 levels, verify 99% Bloom filter pruning efficiency, and recover state after sudden process kill.",
    "socraticHints": [
      "When can a Tombstone safely be completely purged from an LSM tree?",
      "Only when the tombstone reaches the bottom-most level (LN) of the database, where no older versions of that key can possibly exist below it!",
      "Purging a tombstone prematurely causes deleted data to be resurrected from lower levels."
    ],
    "situationalPuzzle": {
      "scenario": "During validation of your Milestone 6 engine, you delete key 'user_42'. The key disappears. An hour later, after a background compaction run finishes, `get('user_42')` suddenly returns the old value from 2 days ago! What compaction bug occurred?",
      "options": [
        "The computer time-traveled.",
        "Tombstone Premature Garbage Collection: The compaction thread compacted Level 1 to Level 2 and dropped the tombstone because it thought the key was gone from Level 1, without checking if an older version of 'user_42' still existed in Level 3. Once the tombstone was gone, the ancient Level 3 version became visible again.",
        "The Bloom filter had a false negative.",
        "The SSD reversed the write operation."
      ],
      "answerIdx": 1,
      "debrief": "Tombstone resurrection is a classic LSM compaction defect. A tombstone must never be dropped until compaction merges it against the oldest possible level containing that key, or until it reaches the maximum tree level."
    },
    "quests": [
      {
        "id": "db-m2-d35-q1",
        "name": "Milestone 6 Architecture: LSM-Tree Master Blueprint & Threading Model",
        "type": "concept",
        "desc": "Design the end-to-end component interfaces: MemTable, WAL, SSTable, CompactionWorker, and BlockCache."
      },
      {
        "id": "db-m2-d35-q2",
        "name": "Detective Lab: Benchmarking Write Throughput & Latency Distribution under High Load",
        "type": "detective",
        "desc": "Profile P50, P95, and P99 write latencies during background compaction cycles to verify zero write stalls."
      },
      {
        "id": "db-m2-d35-q3",
        "name": "Mastery Assignment: Full TypeScript LSM-Tree Storage Engine with Leveled Compaction",
        "type": "assignment",
        "desc": "Build the complete Milestone 6 engine supporting Put, Get, Delete, RangeScan, Bloom filters, and compaction."
      },
      {
        "id": "db-m2-d35-q4",
        "name": "Production Incident Lab: Tombstone Resurrection Phantom Data Customer Incident Triage",
        "type": "detective",
        "desc": "Triage and fix a GDPR violation incident where previously deleted user data reappeared after a compaction cycle."
      }
    ]
  },
  {
    "day": 36,
    "month": 2,
    "blockNum": 8,
    "title": "Database Replication Mechanics: Physical Streaming Replication (WAL Sender/Receiver) vs Logical Replication",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Replication Mechanics & Stream Topologies)",
    "spokenGoal": "Analyze database distribution foundations: compare Physical Streaming Replication (byte-for-byte WAL record streaming via walsender/walreceiver) versus Logical Replication (decoding WAL into logical row change events via pgoutput / CDC). Examine replication slots, catalog constraints, and cross-version migration architectures.",
    "conceptInvariant": "Physical vs Logical Decoupling Invariant: Physical replication mirrors exact 8KB disk page byte modifications (requiring identical OS architecture, PostgreSQL major version, and schema). Logical replication streams relational tuple events (INSERT, UPDATE, DELETE), enabling replication between different database versions, partial table replication, and event streaming into Kafka.",
    "failureMode": "Creating an unmonitored replication slot on a primary database: the replica goes offline for 2 weeks. Because the replication slot holds WAL records to prevent data loss, the primary refuses to delete WAL segments, exhausting 500 GB of disk space and crashing the primary.",
    "tryItFriction": "Construct a TypeScript WAL streaming replication harness: simulate a Primary node streaming WAL records over TCP to a Replica node, applying changes to the replica's buffer pool and handling network disconnect reconnects.",
    "socraticHints": [
      "Why does an unmonitored replication slot crash the primary database if a replica disconnects?",
      "Because the primary is strictly contracted not to recycle WAL logs until all replication slots confirm receipt!",
      "Configure `max_slot_wal_keep_size` in PostgreSQL 13+ to invalidate disconnected slots before disk fills."
    ],
    "situationalPuzzle": {
      "scenario": "A company wants to replicate data from PostgreSQL 12 to PostgreSQL 16 with zero downtime. An engineer attempts to configure Physical Streaming Replication, but the replica immediately fails to start with: 'database cluster identifier mismatch'. What replication architecture must be used instead?",
      "options": [
        "Re-install PostgreSQL.",
        "Logical Replication: Physical streaming replication requires identical database versions and on-disk binary layouts. Logical replication (Publication / Subscription) operates at the relational tuple level, allowing seamless data replication between different major versions with zero downtime.",
        "Take a pg_dump every 5 minutes.",
        "Disable WAL logging on both servers."
      ],
      "answerIdx": 1,
      "debrief": "Major version upgrades cannot use physical streaming replication because internal on-disk data structures change between major versions. Logical replication streams logical row events, enabling zero-downtime cross-version migrations."
    },
    "quests": [
      {
        "id": "db-m2-d36-q1",
        "name": "Physical vs Logical Replication Internals: WAL Sender, Decoder & Apply Worker",
        "type": "concept",
        "desc": "Deconstruct replication architecture, replication slots, and LSN acknowledgment handshakes."
      },
      {
        "id": "db-m2-d36-q2",
        "name": "Detective Lab: Monitoring Replication Slots with pg_replication_slots & WAL Retain Lag",
        "type": "detective",
        "desc": "Query active slots, restart_lsn, and wal_status to detect lagging or abandoned replication slots."
      },
      {
        "id": "db-m2-d36-q3",
        "name": "Mastery Assignment: TypeScript WAL Replication Streamer & CDC Parser",
        "type": "assignment",
        "desc": "Build a replication stream receiver that parses WAL binary records and applies row changes to secondary replicas."
      },
      {
        "id": "db-m2-d36-q4",
        "name": "Production Incident Lab: Abandoned Replication Slot Primary Disk Exhaustion Triage",
        "type": "detective",
        "desc": "Triage an emergency 100% disk utilization crash caused by an abandoned staging replication slot."
      }
    ]
  },
  {
    "day": 37,
    "month": 2,
    "blockNum": 8,
    "title": "Synchronous vs Asynchronous Replication: Replication Lag, Read Replicas & Read-Your-Own-Writes Consistency",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Consistency vs Latency Trade-offs)",
    "spokenGoal": "Navigate the consistency vs latency trade-off in distributed databases: evaluate Asynchronous Replication (high throughput, non-zero RPO/data loss risk) vs Synchronous Replication (zero RPO, commit latency tied to network RTT), diagnose replication lag, and implement application patterns to guarantee Read-Your-Own-Writes consistency.",
    "conceptInvariant": "Read-Your-Own-Writes Invariant: When an application writes data to the primary database and immediately redirects the user to read that data from an asynchronous read replica, the read will return stale data if replication lag > 0. Systems must route reads to the primary or verify replica LSN >= commit LSN before serving the user.",
    "failureMode": "Routing user profile updates to the primary database and immediately routing the subsequent profile page load to an asynchronous read replica with 500ms lag: users see their profile revert to old data immediately after saving, leading to panic bug reports.",
    "tryItFriction": "Build an LSN-aware database connection router in TypeScript: route writes to primary, capture the write's Commit LSN, and route subsequent reads to replicas only if replica Current LSN >= Commit LSN, falling back to primary otherwise.",
    "socraticHints": [
      "What is `synchronous_commit = remote_apply` in PostgreSQL?",
      "It guarantees that a transaction COMMIT will not return success to the client until the replica has not only received and flushed the WAL, but also physically APPLIED the changes to its data pages!",
      "It provides absolute zero-lag read replica consistency at the cost of higher client commit latency."
    ],
    "situationalPuzzle": {
      "scenario": "A user changes their password on an e-commerce platform. The write commits to the primary. Immediately, the client redirects to the login screen and attempts to log in. The login request hits an asynchronous read replica with 2 seconds of lag and fails with 'Invalid Password'. What architectural flaw caused this?",
      "options": [
        "The user mistyped the password.",
        "Asynchronous Replication Lag Read Inconsistency: The login endpoint queried a replica that had not yet replayed the password update WAL record. The system lacked Read-Your-Own-Writes protection (such as pinning critical authentication reads to the primary or checking replica LSN freshness).",
        "The primary database rejected the write.",
        "PostgreSQL cleared the session token."
      ],
      "answerIdx": 1,
      "debrief": "Reading from asynchronous replicas immediately following a write is susceptible to replication lag anomalies. Authentication, financial balance checks, and immediate post-write views must either read from the primary or enforce LSN-based replica wait."
    },
    "quests": [
      {
        "id": "db-m2-d37-q1",
        "name": "Replication Modes Matrix: Async vs Sync (on, remote_write, remote_apply)",
        "type": "concept",
        "desc": "Formalize commit latency, crash durability, and failover data loss bounds across synchronous_commit levels."
      },
      {
        "id": "db-m2-d37-q2",
        "name": "Detective Lab: Measuring Physical Replication Lag in Bytes & Time with pg_stat_replication",
        "type": "detective",
        "desc": "Calculate write_lag, flush_lag, and replay_lag using LSN differences on high-throughput clusters."
      },
      {
        "id": "db-m2-d37-q3",
        "name": "Mastery Assignment: LSN-Aware Read-Your-Own-Writes Dynamic Database Router in TypeScript",
        "type": "assignment",
        "desc": "Implement a smart database proxy that tracks user commit LSNs and routes reads to fresh replicas."
      },
      {
        "id": "db-m2-d37-q4",
        "name": "Production Incident Lab: Replication Lag Post-Checkout Phantom Order Outage Triage",
        "type": "detective",
        "desc": "Resolve a high-severity customer complaint wave where orders appeared missing immediately after checkout."
      }
    ]
  },
  {
    "day": 38,
    "month": 2,
    "blockNum": 8,
    "title": "High Availability & Split-Brain Fencing: Leader Election, Quorum, STONITH & Patroni Architecture",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (HA Cluster Architecture & Fencing)",
    "spokenGoal": "Conquer the most dangerous failure in distributed databases: Split-Brain (where network partitions cause two nodes to believe they are the legitimate primary, accepting conflicting writes). Analyze Distributed Consensus Stores (DCS - etcd/Consul), leader leases, Patroni architecture, and Shoot The Other Node In The Head (STONITH) fencing mechanisms.",
    "conceptInvariant": "Single-Writer Invariant & Quorum Fencing: At any instant in time, exactly ONE node in the cluster may accept write transactions. If a leader loses network contact with the distributed consensus store quorum, it must immediately self-fence (demote itself to read-only or terminate) before any new leader can be promoted.",
    "failureMode": "Configuring automatic failover with naive heartbeats: a transient network partition isolates the primary. The standby promotes itself and accepts writes; the old primary continues accepting writes. Reconnecting reveals irreconcilable divergent database timelines and massive data corruption.",
    "tryItFriction": "Construct a Patroni-style cluster leader lease manager in TypeScript: implement etcd-backed TTL leases, simulate network partitions, and verify that isolated leaders demote themselves before the lease expires.",
    "socraticHints": [
      "What is STONITH (Shoot The Other Node In The Head)?",
      "An automated fencing mechanism (e.g. IPMI/cloud API power cutoff) that physically shuts down a suspected dead leader before promoting a standby!",
      "It guarantees beyond all doubt that the old leader cannot write to storage or corrupt the cluster."
    ],
    "situationalPuzzle": {
      "scenario": "A 2-node database cluster uses a simple ping check between Node A and Node B. Node A is primary. A switch fails, severing communication between A and B, but both can still talk to client applications. Node B detects no ping from A and promotes itself to primary. Clients write orders to both A and B. What catastrophe occurred?",
      "options": [
        "Load balancing improved.",
        "Split-Brain with Divergent Timelines: Without a 3rd quorum witness or consensus store, both nodes declared themselves primary. They accepted conflicting writes on the same table. Rejoining the nodes requires manual data archaeology because the WAL timelines have irreversibly forked.",
        "The cluster switched to read-only.",
        "PostgreSQL automatically merged the rows."
      ],
      "answerIdx": 1,
      "debrief": "Two-node clusters cannot safely perform automatic failover without a third-party quorum witness (odd number of voters). Without quorum, network partitions cause split-brain, creating divergent timelines and data loss."
    },
    "quests": [
      {
        "id": "db-m2-d38-q1",
        "name": "High Availability Topologies: Patroni, etcd DCS Leases & Raft-Driven Failover",
        "type": "concept",
        "desc": "Map Patroni state machines, DCS key TTLs, timeline switches (pg_control), and failover hooks."
      },
      {
        "id": "db-m2-d38-q2",
        "name": "Detective Lab: Auditing PostgreSQL Timeline Switches & History Files after Failover",
        "type": "detective",
        "desc": "Inspect 00000002.history files and trace how pg_rewind reconciles divergent WAL timelines."
      },
      {
        "id": "db-m2-d38-q3",
        "name": "Mastery Assignment: TypeScript Patroni-Style Cluster HA Orchestrator & Fencer",
        "type": "assignment",
        "desc": "Build an HA cluster controller with etcd lease renewals, heartbeat health checks, and automated fencing."
      },
      {
        "id": "db-m2-d38-q4",
        "name": "Production Incident Lab: Split-Brain Divergent Timeline Forensic Triage & pg_rewind Rescue",
        "type": "detective",
        "desc": "Recover a production database after an improper manual failover created dual primaries with conflicting writes."
      }
    ]
  },
  {
    "day": 39,
    "month": 2,
    "blockNum": 8,
    "title": "Distributed Consensus Protocol: Raft State Machine (Leader Election, Log Matching & Safety Invariants)",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Consensus Protocols & State Machine Replication)",
    "spokenGoal": "Master the mathematical foundation of modern distributed storage: explore Ongaro and Ousterhout's Raft consensus protocol. Dissect Leader Election (Term numbers, Randomized Election Timeouts, RequestVote RPC), Log Replication (AppendEntries RPC, Log Matching Invariant), and the formal Raft Safety properties that guarantee linearizable replicated state machines.",
    "conceptInvariant": "Raft Log Matching & Election Safety Invariant: 1) If two entries in different logs have the same index and term, they store the same command. 2) If two entries have the same index and term, their logs are identical in all preceding entries. 3) A candidate can only be elected leader if its log is at least as up-to-date as any majority quorum member.",
    "failureMode": "Configuring fixed, identical election timeouts across all nodes in a distributed cluster: when the leader dies, all nodes time out simultaneously, split votes in every election round, and leave the cluster permanently leaderless (Split Vote Livelock).",
    "tryItFriction": "Implement the core Raft State Machine in TypeScript: model Follower, Candidate, and Leader states, randomized election timers, RequestVote RPCs with term comparisons, and AppendEntries heartbeat synchronization.",
    "socraticHints": [
      "Why must election timeouts be randomized (e.g. 150ms - 300ms) in Raft?",
      "To ensure that one candidate node times out first, increments term, and gathers majority votes before other nodes time out!",
      "Randomization prevents split-vote livelocks and guarantees rapid leader election within 1-2 rounds."
    ],
    "situationalPuzzle": {
      "scenario": "A 5-node Raft cluster experiences a network partition: Nodes {A, B} are on Partition 1; Nodes {C, D, E} are on Partition 2. Node A was the original leader. Clients attempt to write to Node A. Can Node A commit new log entries?",
      "options": [
        "Yes, because Node A is the original leader.",
        "No, Quorum Loss: To commit an entry, a Raft leader must replicate it to a strict majority of nodes (floor(N/2) + 1 = 3 nodes). In Partition 1, Node A can only communicate with Node B (2 nodes < 3). Node A cannot reach quorum and cannot commit writes, preserving safety.",
        "Yes, Partition 1 becomes the primary partition.",
        "The cluster crashes."
      ],
      "answerIdx": 1,
      "debrief": "Raft guarantees safety across partitions via majority quorum. Partition 1 ({A, B}) has only 2 nodes and cannot reach a majority of 3. Meanwhile, Partition 2 ({C, D, E}) has 3 nodes, elects a new leader with a higher term, and safely commits writes."
    },
    "quests": [
      {
        "id": "db-m2-d39-q1",
        "name": "Raft Protocol Formal Specification: State, Invariants & RPC Protocols",
        "type": "concept",
        "desc": "Map Leader, Follower, Candidate states, AppendEntries RPC, RequestVote RPC, and Safety theorems."
      },
      {
        "id": "db-m2-d39-q2",
        "name": "Detective Lab: Tracing Raft Consensus RPC Exchanges & Quorum Log Commits",
        "type": "detective",
        "desc": "Capture and analyze network packet traces of Raft leader election and log commitment under network delay."
      },
      {
        "id": "db-m2-d39-q3",
        "name": "Mastery Assignment: TypeScript Raft Consensus Protocol Implementation",
        "type": "assignment",
        "desc": "Build a multi-node Raft consensus engine with randomized timers, vote solicitation, and log replication."
      },
      {
        "id": "db-m2-d39-q4",
        "name": "Production Incident Lab: Split-Vote Livelock & Election Storm Cluster Recovery",
        "type": "detective",
        "desc": "Resolve a high-severity outage where misconfigured timeouts caused continuous leader election churn."
      }
    ]
  },
  {
    "day": 40,
    "month": 2,
    "blockNum": 8,
    "title": "\u2b50 MILESTONE 7: Raft-Replicated Distributed Key-Value Cluster with Fault Tolerant Leader Failover",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Milestone Gate: Distributed Consensus Storage Engine)",
    "spokenGoal": "Assemble Milestone 7: Build a complete, resilient distributed key-value cluster in TypeScript powered by the Raft consensus protocol. Support multi-node cluster membership, linearizable Put/Get operations, automated leader failover during node crashes, persistent log compaction (snapshotting), and network partition tolerance.",
    "conceptInvariant": "Linearizable State Machine Replication Invariant: All read and write operations committed by the Raft cluster must appear to execute instantaneously at a discrete point in time between their invocation and response. Even if the leader crashes mid-operation, committed data is guaranteed to survive on the newly elected leader.",
    "failureMode": "Serving read requests directly from a leader without contacting quorum (Dirty Reads): a partitioned leader that has been deposed by the rest of the cluster might serve stale reads before realizing it has lost leadership.",
    "tryItFriction": "Pass the Milestone 7 chaos testing suite: deploy a 5-node cluster, inject random network partitions, kill leader nodes mid-flight, and verify 100% linearizable key-value consistency across 10,000 client transactions.",
    "socraticHints": [
      "How does Raft guarantee linearizable reads without writing a new log entry to disk for every read?",
      "Via ReadIndex or LeaseRead: the leader checks with a majority of nodes that it is still the legitimate leader before serving the read!",
      "This prevents partitioned 'zombie' leaders from serving stale data."
    ],
    "situationalPuzzle": {
      "scenario": "During validation of your Milestone 7 cluster, Node A is partitioned from the cluster while holding an uncommitted log entry at index 10. The remaining nodes elect Node C, which commits different entries at index 10 and 11. When the partition heals, Node A reconnects. How does your Raft engine resolve the conflicting entry on Node A?",
      "options": [
        "Node A merges both commands.",
        "Leader Log Overwrite: When Node C sends an AppendEntries RPC to Node A, Node A detects that its log entry at index 10 has a term mismatch with Node C's log. In accordance with Raft rules, Node A deletes its uncommitted entry at index 10 and overwrites it with Node C's authoritative entries.",
        "Node A rejects Node C and crashes.",
        "The cluster halts with a fatal conflict."
      ],
      "answerIdx": 1,
      "debrief": "Raft enforces that the leader's log is the single source of truth. Any uncommitted entries on followers that conflict with the leader are forcibly overwritten and replaced by the leader's log."
    },
    "quests": [
      {
        "id": "db-m2-d40-q1",
        "name": "Milestone 7 Architecture: Raft Distributed KV Store Blueprint",
        "type": "concept",
        "desc": "Design RPC interfaces, StateMachine interfaces, WAL log persistence, and client interaction protocols."
      },
      {
        "id": "db-m2-d40-q2",
        "name": "Detective Lab: Jepsen-Style Chaos Fault Injection on Replicated Key-Value Clusters",
        "type": "detective",
        "desc": "Execute network partitions, clock skews, and process kills to verify Raft linearizability guarantees."
      },
      {
        "id": "db-m2-d40-q3",
        "name": "Mastery Assignment: Full TypeScript Raft Replicated Key-Value Cluster",
        "type": "assignment",
        "desc": "Implement the complete Milestone 7 distributed storage engine with leader election, log replication, and failover."
      },
      {
        "id": "db-m2-d40-q4",
        "name": "Production Incident Lab: Replicated State Machine Log Divergence Forensic Rescue",
        "type": "detective",
        "desc": "Resolve a critical consensus bug where follower nodes failed to overwrite uncommitted conflicting entries."
      }
    ]
  },
  {
    "day": 41,
    "month": 2,
    "blockNum": 9,
    "title": "Horizontal Sharding Architectures: Range Partitioning vs Hash Partitioning vs Consistent Hashing Ring",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Horizontal Scaling & Data Placement)",
    "spokenGoal": "Scale databases beyond the hardware limits of a single machine: analyze horizontal sharding topologies, compare Range-Based Sharding (Google Bigtable/Spanner style, optimal for range queries but vulnerable to hot spotting) vs Hash-Based Sharding, and master Consistent Hashing with Virtual Nodes (DynamoDB / Cassandra style) to minimize data movement during node additions and removals.",
    "conceptInvariant": "Consistent Hashing Minimization Invariant: On a consistent hashing ring with $N$ nodes, adding or removing a single node requires migrating strictly $K / N$ keys on average (where $K$ is total keys). Virtual nodes ensure even distribution and prevent hot spot imbalances across heterogeneous hardware.",
    "failureMode": "Sharding by naive modulus hash (`shard_id = hash(user_id) % N`): adding an $(N+1)$-th database node alters the modulus for almost every single key, requiring a catastrophic 100% data resharding of the entire multi-terabyte database.",
    "tryItFriction": "Implement a Consistent Hashing Ring in TypeScript with 256 virtual nodes per physical shard: benchmark key distribution variance across 10 shards and measure key migration percentages when scaling from 10 to 11 shards.",
    "socraticHints": [
      "Why are sequential primary keys (like auto-increment IDs or timestamps) catastrophic as sharding keys in range-based sharding?",
      "Because all new inserts hit the highest range, funneling 100% of write traffic into a single shard (Hot Spotting) while all other shards sit completely idle!",
      "Use hash sharding or prefix UUIDs to distribute sequential writes uniformly."
    ],
    "situationalPuzzle": {
      "scenario": "A social network shards its database by Range on `created_at`. During New Year's Eve, the database crashes due to 100% CPU and disk saturation, even though overall cluster capacity is 85% idle. What data placement mistake caused this outage?",
      "options": [
        "The network switch melted.",
        "Range Sharding Monotonic Hot Spotting: Because the sharding key is monotonic time (`created_at`), every single new post and comment written at midnight landed on the exact same single physical shard responsible for the current timestamp range, completely overwhelming it while other shards were idle.",
        "The database ran out of memory.",
        "Consistent hashing failed."
      ],
      "answerIdx": 1,
      "debrief": "Range-based sharding on monotonically increasing keys directs all current write traffic to a single shard. High-throughput write workloads require hash-based partitioning or composite shard keys (`hash(user_id) + created_at`) to distribute write load."
    },
    "quests": [
      {
        "id": "db-m2-d41-q1",
        "name": "Sharding Mathematics: Range vs Hash vs Consistent Hashing with VNodes",
        "type": "concept",
        "desc": "Derive key distribution standard deviation formulas and rebalancing cost models across sharding topologies."
      },
      {
        "id": "db-m2-d41-q2",
        "name": "Detective Lab: Profiling Hot Shards & Skewed Key Distributions with Telemetry",
        "type": "detective",
        "desc": "Analyze real-world partition metrics to identify data skew and hot spot access patterns across database clusters."
      },
      {
        "id": "db-m2-d41-q3",
        "name": "Mastery Assignment: Consistent Hashing Ring with Virtual Nodes in TypeScript",
        "type": "assignment",
        "desc": "Build a consistent hashing router that handles dynamic node joins, node departures, and minimal key rebalancing."
      },
      {
        "id": "db-m2-d41-q4",
        "name": "Production Incident Lab: Monotonic Key Write Hot Spot Shard Crash War Room",
        "type": "detective",
        "desc": "Resolve a high-severity production outage caused by an un-hashed timestamp sharding key collapsing an OLTP cluster."
      }
    ]
  },
  {
    "day": 42,
    "month": 2,
    "blockNum": 9,
    "title": "Distributed Query Routing: Two-Tier Architecture, Scatter-Gather Queries, Distributed Aggregations & Joins",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Distributed Query Execution Mechanics)",
    "spokenGoal": "Execute complex queries across sharded database clusters: deconstruct Two-Tier query router architectures (e.g. Vitess, Citus), analyze Single-Shard Route optimization vs Scatter-Gather distributed execution, and master Distributed Aggregations (combining partial sums, counts, and averages) and Distributed Cross-Shard Joins (Colocated Joins vs Broadcast Joins).",
    "conceptInvariant": "Colocated Join Invariant: If two sharded tables (e.g. `users` and `orders`) are partitioned on the same distribution key (`user_id`) and assigned to the same physical nodes, joins between them can be executed purely locally on each shard without moving any data across the network.",
    "failureMode": "Executing an un-sharded cross-table join across 10 database shards: the query coordinator must pull millions of rows from all shards over the network into memory (Broadcast/Shuffle Join), choking the coordinator with gigabytes of network traffic and 100x query latency.",
    "tryItFriction": "Build a Distributed Query Router in TypeScript that parses SQL queries, routes single-shard queries directly to target nodes, and executes scatter-gather distributed aggregations (`SUM`, `COUNT`, `AVG`) across multiple mock database nodes.",
    "socraticHints": [
      "Why can't a distributed query coordinator simply calculate `AVG(salary)` by averaging the averages returned by each shard?",
      "Because mathematical average is non-associative: averaging averages produces incorrect results if shards have different row counts!",
      "The coordinator must rewrite `AVG` into `SUM` and `COUNT` on each shard and compute `total_sum / total_count` at the coordinator."
    ],
    "situationalPuzzle": {
      "scenario": "A sharded e-commerce database receives the query: `SELECT * FROM orders WHERE customer_id = 42`. The query coordinator executes in 2ms. Another query: `SELECT * FROM orders WHERE status = 'PENDING'` takes 450ms. Why is the second query 200x slower?",
      "options": [
        "The status column is corrupted.",
        "Scatter-Gather Network Fan-Out: The table is sharded by `customer_id`. The first query routes deterministically to exactly one shard. The second query filters on `status` (un-sharded column), forcing the coordinator to execute a Scatter-Gather query across all 50 shards and merge the results, multiplying network latency and tail latency variance.",
        "PostgreSQL does not support status queries.",
        "The database had an unindexed primary key."
      ],
      "answerIdx": 1,
      "debrief": "Queries containing the shard key execute as single-shard lookups. Queries without the shard key require Scatter-Gather across every shard in the cluster, suffering from network fan-out and tail latency bottlenecks."
    },
    "quests": [
      {
        "id": "db-m2-d42-q1",
        "name": "Distributed Query Execution Topologies: Vitess VTCGate vs Citus Coordinator",
        "type": "concept",
        "desc": "Map distributed AST rewriting, scatter-gather execution graphs, and partial aggregation algebra."
      },
      {
        "id": "db-m2-d42-q2",
        "name": "Detective Lab: Profiling Network Shuffle Overhead in Distributed Joins with EXPLAIN",
        "type": "detective",
        "desc": "Analyze distributed query execution plans comparing Colocated Joins vs Broadcast Joins."
      },
      {
        "id": "db-m2-d42-q3",
        "name": "Mastery Assignment: Distributed Scatter-Gather Query Coordinator in TypeScript",
        "type": "assignment",
        "desc": "Build an asynchronous query router that parallelizes execution across shards and merges partial aggregations."
      },
      {
        "id": "db-m2-d42-q4",
        "name": "Production Incident Lab: Un-Sharded Cross-Shard Join Coordinator OOM Outage Triage",
        "type": "detective",
        "desc": "Resolve a coordinator crash caused by an ad-hoc reporting query triggering an unconstrained distributed cartesian join."
      }
    ]
  },
  {
    "day": 43,
    "month": 2,
    "blockNum": 9,
    "title": "Distributed Transactions: Two-Phase Commit (2PC) Protocol (Prepare, Commit), Coordinator Failure & Blocking Limits",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Atomic Commitment Protocols)",
    "spokenGoal": "Ensure atomic transactions across independent database shards: analyze the Two-Phase Commit (2PC) protocol (Phase 1: Prepare, Phase 2: Commit/Abort), dissect participant vote guarantees, explore the catastrophic Coordinator Failure Blocking Problem (where participants hold locks indefinitely waiting for a crashed coordinator), and evaluate Three-Phase Commit (3PC) and Paxos-backed commit.",
    "conceptInvariant": "2PC Atomic Agreement Invariant: If any participant votes VOTE-ABORT during Phase 1, the coordinator must issue GLOBAL-ABORT to all participants. A transaction is committed if and only if ALL participants vote VOTE-COMMIT and the coordinator logs GLOBAL-COMMIT to its persistent WAL before issuing commit commands.",
    "failureMode": "The coordinator crashes immediately after all participants enter the PREPARED state: participants hold exclusive row locks on their respective databases, cannot unilaterally abort or commit, and block all incoming concurrent traffic until human intervention.",
    "tryItFriction": "Construct a Two-Phase Commit protocol coordinator and participant engine in TypeScript: simulate network drops during Prepare and Commit phases, and implement participant timeout and recovery protocols.",
    "socraticHints": [
      "Why is Two-Phase Commit fundamentally a blocking protocol?",
      "Because once a participant votes PREPARED, it has promised to commit if asked. If the coordinator crashes and is unreachable, the participant cannot know whether the coordinator committed or aborted, forcing it to hold locks indefinitely!",
      "Modern cloud databases replace centralized coordinators with distributed Raft/Paxos consensus groups."
    ],
    "situationalPuzzle": {
      "scenario": "A financial transaction transfers $100 from Bank Shard A to Bank Shard B using 2PC. Shard A and Shard B both vote 'PREPARED' and acquire exclusive row locks. The coordinator logs 'GLOBAL-COMMIT' in memory, but loses power before writing to disk or sending messages. What is the state of the shards upon coordinator crash?",
      "options": [
        "Shard A aborts and Shard B commits.",
        "Blocking In-Doubt State: Both Shard A and Shard B are stuck in the 'PREPARED' state. Because they cannot determine whether the coordinator decided to commit or abort, they must hold their row-level locks and block all subsequent operations on those accounts until the coordinator recovers.",
        "The money is doubled.",
        "The OS automatically aborts the transaction."
      ],
      "answerIdx": 1,
      "debrief": "The PREPARED state in 2PC is a blocking state. A participant that has voted 'yes' cannot decide unilaterally to commit or abort because doing so could violate atomicity if the coordinator made the opposite decision. This is the classic 2PC blocking limitation."
    },
    "quests": [
      {
        "id": "db-m2-d43-q1",
        "name": "The Two-Phase Commit Protocol State Machine & Failure Modes Matrix",
        "type": "concept",
        "desc": "Formalize coordinator and participant state transitions, WAL logging points, and timeout rules."
      },
      {
        "id": "db-m2-d43-q2",
        "name": "Detective Lab: Auditing Prepared Transactions in PostgreSQL with pg_prepared_xacts",
        "type": "detective",
        "desc": "Inspect abandoned 2PC transactions in pg_prepared_xacts and analyze held lock footprints."
      },
      {
        "id": "db-m2-d43-q3",
        "name": "Mastery Assignment: TypeScript Two-Phase Commit (2PC) Distributed Transaction Manager",
        "type": "assignment",
        "desc": "Build a robust 2PC coordinator with persistent WAL logging, participant crash recovery, and resolution hooks."
      },
      {
        "id": "db-m2-d43-q4",
        "name": "Production Incident Lab: Orphaned 2PC Prepared Transaction Lock Avalanche Triage",
        "type": "detective",
        "desc": "Resolve a production database stall caused by orphaned prepared transactions holding exclusive locks for 24 hours."
      }
    ]
  },
  {
    "day": 44,
    "month": 2,
    "blockNum": 9,
    "title": "Eventual Consistency & Transactional Outbox: Saga Pattern (Orchestration vs Choreography) & CDC (Debezium)",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Event-Driven Consistency & Outbox Architecture)",
    "spokenGoal": "Escape synchronous 2PC blocking across microservices: architect Eventual Consistency using the Saga Pattern (compensating transactions for failure rollbacks), analyze Orchestration vs Choreography, and implement the Transactional Outbox Pattern with Change Data Capture (CDC / Debezium) to guarantee atomic database updates and event publishing without dual-write race conditions.",
    "conceptInvariant": "Transactional Outbox Atomic Dual-Write Invariant: Business state changes and corresponding domain event messages must be committed in the EXACT SAME local database transaction (e.g. `INSERT INTO orders` and `INSERT INTO outbox_table`). An asynchronous CDC process reads the database WAL and publishes events to Kafka with at-least-once delivery guarantees.",
    "failureMode": "An application writes to PostgreSQL and then immediately calls Kafka publish in code: the database write succeeds, but the application crashes before publishing to Kafka, resulting in an orphaned business record that downstream microservices never process.",
    "tryItFriction": "Build a Transactional Outbox & Saga Orchestrator in TypeScript: execute a 3-step distributed booking saga (Flight, Hotel, Car), simulate a failure at Step 3, and trigger compensating transactions to roll back Steps 1 and 2.",
    "socraticHints": [
      "Why is a dual-write (writing to database then sending message to Kafka in application code) an architectural anti-pattern?",
      "Because network and server failures make it impossible to guarantee that both operations either succeed or fail together without distributed transactions!",
      "The Outbox pattern leverages the local database's ACID properties to ensure atomic event staging."
    ],
    "situationalPuzzle": {
      "scenario": "A checkout service deducts inventory in Database A and charges a credit card via a third-party Stripe API. If the credit card fails, the inventory deduction must be reversed. Why can't traditional database ACID transactions handle this rollback?",
      "options": [
        "PostgreSQL does not support credit cards.",
        "External Side-Effect Irreversibility: ACID rollback only affects database tables; it cannot roll back external real-world actions or third-party HTTP APIs. The system requires a Saga Pattern with an explicit Compensating Transaction (`reverseInventoryDeduction()`) to restore consistency.",
        "Stripe APIs require 2PC.",
        "The inventory table has a foreign key constraint."
      ],
      "answerIdx": 1,
      "debrief": "Real-world distributed systems involve external services and independent databases that cannot participate in local ACID rollbacks. Sagas replace all-or-nothing atomicity with forward recovery and explicit compensating business operations."
    },
    "quests": [
      {
        "id": "db-m2-d44-q1",
        "name": "The Saga Pattern & Transactional Outbox Architecture Blueprint",
        "type": "concept",
        "desc": "Compare Saga Orchestration vs Choreography, compensating transactions, and CDC architectures."
      },
      {
        "id": "db-m2-d44-q2",
        "name": "Detective Lab: Deconstructing Debezium PostgreSQL WAL Logical Decoding (pgoutput)",
        "type": "detective",
        "desc": "Inspect how Debezium tails the PostgreSQL write-ahead log and formats transactional outbox events into JSON."
      },
      {
        "id": "db-m2-d44-q3",
        "name": "Mastery Assignment: TypeScript Saga Orchestrator & Transactional Outbox Relay",
        "type": "assignment",
        "desc": "Build an end-to-end Saga workflow engine with local outbox persistence and compensating failure handling."
      },
      {
        "id": "db-m2-d44-q4",
        "name": "Production Incident Lab: Dual-Write Out of Sync Ghost Order Financial Audit Triage",
        "type": "detective",
        "desc": "Investigate and resolve data discrepancy caused by an application dual-writing to database and Kafka."
      }
    ]
  },
  {
    "day": 45,
    "month": 2,
    "blockNum": 9,
    "title": "\u2b50 MILESTONE 8: Sharded Database Router & Distributed Outbox Engine with Consistent Hashing",
    "stageName": "Stage 2: Defensive Fluency",
    "stageNum": 2,
    "pedagogicalRole": "Balanced Friction (Milestone Gate: Sharding & Outbox Infrastructure)",
    "spokenGoal": "Assemble Milestone 8: Build an enterprise-grade Sharded Database Router and Distributed Outbox Engine in TypeScript. Support consistent hashing with virtual nodes across multiple database shards, transparent SQL query routing (single-shard route vs scatter-gather), transactional outbox event capture, and at-least-once distributed event delivery.",
    "conceptInvariant": "Sharded Routing Correctness Invariant: The router must guarantee that all queries containing the partition key route strictly to the designated shard on the consistent hashing ring. Scatter-gather queries must aggregate results deterministically, and all transactional state changes must generate corresponding outbox records within the same shard transaction.",
    "failureMode": "Failing to handle shard failover during consistent hashing ring traversal: if a shard node drops off the ring without dynamic replication rerouting, queries destined for that shard fail immediately instead of gracefully degrading or reading from replicas.",
    "tryItFriction": "Pass the Milestone 8 integration suite: route 50,000 queries across 8 virtual shards, demonstrate zero lost outbox events during simulated shard node failures, and verify seamless rebalancing upon adding a 9th shard.",
    "socraticHints": [
      "How do you ensure outbox events on different shards maintain order for a specific user?",
      "By partitioning both the database row AND the Kafka event stream using the exact same shard key (e.g. `user_id`)!",
      "Events for the same entity are processed sequentially by the same Kafka partition consumer."
    ],
    "situationalPuzzle": {
      "scenario": "During testing of your Milestone 8 router, an application issues an `UPDATE accounts SET balance = balance - 50 WHERE user_id = 100` and creates an outbox record. Simultaneously, Shard 3 loses network connectivity. The transaction aborts on the shard. Does the outbox engine publish the event?",
      "options": [
        "Yes, outbox events publish regardless of transaction status.",
        "No, Atomic Local Transaction Invariant: Because the outbox record was written inside the exact same local ACID transaction as the account update, when the transaction aborted, the outbox record was rolled back as well. Zero false events are published, preserving consistency.",
        "The router sends an email alert.",
        "The message is queued in memory."
      ],
      "answerIdx": 1,
      "debrief": "The core beauty of the Transactional Outbox pattern is that event creation shares the transactional boundary of the business update. If the update fails, the event is rolled back automatically, preventing ghost events."
    },
    "quests": [
      {
        "id": "db-m2-d45-q1",
        "name": "Milestone 8 Architecture: Sharded Router & Outbox System Specification",
        "type": "concept",
        "desc": "Design connection management, consistent hashing ring, scatter-gather query pipelines, and outbox pollers."
      },
      {
        "id": "db-m2-d45-q2",
        "name": "Detective Lab: Profiling Shard Rebalance Data Migration under Active Write Traffic",
        "type": "detective",
        "desc": "Measure key migration percentages and query latency spikes during dynamic shard ring expansion."
      },
      {
        "id": "db-m2-d45-q3",
        "name": "Mastery Assignment: Full TypeScript Sharded Database Router & Outbox Relay Engine",
        "type": "assignment",
        "desc": "Implement the complete Milestone 8 router supporting consistent hashing, query dispatch, and CDC outbox relays."
      },
      {
        "id": "db-m2-d45-q4",
        "name": "Production Incident Lab: Ghost Event Double-Payment Outbox Failure War Room",
        "type": "detective",
        "desc": "Resolve a high-severity financial incident where outbox messages were published before local transaction commits."
      }
    ]
  },
  {
    "day": 46,
    "month": 2,
    "blockNum": 10,
    "title": "OLTP vs OLAP Storage Architectures: Row-Oriented vs Column-Oriented Storage Layouts (ClickHouse, Parquet, DuckDB)",
    "stageName": "Stage 3: Autonomous Synthesis",
    "stageNum": 3,
    "pedagogicalRole": "High Guidance (Analytical Columnar Storage Paradigm)",
    "spokenGoal": "Deconstruct the fundamental divergence between transactional and analytical databases: contrast N-ary Storage Model (NSM / Row Store - PostgreSQL, MySQL) against Decomposition Storage Model (DSM / Column Store - ClickHouse, Apache Parquet, DuckDB). Analyze why scanning 1 billion rows in a row store reads 500 GB of unwanted column data, while a column store reads strictly the required 2 GB with 100x lower I/O.",
    "conceptInvariant": "Projection I/O Minimization Invariant: In a columnar database, each column's data is stored contiguously on disk and in memory in independent files/chunks. For a query selecting only columns A and B (`SELECT SUM(A) WHERE B > 10`), the storage engine reads strictly the physical bytes belonging to columns A and B, achieving zero I/O wasted on unused columns.",
    "failureMode": "Running an aggregation query (`SELECT AVG(revenue) FROM orders`) across 500,000,000 rows on a standard row store: the engine must read every single byte of every column (order addresses, notes, customer emails) into buffer memory, causing 30 minutes of disk thrashing when DuckDB or ClickHouse would execute it in 400ms.",
    "tryItFriction": "Construct a binary columnar storage layout in TypeScript that writes tabular records column-by-column into contiguous buffers and measures the read I/O reduction when executing single-column aggregations compared to row-by-row storage.",
    "socraticHints": [
      "Why is a Column Store terrible for single-row OLTP transactions (`INSERT INTO users VALUES (...)`)?",
      "Because inserting a single row requires opening and appending to N separate physical files/chunks (one per column) across disk instead of writing a single contiguous 8KB page!",
      "Row stores excel at single-record CRUD; column stores excel at wide-table aggregations."
    ],
    "situationalPuzzle": {
      "scenario": "A business intelligence dashboard runs a query calculating the monthly sum of sales grouped by category on a table with 200 columns and 100,000,000 rows. In PostgreSQL, the query takes 180 seconds. In DuckDB, reading the exact same data exported to Parquet takes 0.8 seconds. Why is DuckDB over 200x faster?",
      "options": [
        "DuckDB runs on a GPU.",
        "Columnar Projection Pruning: PostgreSQL is a row store, forcing it to read all 200 columns (approx. 80 GB of data) from disk into shared buffers to inspect the rows. DuckDB is a columnar engine, reading only the 2 required columns (`sales_amount`, `category`), loading only 400 MB of data directly into CPU cache.",
        "PostgreSQL disables compression.",
        "The Parquet file omitted the data."
      ],
      "answerIdx": 1,
      "debrief": "Row stores suffer from extreme I/O waste on wide analytical tables because full row tuples must be loaded from disk even if only 2 columns are requested. Column stores eliminate 99% of I/O by reading only the requested column vectors."
    },
    "quests": [
      {
        "id": "db-m2-d46-q1",
        "name": "Storage Models: NSM (Row Store) vs DSM (Column Store) vs PAX (Hybrid)",
        "type": "concept",
        "desc": "Map physical disk layout, cache locality, and I/O consumption across analytical storage models."
      },
      {
        "id": "db-m2-d46-q2",
        "name": "Detective Lab: Profiling Disk Read Footprints between PostgreSQL and DuckDB on TPC-H",
        "type": "detective",
        "desc": "Benchmark exact byte read metrics and CPU cycles on standard TPC-H analytical queries."
      },
      {
        "id": "db-m2-d46-q3",
        "name": "Mastery Assignment: TypeScript In-Memory Columnar Storage Table & Projection Reader",
        "type": "assignment",
        "desc": "Build a columnar storage manager storing TypedArrays per column with zero-copy projection filtering."
      },
      {
        "id": "db-m2-d46-q4",
        "name": "Production Incident Lab: Row-Store Analytics Query Buffer Exhaustion Outage Triage",
        "type": "detective",
        "desc": "Resolve a production OLTP outage caused by an analyst running unconstrained aggregations on production row tables."
      }
    ]
  },
  {
    "day": 47,
    "month": 2,
    "blockNum": 10,
    "title": "Columnar Encoding & Compression: Run-Length Encoding (RLE), Dictionary Encoding, Bit-Packing & FoR",
    "stageName": "Stage 3: Autonomous Synthesis",
    "stageNum": 3,
    "pedagogicalRole": "Low Guidance (Lightweight Data Compression Algorithms)",
    "spokenGoal": "Exploit homogeneous data types in columnar storage: explore lightweight integer and string compression schemes that operate directly on CPU vectors. Master Run-Length Encoding (RLE) for repeated values, Dictionary Encoding for low-cardinality strings, Bit-Packing to truncate unused integer bits, and Frame of Reference (FoR) / Delta encoding for clustered numbers.",
    "conceptInvariant": "Direct-on-Compressed Execution Invariant: Modern columnar engines (ClickHouse, Parquet) evaluate query filters and aggregations directly on compressed encoded representations without decompressing values back into raw native types, multiplying CPU cache utilization and memory bandwidth.",
    "failureMode": "Applying heavyweight general-purpose compression (Gzip) to column vectors: while disk size is small, decompression consumes 100% CPU on every scan, preventing the database from leveraging direct SIMD vector scanning.",
    "tryItFriction": "Implement Run-Length Encoding (RLE) and Dictionary Encoding in TypeScript, demonstrating a 10x compression ratio on 1,000,000 categorical records and executing filtering (`WHERE status = 'ACTIVE'`) directly on dictionary integer IDs.",
    "socraticHints": [
      "How does Frame of Reference (FoR) compress a column of timestamps like [1700000010, 1700000025, 1700000015]?",
      "By storing the minimum value (Frame = 1700000010) once, and storing only the small delta offsets [0, 15, 5] as 4-bit integers instead of 64-bit integers!",
      "Bit-packing compresses the deltas into fractional bytes, saving up to 85% of memory."
    ],
    "situationalPuzzle": {
      "scenario": "A 1-billion-row columnar table stores a `country_code` column (e.g. 'US', 'IN', 'DE', 'GB') representing 200 countries. Raw ASCII strings occupy 2 GB. After applying Dictionary Encoding, what is the memory footprint and how does a query `WHERE country_code = 'US'` execute?",
      "options": [
        "Memory footprint increases due to dictionary overhead.",
        "87% Space Reduction & Integer Comparison: The 200 unique country codes are stored in a small 200-element dictionary table. The column vector stores only 1-byte integer IDs (200 values fit in 8 bits = 1 GB total). The filter evaluates `WHERE country_id = 1` using fast single-cycle CPU integer comparisons without string parsing.",
        "The query requires a full table scan in Python.",
        "Dictionary encoding corrupts non-English characters."
      ],
      "answerIdx": 1,
      "debrief": "Dictionary encoding replaces repeating strings with small fixed-width integer codes. This slashes memory footprints and replaces expensive string comparisons with single-cycle integer equality checks directly inside CPU registers."
    },
    "quests": [
      {
        "id": "db-m2-d47-q1",
        "name": "Columnar Encoding Mathematics: RLE, Dictionary, Bit-Packing & Delta Encoding",
        "type": "concept",
        "desc": "Derive compression ratios, bit-packing boundary math, and SIMD alignment rules."
      },
      {
        "id": "db-m2-d47-q2",
        "name": "Detective Lab: Deconstructing Parquet Column Chunk Metadata with parquet-tools",
        "type": "detective",
        "desc": "Inspect dictionary page headers, plain encoding vs RLE_DICTIONARY, and compressed size statistics in Parquet files."
      },
      {
        "id": "db-m2-d47-q3",
        "name": "Mastery Assignment: TypeScript Columnar Encoder & Compressed Query Evaluator",
        "type": "assignment",
        "desc": "Build an encoder module implementing RLE, Dictionary, and Bit-Packing with direct compressed execution."
      },
      {
        "id": "db-m2-d47-q4",
        "name": "Production Incident Lab: High-Cardinality Dictionary Memory Explosion Triage",
        "type": "detective",
        "desc": "Resolve a columnar database memory crash caused by dictionary encoding applied to unique UUID columns."
      }
    ]
  },
  {
    "day": 48,
    "month": 2,
    "blockNum": 10,
    "title": "Vectorized Query Execution: Volcano Iterator Model vs SIMD Vector Processing (1024-Tuple Batches)",
    "stageName": "Stage 3: Autonomous Synthesis",
    "stageNum": 3,
    "pedagogicalRole": "Low Guidance (CPU Architecture & SIMD Vectorization)",
    "spokenGoal": "Transition from traditional Volcano Iterator model (`next()` returning one tuple at a time, plagued by virtual function call overhead and CPU instruction cache misses) to Vectorized Execution (MonetDB/X100 style, used in ClickHouse, DuckDB, Snowflake). Process data in tight columnar vectors (e.g. 1024 values per batch), maximizing CPU L1 instruction cache locality and enabling SIMD (Single Instruction, Multiple Data) parallelism.",
    "conceptInvariant": "Batch Vector Processing Invariant: Vectorized execution operators pass arrays of values (e.g. 1024 contiguous integers) through simple, branchless CPU loops. This eliminates 95% of virtual function dispatch overhead, prevents CPU branch mispredictions, and allows compilers to auto-vectorize loops into AVX2/AVX-512 SIMD instructions.",
    "failureMode": "Using the classical Volcano iterator model to evaluate `SELECT SUM(price * tax)` over 100 million rows: the CPU executes 200,000,000 dynamic virtual function dispatches, incurring 30ns overhead per tuple, bottlenecking query throughput on CPU instruction pipeline stalls.",
    "tryItFriction": "Benchmark query evaluation in TypeScript: compare a Volcano-style iterator (`tuple.next()`) against a Vectorized batch processor (processing `Float64Array` buffers of 1024 values in tight loops) across 10,000,000 simulated sales records.",
    "socraticHints": [
      "Why is processing 1024 values at a time considered the 'sweet spot' in vectorized query engines?",
      "Because 1024 8-byte numbers (8KB) fits comfortably inside modern CPU L1 data cache (typically 32KB to 48KB per core)!",
      "Vector batches larger than L1 cache spill into slower L2/L3 cache, increasing memory latency."
    ],
    "situationalPuzzle": {
      "scenario": "A database engineer profiles two query engines evaluating `WHERE age > 65 AND score > 90` over 50 million records. Engine A processes rows using an iterator loop with `if (row.age > 65 && row.score > 90)`. Engine B uses vectorized selection vectors. Profiling shows Engine A experiences 25% CPU branch misprediction penalties, while Engine B has 0.1%. Why?",
      "options": [
        "Engine B has a faster CPU.",
        "Branchless Selection Vectors: Vectorized engines compute bitmasks or selection vectors (`sel_vector[i] = (age[i] > 65) & (score[i] > 90)`) using branchless bitwise CPU instructions. Without conditional branch jumps (`JMP`), the CPU hardware pipeline suffers zero branch mispredictions and executes at maximum IPC.",
        "Engine A has a syntax error.",
        "PostgreSQL converts conditions to loops."
      ],
      "answerIdx": 1,
      "debrief": "Volcano engines with conditional `if` statements suffer heavy branch mispredictions on random data distributions. Vectorized engines compute condition bitmasks in tight, branchless loops that maximize instruction pipelining."
    },
    "quests": [
      {
        "id": "db-m2-d48-q1",
        "name": "Execution Paradigms: Volcano (Tuple-at-a-Time) vs Vectorized (Batch) vs JIT (Hyper)",
        "type": "concept",
        "desc": "Compare MonetDB/X100 vectorized batching against Hyper/Umbra LLVM JIT code generation."
      },
      {
        "id": "db-m2-d48-q2",
        "name": "Detective Lab: Profiling CPU Cache Misses & IPC with Linux perf on Analytical Scans",
        "type": "detective",
        "desc": "Use `perf stat` to measure instructions per cycle (IPC), branch-misses, and L1-dcache-load-misses."
      },
      {
        "id": "db-m2-d48-q3",
        "name": "Mastery Assignment: TypeScript Vectorized Batch Execution Pipeline (1024 Tuples)",
        "type": "assignment",
        "desc": "Build a vectorized query execution engine processing typed arrays with selection vectors and SIMD filters."
      },
      {
        "id": "db-m2-d48-q4",
        "name": "Production Incident Lab: CPU Branch Misprediction Analytical Pipeline Stutter War Room",
        "type": "detective",
        "desc": "Optimize a critical analytics engine by rewriting branching filters into vectorized bitmask operations."
      }
    ]
  },
  {
    "day": 49,
    "month": 2,
    "blockNum": 10,
    "title": "Time-Series Databases & Hypertable Partitioning: Chunk Management, Continuous Aggregates & Retention Policies",
    "stageName": "Stage 3: Autonomous Synthesis",
    "stageNum": 3,
    "pedagogicalRole": "Low Guidance (Time-Series Specialization & Hypertable Topologies)",
    "spokenGoal": "Handle massive append-only chronological streams: examine Time-Series Database architectures (TimescaleDB, InfluxDB). Master Hypertables (two-dimensional partitioning by time intervals and space), Chunk Management, Continuous Aggregates (pre-materializing rollups without background lock contention), and automated Data Retention / Compression policies.",
    "conceptInvariant": "Hypertable Chunk Invariant: A hypertable abstracts dozens of physical underlying partition tables ('chunks') behind a single logical view. Each chunk represents a discrete time boundary (e.g. 1 day). Queries filtering on timestamp automatically prune 99% of chunks at the catalog level, avoiding index traversal on historical data.",
    "failureMode": "Storing 2 billion IoT sensor events in a single unpartitioned PostgreSQL table: the B+ tree index grows to 80 GB, exceeding server RAM. Every new write must read random index pages from disk to insert the key, causing write throughput to collapse from 40,000 writes/sec to 300 writes/sec.",
    "tryItFriction": "Construct a Time-Series Chunk Manager in TypeScript: automatically allocate time-bounded chunks based on event timestamps, route inserts to active chunks, prune historical chunks during range queries, and drop expired chunks instantly.",
    "socraticHints": [
      "Why is dropping a chunk in TimescaleDB (`DROP TABLE _timescaledb_internal._hyper_1_chunk`) instant compared to running `DELETE FROM logs WHERE created_at < ...` in a standard table?",
      "Because dropping a chunk is an O(1) filesystem metadata operation (deleting the file), whereas `DELETE` writes millions of tombstones, updates indexes, and generates gigabytes of WAL logs!",
      "Chunk drops free physical disk space immediately with zero WAL bloat."
    ],
    "situationalPuzzle": {
      "scenario": "A DevOps monitoring database ingests 100,000 metrics/sec. The retention policy requires deleting data older than 30 days. An engineer sets up a nightly cron job: `DELETE FROM metrics WHERE recorded_at < NOW() - INTERVAL '30 days'`. Within 3 days, the database crashes due to 100% disk usage and extreme lock waits. Why did `DELETE` destroy the database?",
      "options": [
        "Cron jobs are unsupported in production.",
        "MVCC Delete Bloat & WAL Explosion: Running `DELETE` on 8.6 billion rows creates 8.6 billion dead row versions, generates terabytes of WAL logs, exhausts disk space, and blocks active transactions. In a hypertable architecture, retention is executed by simply dropping expired time chunks in milliseconds without writing a single WAL delete record.",
        "PostgreSQL cannot compare timestamps.",
        "The metrics were stored as JSON."
      ],
      "answerIdx": 1,
      "debrief": "Never use row-level `DELETE` for bulk time-series data retention. Hypertables partition data into physical time chunks. Dropping an expired chunk unlinks the physical file from the filesystem in O(1) time with zero WAL overhead."
    },
    "quests": [
      {
        "id": "db-m2-d49-q1",
        "name": "Time-Series Architecture: Hypertables, Chunk Dimensions & Continuous Aggregates",
        "type": "concept",
        "desc": "Map time/space partitioning, chunk exclusion optimization, and real-time aggregate materialized views."
      },
      {
        "id": "db-m2-d49-q2",
        "name": "Detective Lab: Profiling Chunk Exclusion & Index RAM Sizing with TimescaleDB",
        "type": "detective",
        "desc": "Inspect hypertable chunk metrics and verify that active chunk indexes fit entirely within RAM."
      },
      {
        "id": "db-m2-d49-q3",
        "name": "Mastery Assignment: TypeScript Time-Series Hypertable & Automated Chunk Manager",
        "type": "assignment",
        "desc": "Build a hypertable manager that creates chronological chunks, routes stream writes, and executes retention drops."
      },
      {
        "id": "db-m2-d49-q4",
        "name": "Production Incident Lab: Nightly DELETE Massive WAL Spike Disk Collapse Triage",
        "type": "detective",
        "desc": "Remediate a severe disk outage caused by massive unchunked time-series delete operations."
      }
    ]
  },
  {
    "day": 50,
    "month": 2,
    "blockNum": 10,
    "title": "\u2b50 MILESTONE 9: Vectorized Columnar Analytics Engine with SIMD Compression & Parquet Readers",
    "stageName": "Stage 3: Autonomous Synthesis",
    "stageNum": 3,
    "pedagogicalRole": "Balanced Friction (Milestone Gate: Columnar Analytics Engine)",
    "spokenGoal": "Assemble Milestone 9: Build a high-performance Vectorized Columnar Analytics Engine in TypeScript. Support columnar table memory layouts, lightweight Dictionary and RLE compression, SIMD batch processing (1024 values per vector), selection vector filtering, columnar projection pruning, and direct aggregation execution.",
    "conceptInvariant": "Zero-Copy Analytical Pipeline Invariant: The engine must evaluate filtering predicates (`age > 50`) directly on compressed columnar chunks, populate compact selection vector bitmasks, and execute downstream aggregations (`SUM`, `AVG`) without allocating intermediate row objects or copying unselected data.",
    "failureMode": "Converting columnar data back into arrays of row objects inside the query operator pipeline: memory allocation overhead and JavaScript/V8 object instantiation destroy all performance benefits, slowing throughput by 50x.",
    "tryItFriction": "Pass the Milestone 9 performance test: execute wide-table filter and aggregate queries across 1,000,000 synthetic records in under 25ms in pure TypeScript, demonstrating a 20x speedup over row-oriented evaluation.",
    "socraticHints": [
      "What is a Selection Vector in vectorized query engines?",
      "An array of memory offsets (e.g. `[0, 4, 7, 12]`) indicating which rows in the current 1024-element batch satisfied the filter condition!",
      "Subsequent operators only inspect indices present in the selection vector, avoiding expensive memory copies."
    ],
    "situationalPuzzle": {
      "scenario": "During your Milestone 9 benchmark defense, an evaluator compares your engine's memory allocations against a row-based engine. While processing 5,000,000 rows, the row-based engine allocated 12 GB of temporary objects triggering 45 GC pauses. Your columnar engine allocated only 16 MB. Why did columnar vectorization eliminate garbage collection?",
      "options": [
        "The columnar engine disabled memory tracking.",
        "Reusable Fixed-Buffer Vector Pipelines: Vectorized engines reuse fixed-size typed array buffers (e.g. 1024 Float64 elements) across all operator iterations. No heap objects are created during query evaluation, yielding near-zero GC pressure regardless of table size.",
        "TypeScript runs in native assembly.",
        "The evaluator tested with an empty dataset."
      ],
      "answerIdx": 1,
      "debrief": "Vectorized engines achieve order-of-magnitude lower memory churn because operators stream batches through pre-allocated fixed-size vector buffers. This eliminates object allocations and GC pauses."
    },
    "quests": [
      {
        "id": "db-m2-d50-q1",
        "name": "Milestone 9 Architecture: Vectorized Columnar Engine Blueprint",
        "type": "concept",
        "desc": "Design columnar batch vectors, compression codecs, selection vector filters, and aggregate operators."
      },
      {
        "id": "db-m2-d50-q2",
        "name": "Detective Lab: Benchmarking Vectorized Memory Footprint & Throughput vs Row Iterators",
        "type": "detective",
        "desc": "Profile memory allocation rates, V8 garbage collection cycles, and queries per second across engines."
      },
      {
        "id": "db-m2-d50-q3",
        "name": "Mastery Assignment: Full TypeScript Vectorized Columnar Analytics Engine",
        "type": "assignment",
        "desc": "Implement the complete Milestone 9 engine supporting Parquet-style columnar chunks, RLE, and vectorized filters."
      },
      {
        "id": "db-m2-d50-q4",
        "name": "Production Incident Lab: Garbage Collection Pause Analytical Latency Spike Triage",
        "type": "detective",
        "desc": "Resolve a high-latency incident in a data warehouse pipeline caused by object churn during analytical queries."
      }
    ]
  },
  {
    "day": 51,
    "month": 2,
    "blockNum": 11,
    "title": "Disaster Recovery Architecture: WAL Archiving, Continuous Backup, Point-in-Time Recovery (PITR) & RPO/RTO",
    "stageName": "Stage 3: Autonomous Synthesis",
    "stageNum": 3,
    "pedagogicalRole": "Low Guidance (Disaster Recovery & Enterprise Durability)",
    "spokenGoal": "Architect enterprise database disaster recovery: formalize Recovery Point Objective (RPO - maximum acceptable data loss in seconds) and Recovery Time Objective (RTO - maximum acceptable restore downtime in minutes). Master Continuous Archiving (shipping 16MB WAL segment files to S3/GCS), base backups (`pg_basebackup`, pgBackRest), and Point-in-Time Recovery (PITR) to restore databases to the exact second before a catastrophic developer mistake.",
    "conceptInvariant": "PITR Deterministic Replay Invariant: Given a consistent physical base backup taken at time T0 and a complete, unbroken sequence of archived WAL segments from T0 to Target_Time T, replaying the WAL logs sequentially from T0 stops deterministically at T, reconstructing the exact bit-for-bit database state prior to corruption.",
    "failureMode": "Taking only nightly `pg_dump` logical backups: at 4:30 PM, a rogue migration script executes `DROP TABLE customers`. The team restores last night's 2:00 AM backup, irreversibly losing 14.5 hours of production financial transactions (violating a 5-minute RPO).",
    "tryItFriction": "Construct a PITR recovery orchestrator in TypeScript: take an initial database snapshot, record transactional operations to archived WAL files, simulate an accidental `DROP TABLE` at timestamp T_drop, and restore the engine to `T_drop - 1 second`.",
    "socraticHints": [
      "Why is `pg_dump` inadequate as a primary enterprise disaster recovery strategy?",
      "Because `pg_dump` takes a static snapshot in time and cannot capture subsequent transactions; any data created between backup runs is permanently lost!",
      "WAL Continuous Archiving records every transaction continuously, achieving an RPO of near-zero seconds."
    ],
    "situationalPuzzle": {
      "scenario": "At 11:42:15 AM, an engineer accidentally executes `UPDATE accounts SET balance = 0`. The database has continuous WAL archiving configured with pgBackRest. SRE initiates Point-in-Time Recovery. What recovery target configuration must they specify?",
      "options": [
        "Restore last week's backup.",
        "Target Time PITR: Set `recovery_target_time = '2026-10-11 11:42:14 UTC'` and `recovery_target_action = 'promote'`. The recovery engine restores the base backup and replays WAL records forward, halting exactly one second before the destructive UPDATE statement was committed.",
        "Delete the database and start over.",
        "Run an UPDATE statement setting balances back to 100."
      ],
      "answerIdx": 1,
      "debrief": "Point-in-Time Recovery allows restoring a database to any discrete second in history using WAL replay. Specifying a target timestamp immediately preceding the destructive transaction restores the database with zero transaction loss up to that exact moment."
    },
    "quests": [
      {
        "id": "db-m2-d51-q1",
        "name": "Disaster Recovery Framework: RPO, RTO, Base Backups & WAL Streaming Topologies",
        "type": "concept",
        "desc": "Formalize enterprise backup architectures, backup validation checksums, and multi-region replication."
      },
      {
        "id": "db-m2-d51-q2",
        "name": "Detective Lab: Executing Point-in-Time Recovery (PITR) with pgBackRest in Staging",
        "type": "detective",
        "desc": "Trigger data corruption, configure recovery_target_time, and verify data integrity post-restoration."
      },
      {
        "id": "db-m2-d51-q3",
        "name": "Mastery Assignment: TypeScript Automated WAL Archiver & PITR Recovery Engine",
        "type": "assignment",
        "desc": "Build a backup coordinator that archives WAL files, creates checkpoints, and executes targeted PITR replays."
      },
      {
        "id": "db-m2-d51-q4",
        "name": "Production Incident Lab: Production Accidental DROP TABLE 15-Minute Recovery War Room",
        "type": "detective",
        "desc": "Lead the emergency disaster recovery war room restoring an accidentally dropped billing table using PITR."
      }
    ]
  },
  {
    "day": 52,
    "month": 2,
    "blockNum": 11,
    "title": "Database Observability & Telemetry: pg_stat_statements, Wait Events, Lock Contention & P99 Latency Profiles",
    "stageName": "Stage 3: Autonomous Synthesis",
    "stageNum": 3,
    "pedagogicalRole": "Low Guidance (Observability Metrics & Wait Event Analysis)",
    "spokenGoal": "Instrument database internals for 24/7 reliability: master `pg_stat_statements` (normalized query fingerprinting, total exec time, mean exec time, shared buffer dirtied/read), analyze PostgreSQL Wait Events (`wait_event_type = 'Lock'`, `'IO'`, `'LWLock'`), decode OS-level disk metrics (`await`, `r/s`, `w/s`), and build real-time P99 latency dashboards.",
    "conceptInvariant": "Wait Event Root Cause Invariant: A database query is always in one of two states: 1) Working (consuming CPU cycles), or 2) Waiting (blocked on an external resource). Profiling active queries by Wait Event (`wait_event_type`) pinpoint the exact hardware or software bottleneck (Disk I/O, Row Lock, WAL Sync, or Buffer Pin).",
    "failureMode": "Diagnosing a slow database by looking only at overall server CPU utilization: when CPU is at 15%, the team assumes the database is fine, completely missing that 200 backend queries are blocked in `wait_event = 'transactionid'`, causing a total application freeze.",
    "tryItFriction": "Construct a PostgreSQL telemetry analyzer in TypeScript: parse `pg_stat_statements` and `pg_stat_activity` mock metrics, identify the top 5 queries by total I/O impact, and flag processes stalled on lock wait events.",
    "socraticHints": [
      "What is an `LWLock` (Lightweight Lock) in PostgreSQL?",
      "An in-memory synchronization primitive (similar to a mutex or rwlock) used to protect internal database shared memory data structures like buffer pool headers and WAL buffers!",
      "High `LWLock:BufferContent` indicates extreme contention on specific hot memory pages."
    ],
    "situationalPuzzle": {
      "scenario": "An API service experiences sudden P99 latency spikes from 10ms to 2,500ms. SRE runs `SELECT wait_event_type, wait_event, count(*) FROM pg_stat_activity GROUP BY 1, 2`. The top result is: `wait_event_type = 'IO', wait_event = 'DataFileRead' (count: 85)`. What is the primary bottleneck?",
      "options": [
        "Network packet loss.",
        "Disk I/O Buffer Pool Miss Bottleneck: 85 active backend processes are concurrently waiting for physical disk reads because requested pages are not in shared memory (buffer pool miss). The database is bottlenecked on disk read I/O, likely caused by cold cache, insufficient RAM, or unindexed full table scans.",
        "A CPU deadlock.",
        "PostgreSQL password expiration."
      ],
      "answerIdx": 1,
      "debrief": "`DataFileRead` wait events indicate that database workers are stalled waiting for disk reads. This points directly to storage I/O limits, missing indexes triggering sequential scans, or insufficient buffer pool memory."
    },
    "quests": [
      {
        "id": "db-m2-d52-q1",
        "name": "Observability Architecture: pg_stat_statements Metrics & Wait Event Taxonomy",
        "type": "concept",
        "desc": "Map Wait Event classifications (Activity, BufferPin, Client, Extension, IPC, Lock, LWLock, Timeout, IO)."
      },
      {
        "id": "db-m2-d52-q2",
        "name": "Detective Lab: Profiling Query Fingerprints & Identifying Top I/O Consumers with SQL",
        "type": "detective",
        "desc": "Write analytical SQL queries over pg_stat_statements to rank queries by mean_exec_time and buffer churn."
      },
      {
        "id": "db-m2-d52-q3",
        "name": "Mastery Assignment: TypeScript Real-Time Database Telemetry & SRE Alerting Agent",
        "type": "assignment",
        "desc": "Build an observability daemon that polls active sessions, aggregates wait events, and detects latency spikes."
      },
      {
        "id": "db-m2-d52-q4",
        "name": "Production Incident Lab: LWLock Contention Storm & Shared Memory Thrashing Triage",
        "type": "detective",
        "desc": "Triage a high-concurrency bottleneck caused by hot-page contention on buffer pool LWLocks."
      }
    ]
  },
  {
    "day": 53,
    "month": 2,
    "blockNum": 11,
    "title": "3 AM Incident War Room: Connection Pool Starvation, Cascading Failures & Thundering Herd Triage",
    "stageName": "Stage 4: Crucible & Viva",
    "stageNum": 4,
    "pedagogicalRole": "Open Challenge (High-Severity Production Incident Triage)",
    "spokenGoal": "Enter the 3 AM SRE War Room: diagnose and resolve a full database outage caused by Connection Pool Starvation and Cascading Failures. When a downstream microservice slows down, database connections stay open longer; connection pools exhaust, new requests back up, thread queues explode, and the thundering herd crashes the entire application cluster.",
    "conceptInvariant": "Fail-Fast Connection Deadline Invariant: Connection pools must enforce strict acquisition timeouts (e.g. 250ms) and database queries must enforce statement timeouts (`statement_timeout = 5s`). Under saturation, systems must reject excess traffic immediately at the edge rather than queuing requests and triggering cascading thread death.",
    "failureMode": "Setting connection acquisition timeout to infinite or 60 seconds: during a slight database slowdown, all 500 web threads block waiting for connections, stopping HTTP health checks, causing Kubernetes to kill and restart all pods simultaneously (Thundering Herd restart storm).",
    "tryItFriction": "Simulate a cascading connection collapse in TypeScript: simulate a 100ms database latency injection, observe how unconstrained client queues trigger thread pool exhaustion, and apply circuit breakers and adaptive concurrency limits to stabilize the system.",
    "socraticHints": [
      "What is the Thundering Herd problem in connection pools?",
      "When hundreds of blocked client threads simultaneously rush to acquire connections the instant a single connection becomes free, causing extreme CPU lock contention and crashing the pool manager!",
      "Use jitter and exponential backoff to smooth connection acquisition spikes."
    ],
    "situationalPuzzle": {
      "scenario": "During a flash sale, API servers throw `503 Service Unavailable`. SRE logs report: `TimeoutException: Connection is not available, request timed out after 30000ms`. Database CPU is only 20%. `pg_stat_activity` shows all 500 database connections are active, executing a slow unindexed query. How do you recover the system immediately?",
      "options": [
        "Increase max_connections to 5,000.",
        "Emergency Statement Timeout & Connection Kill: Run `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE query LIKE '%slow_unindexed_query%'` to terminate blocked backends, set an emergency `statement_timeout = '2s'` across the cluster, and deploy an index to eliminate the slow scan.",
        "Restart the Kubernetes cluster.",
        "Delete the connection pool."
      ],
      "answerIdx": 1,
      "debrief": "When slow queries exhaust connection pools, increasing `max_connections` worsens CPU thrashing. Immediate recovery requires terminating the stuck queries, setting a global `statement_timeout` to fail runaway queries, and fixing the query plan."
    },
    "quests": [
      {
        "id": "db-m2-d53-q1",
        "name": "Cascading Failure Mechanics: Little's Law, Queue Delay & Connection Exhaustion",
        "type": "concept",
        "desc": "Formalize queueing theory models of cascading failures and circuit breaker trip thresholds."
      },
      {
        "id": "db-m2-d53-q2",
        "name": "Detective Lab: Simulating Connection Starvation with k6 & Diagnosing Thread Dumps",
        "type": "detective",
        "desc": "Generate synthetic traffic loads that induce pool starvation and analyze backend wait queue latencies."
      },
      {
        "id": "db-m2-d53-q3",
        "name": "Mastery Assignment: Adaptive Concurrency Limiter & Circuit Breaker Proxy in TypeScript",
        "type": "assignment",
        "desc": "Build an intelligent database proxy that applies Vegas/AIMD adaptive concurrency limits to prevent pool collapse."
      },
      {
        "id": "db-m2-d53-q4",
        "name": "3 AM War Room: Resolving Black Friday Cascading Connection Outage in 15 Minutes",
        "type": "detective",
        "desc": "Execute emergency mitigation protocols during a live simulated high-severity production outage."
      }
    ]
  },
  {
    "day": 54,
    "month": 2,
    "blockNum": 11,
    "title": "3 AM Incident War Room: Transaction ID (XID) Wraparound Catastrophe, Frozen XIDs & Emergency Vacuuming",
    "stageName": "Stage 4: Crucible & Viva",
    "stageNum": 4,
    "pedagogicalRole": "Open Challenge (Existential Database Threat Response)",
    "spokenGoal": "Confront the single most terrifying failure in PostgreSQL: Transaction ID (XID) Wraparound. Understand how the 32-bit transaction counter (max 4.2 billion transactions) requires modulo comparison, how active transactions are compared against past vs future, why failing to freeze old XIDs causes PostgreSQL to shut down into emergency read-only mode to prevent catastrophic data loss, and execute emergency single-user recovery.",
    "conceptInvariant": "XID Wraparound Safety Invariant: PostgreSQL transaction IDs are 32-bit unsigned integers. At 2 billion transactions, past transactions wrap around and appear to be in the future (invisible). To prevent data disappearance, autovacuum must 'freeze' old tuples (setting `HEAP_XMIN_FROZEN`). If `txid_current() - datfrozenxid >= 2,000,000,000`, the server shuts down immediately.",
    "failureMode": "Disabling or severely throttling autovacuum on a high-throughput database processing 500 million transactions per month: after 4 months, the database reaches 2.1 billion transactions, hits the wraparound safety threshold, terminates all write connections, and enters forced emergency shutdown.",
    "tryItFriction": "Build an XID Wraparound monitor in TypeScript: calculate transaction consumption rates, track `datfrozenxid` distance from the 2-billion limit across mock databases, and trigger emergency freeze alerts at 75% threshold.",
    "socraticHints": [
      "Why does PostgreSQL refuse to accept writes when XID wraparound threshold is reached?",
      "Because accepting even one more transaction would cause millions of historical committed rows to be treated as 'future uncommitted transactions', permanently disappearing from user queries!",
      "Emergency shutdown prevents irreversible silent data loss."
    ],
    "situationalPuzzle": {
      "scenario": "At 3:15 AM, a tier-1 production database shuts down with the log: 'FATAL: database is not accepting commands to avoid wraparound data loss in database \"production\". HINT: Stop the postmaster and vacuum that database in single-user mode.' What emergency procedure must the principal DBA execute?",
      "options": [
        "Delete the database directory.",
        "Single-User Mode Emergency Vacuum Freeze: Stop PostgreSQL, launch the server in single-user mode (`postgres --single -D /data production`), and execute an aggressive freeze vacuum (`VACUUM FREEZE ANALYZE;`). Once old transaction IDs are frozen, restart the database in normal multi-user mode.",
        "Upgrade the hardware CPU.",
        "Reset the server clock back 10 years."
      ],
      "answerIdx": 1,
      "debrief": "When a database enters forced wraparound shutdown, standard multi-user connections are blocked. The only recovery path is starting the PostgreSQL binary in single-user maintenance mode to run `VACUUM FREEZE`, which marks past tuples as frozen and advances `datfrozenxid`."
    },
    "quests": [
      {
        "id": "db-m2-d54-q1",
        "name": "32-Bit Transaction ID Wraparound Mathematics & Frozen Tuple Flags",
        "type": "concept",
        "desc": "Derive modulo 2^32 transaction comparison math and inspect HEAP_XMIN_FROZEN tuple header bits."
      },
      {
        "id": "db-m2-d54-q2",
        "name": "Detective Lab: Auditing Age of Datfrozenxid across Tables with pg_database",
        "type": "detective",
        "desc": "Query `SELECT datname, age(datfrozenxid) FROM pg_database;` and calculate days until wraparound."
      },
      {
        "id": "db-m2-d54-q3",
        "name": "Mastery Assignment: TypeScript XID Consumption Monitor & Autonomous Freeze Scheduler",
        "type": "assignment",
        "desc": "Build an automated monitor that tracks XID burn rates and dynamically tunes vacuum freeze aggressive parameters."
      },
      {
        "id": "db-m2-d54-q4",
        "name": "3 AM War Room: Single-User Mode Emergency Vacuum Freeze Recovery Under Outage Pressure",
        "type": "detective",
        "desc": "Execute single-user recovery on an XID wraparound-halted database to bring production back online."
      }
    ]
  },
  {
    "day": 55,
    "month": 2,
    "blockNum": 11,
    "title": "\u2b50 MILESTONE 10: Autonomous Database SRE Watchdog Engine with Real-Time Lock & Slow Query Telemetry",
    "stageName": "Stage 4: Crucible & Viva",
    "stageNum": 4,
    "pedagogicalRole": "Balanced Friction (Milestone Gate: Autonomous SRE Engine)",
    "spokenGoal": "Assemble Milestone 10: Build an Autonomous Database SRE Watchdog Engine in TypeScript. Ingest real-time telemetry from active database sessions, detect lock contention chains and deadlocks, flag runaway queries exceeding SLA deadlines, calculate table bloat and XID burn rates, and execute automated remediation actions (canceling stuck queries, issuing vacuum alerts, and shedding non-critical traffic).",
    "conceptInvariant": "Autonomous Remediation Safety Invariant: The watchdog engine must never kill queries indiscriminately. It must identify the root blocker in a lock dependency graph, verify that the query has exceeded its configured safety threshold (e.g. holding locks > 30s), and terminate strictly the minimal blocker process while preserving transaction safety.",
    "failureMode": "Killing the victim queries waiting for a lock instead of the root blocker: the blocker continues running, and incoming queries immediately block again, keeping the database in a permanent outage loop.",
    "tryItFriction": "Pass the Milestone 10 validation suite: deploy your watchdog agent against a simulated cluster under 10 concurrent failure scenarios (deadlocks, pool exhaustion, XID risk, slow scans), verifying 100% automated root-cause detection and mitigation.",
    "socraticHints": [
      "How does the watchdog determine which query in a 50-query lock chain is the root blocker?",
      "By constructing a directed graph of `blocking_pid -> blocked_pid` and finding the root node that has in-degree 0 and out-degree > 0!",
      "Terminating the root node frees all 49 downstream waiting queries instantly."
    ],
    "situationalPuzzle": {
      "scenario": "Your Milestone 10 watchdog detects 80 blocked queries. Query A blocks Query B, which blocks Query C, which blocks 77 other queries. Query A has been running for 4 minutes inside an idle transaction (`idle in transaction`). What action must the watchdog execute?",
      "options": [
        "Kill all 80 queries.",
        "Terminate Root Idle Transaction: Terminate Query A (`SELECT pg_terminate_backend(A.pid)`). Because Query A is the root ancestor holding row/table locks while idle, killing A immediately releases all locks, allowing B, C, and all 77 other queries to proceed with zero further errors.",
        "Restart the database.",
        "Increase connection pool limits."
      ],
      "answerIdx": 1,
      "debrief": "In a cascading lock wait chain, all blocked queries are victims of a single root blocker. The SRE watchdog must traverse the wait-for tree to identify and terminate strictly the root blocker."
    },
    "quests": [
      {
        "id": "db-m2-d55-q1",
        "name": "Milestone 10 Architecture: Autonomous Watchdog Engine Blueprint",
        "type": "concept",
        "desc": "Design telemetry pollers, lock graph root-blocker resolvers, threshold rules, and automated kill switches."
      },
      {
        "id": "db-m2-d55-q2",
        "name": "Detective Lab: Auditing Lock Wait Chains & Root Blockers with pg_blocking_pids()",
        "type": "detective",
        "desc": "Write recursive SQL queries over pg_blocking_pids() to trace multi-level lock dependency trees."
      },
      {
        "id": "db-m2-d55-q3",
        "name": "Mastery Assignment: Full TypeScript Autonomous Database SRE Watchdog Agent",
        "type": "assignment",
        "desc": "Build the complete Milestone 10 watchdog agent with real-time lock graph analysis and auto-remediation."
      },
      {
        "id": "db-m2-d55-q4",
        "name": "Production Incident Lab: 3 AM Automated Lock Blocker Termination War Room",
        "type": "detective",
        "desc": "Test the watchdog under simulated production failure conditions and verify zero false-positive kills."
      }
    ]
  },
  {
    "day": 56,
    "month": 2,
    "blockNum": 12,
    "title": "Distributed Consistency Models: CAP Theorem, PACELC, Linearizability & Strict Serializability",
    "stageName": "Stage 4: Crucible & Viva",
    "stageNum": 4,
    "pedagogicalRole": "Low Guidance (Formal Consistency & Distributed Theory)",
    "spokenGoal": "Reach the theoretical peak of distributed systems: deconstruct Brewer's CAP Theorem, master Abadi's PACELC Theorem (If Partition: Availability vs Consistency; Else: Latency vs Consistency), formalize Linearizability (real-time order of single-object operations), Serializability (multi-operation transaction order), and the gold standard: Strict Serializability (External Consistency).",
    "conceptInvariant": "Strict Serializability Invariant (Linearizability + Serializability): Transactions execute as if in a global serial order, AND if Transaction T2 begins after Transaction T1 commits in absolute real-world time, T2's serial order must strictly follow T1. No client can ever observe time-travel or stale state across global boundaries.",
    "failureMode": "Assuming a database claiming 'Serializable' provides real-time ordering across distributed nodes: without linearizability, a user writes a comment on US-East, calls their friend in EU-West, and the friend reads the database and sees no comment because the serial order placed the read before the write in logical time.",
    "tryItFriction": "Build a consistency model simulator in TypeScript: model concurrent client operations across distributed nodes, test histories against Linearizability and Serializability checkers, and detect non-linearizable stale read violations.",
    "socraticHints": [
      "What is the difference between Linearizability and Serializability?",
      "Serializability is a multi-operation, multi-object transactional property with NO real-time clock constraint; Linearizability is a real-time recency guarantee on individual objects!",
      "Strict Serializability combines both: transactions are serializable and respect physical real-world time order."
    ],
    "situationalPuzzle": {
      "scenario": "A distributed database claims 'Serializable' isolation. Transaction 1 deposits $100 in Tokyo at 12:00:00 UTC and commits. Transaction 2 checks the balance in New York at 12:00:01 UTC and sees $0. The database vendor claims this does not violate Serializability. Why is the vendor technically correct?",
      "options": [
        "The vendor is lying.",
        "Serializability Lacks Real-Time Clocks: Standard Serializability only guarantees that THERE EXISTS SOME serial order that explains the execution. If the database orders T2 before T1 logically, the history is still technically serializable, even though it violates physical real-world time! Only Strict Serializability (External Consistency) enforces real-world physical time order.",
        "Tokyo is in a different time zone.",
        "The deposit was cancelled."
      ],
      "answerIdx": 1,
      "debrief": "Standard Serializability guarantees logical equivalence to a sequential order, but places zero constraints on physical time. A database that orders an afternoon transaction before a morning transaction can still be validly Serializable unless it also guarantees Linearizability (Strict Serializability)."
    },
    "quests": [
      {
        "id": "db-m2-d56-q1",
        "name": "Consistency Spectrum: Linearizability vs Sequential vs Causal vs Eventual Consistency",
        "type": "concept",
        "desc": "Map the formal hierarchy of distributed consistency models and their latency trade-offs."
      },
      {
        "id": "db-m2-d56-q2",
        "name": "Detective Lab: Auditing Consistency Models with Jepsen Test Case Analyses",
        "type": "detective",
        "desc": "Deconstruct published Jepsen test reports on MongoDB, CockroachDB, and Cassandra to identify consistency leaks."
      },
      {
        "id": "db-m2-d56-q3",
        "name": "Mastery Assignment: TypeScript Linearizability & History Validation Checker",
        "type": "assignment",
        "desc": "Build an execution history validator that parses concurrent client read/write traces and checks linearizability."
      },
      {
        "id": "db-m2-d56-q4",
        "name": "Production Incident Lab: Stale Read Cross-Region Order Inversion Customer Dispute Triage",
        "type": "detective",
        "desc": "Resolve a high-severity customer dispute caused by non-linearizable reads across global database replicas."
      }
    ]
  },
  {
    "day": 57,
    "month": 2,
    "blockNum": 12,
    "title": "Google Spanner & TrueTime API: Atomic Clocks, GPS Antennas, Uncertainty Bound \u03b5 & Commit Wait",
    "stageName": "Stage 4: Crucible & Viva",
    "stageNum": 4,
    "pedagogicalRole": "Low Guidance (Hardware Synchronized Distributed Clocks)",
    "spokenGoal": "Study Google Spanner's breakthrough architecture: understand why physical wall-clock time is unreliable in distributed systems (NTP drift of 100ms+), dissect Google's TrueTime API backed by datacenter GPS antennas and atomic rubidium clocks, and master the TrueTime Uncertainty Bound $[t_{earliest}, t_{latest}]$ with uncertainty $\\epsilon \\approx 1-7\\text{ms}$ and the Commit Wait rule that guarantees globally linearizable ACID transactions across continents.",
    "conceptInvariant": "TrueTime Commit Wait Invariant: A transaction with commit timestamp $s$ must not release its locks or return success to the client until the leader is guaranteed that absolute physical time has passed $s$ ($t_{latest} > s$, waiting $2\\epsilon$). This guarantees that any transaction starting after this commit in real time will receive a timestamp strictly greater than $s$, enforcing global linearizability without cross-region consensus on reads.",
    "failureMode": "Relying on standard NTP clocks for distributed transaction timestamps: clock drift of 150ms between two datacenters causes transactions to commit with timestamps in the past, corrupting MVCC snapshot visibility and reversing the order of financial transactions.",
    "tryItFriction": "Implement a TrueTime simulator in TypeScript: model physical time with uncertainty intervals $[now - \\epsilon, now + \\epsilon]$, implement the Commit Wait algorithm, and prove that transactions across simulated global nodes achieve 100% strict serializability.",
    "socraticHints": [
      "Why does Google Spanner require atomic clocks in every datacenter alongside GPS?",
      "Because GPS antennas and satellite receivers can fail or lose signal (antenna failure, solar flare, spoofing); atomic clocks drift independently at predictable, microscopic rates, keeping $\\epsilon$ strictly bounded during GPS outages!",
      "Dual time sources guarantee fail-safe bounded uncertainty."
    ],
    "situationalPuzzle": {
      "scenario": "A Spanner transaction begins commit processing. TrueTime reports `now() = [100, 108]` (uncertainty $\\epsilon = 4\\text{ms}$). The leader chooses commit timestamp $s = 108$. How long must the leader wait before releasing locks and notifying the client of commit success?",
      "options": [
        "It can commit immediately.",
        "Commit Wait of 2\u03b5 (Waiting until earliest > 108): The leader must wait until `TrueTime.now().earliest > 108` (at least 8ms, or $2\\epsilon$). By waiting out the clock uncertainty, Spanner guarantees that any future transaction anywhere in the world will receive a TrueTime interval whose earliest bound is $> 108$, making timestamp order match physical real-world order.",
        "It must wait for 10 minutes.",
        "It must contact all datacenters."
      ],
      "answerIdx": 1,
      "debrief": "The Commit Wait rule is Spanner's core innovation. By intentionally pausing for the clock uncertainty window ($2\\epsilon$), Spanner guarantees that no future transaction can ever obtain a timestamp equal to or earlier than $s$, achieving global external consistency."
    },
    "quests": [
      {
        "id": "db-m2-d57-q1",
        "name": "Google Spanner Architecture: Paxos Groups, TrueTime & Two-Phase Locking",
        "type": "concept",
        "desc": "Deconstruct Spanner directory management, tablet replication, and lock-free snapshot reads."
      },
      {
        "id": "db-m2-d57-q2",
        "name": "Detective Lab: Profiling Clock Skew & Drift in Cloud Virtual Machines with chrony",
        "type": "detective",
        "desc": "Measure microsecond-level clock drift across multi-region cloud instances and calculate uncertainty bounds."
      },
      {
        "id": "db-m2-d57-q3",
        "name": "Mastery Assignment: TypeScript TrueTime API & Commit Wait Protocol Engine",
        "type": "assignment",
        "desc": "Build a simulated TrueTime provider and transactional coordinator enforcing commit wait invariants."
      },
      {
        "id": "db-m2-d57-q4",
        "name": "Production Incident Lab: NTP Desynchronization Cross-Region Split-Brain Crisis Triage",
        "type": "detective",
        "desc": "Resolve a high-severity transactional timestamp anomaly caused by an NTP server desynchronization."
      }
    ]
  },
  {
    "day": 58,
    "month": 2,
    "blockNum": 12,
    "title": "Polyglot Persistence & Staff Database RFC: Workload Classification & Storage Engine Selection",
    "stageName": "Stage 4: Crucible & Viva",
    "stageNum": 4,
    "pedagogicalRole": "Low Guidance (Staff Database Architecture & RFC Design)",
    "spokenGoal": "Operate at the Principal / Staff Database Architect level: author a definitive Technical Architecture RFC for a global enterprise. Classify application workloads by Read/Write ratio, latency sensitivity, consistency requirements, and data volume. Defend polyglot persistence storage engine selection across Relational (PostgreSQL), Key-Value (RocksDB/Redis), Document (MongoDB), Columnar OLAP (ClickHouse/Parquet), and Globally Distributed (CockroachDB/Spanner).",
    "conceptInvariant": "Architectural Workload Matching Invariant: No single database engine excels at all workloads. Relational OLTP engines maximize transactional integrity for complex schemas; Columnar engines maximize analytical scan throughput; Key-Value LSM engines maximize write ingest. A mature architecture routes workloads to specialized engines connected by transactional CDC pipelines.",
    "failureMode": "Adopting a single database vendor for all enterprise needs: using MongoDB for financial ledger accounting or using PostgreSQL for 500-billion-event analytical metrics, leading to multi-million-dollar infrastructure costs and catastrophic system degradation.",
    "tryItFriction": "Author a comprehensive 10-page Staff Database RFC in TypeScript/Markdown specifying the data storage architecture for a global fintech platform processing 100,000 TPS OLTP, 50,000 TPS IoT streams, and petabyte-scale analytical queries.",
    "socraticHints": [
      "What are the 4 fundamental axes for evaluating database storage engines?",
      "1) Access Pattern (Point vs Range vs Full Scan), 2) Read/Write Ratio, 3) Consistency vs Availability requirements (CAP/PACELC), and 4) Scalability & Operability costs!",
      "A staff engineer evaluates databases on quantitative operational trade-offs, never hype."
    ],
    "situationalPuzzle": {
      "scenario": "A startup CTO proposes migrating all backend services from PostgreSQL to a NoSQL document database 'because document databases scale infinitely and don't need migrations'. As the Staff Database Architect, how do you evaluate and challenge this decision in an RFC?",
      "options": [
        "Agree and migrate immediately.",
        "Principled Workload & Trade-off Defense: Document stores sacrifice ACID cross-document transactions, relational joins, and strict schema validation. For core business entities (users, billing, inventory), schema evolution without DDL creates silent runtime corruption ('Schema on Read' nightmare). Recommend keeping PostgreSQL for transactional core while offloading high-volume unstructured logs to dedicated storage.",
        "Resign from the company.",
        "Rewrite the database in C++."
      ],
      "answerIdx": 1,
      "debrief": "A Staff Architect defends architectural decisions using concrete trade-offs. 'NoSQL scales infinitely' is a fallacy; NoSQL systems trade relational integrity, multi-record transactions, and declarative query power for horizontal partitionability."
    },
    "quests": [
      {
        "id": "db-m2-d58-q1",
        "name": "Enterprise Database RFC Template: Workload Classification & Decision Matrix",
        "type": "concept",
        "desc": "Define criteria for RPO/RTO, TPS, latency SLAs, storage costs, and consistency levels across database engines."
      },
      {
        "id": "db-m2-d58-q2",
        "name": "Detective Lab: Cost & Latency Benchmark Analysis across Polyglot Storage Engines",
        "type": "detective",
        "desc": "Compare total cost of ownership (TCO) and P99 latency profiles across cloud-managed database offerings."
      },
      {
        "id": "db-m2-d58-q3",
        "name": "Mastery Assignment: Staff Architecture RFC: Global Fintech Sovereign Data Platform",
        "type": "assignment",
        "desc": "Author the complete enterprise database architecture RFC specifying polyglot storage topologies and CDC flows."
      },
      {
        "id": "db-m2-d58-q4",
        "name": "Executive Review: Defending the Polyglot Database RFC before VP of Engineering Panel",
        "type": "detective",
        "desc": "Defend database selection, CAP trade-offs, and migration roadmaps in an executive architecture defense."
      }
    ]
  },
  {
    "day": 59,
    "month": 2,
    "blockNum": 12,
    "title": "Database Chaos Engineering: Network Partitions, Asymmetric Drops & Disk Stalls (Jepsen-Style Testing)",
    "stageName": "Stage 4: Crucible & Viva",
    "stageNum": 4,
    "pedagogicalRole": "Open Challenge (Chaos Engineering & Fault Injection)",
    "spokenGoal": "Battle-test database resilience using Kyle Kingsbury's Jepsen methodology: design chaos testing suites that inject real-world network partitions (bipartite splits, isolated majorities, network bridges), asymmetric packet drops, clock skews, process pauses (`SIGSTOP`/`SIGCONT`), and simulated disk I/O stalls. Verify that your distributed database maintains consistency invariants without data loss or split-brain under adversarial conditions.",
    "conceptInvariant": "Adversarial Invariant Verification: A distributed database's safety guarantees cannot be proven through happy-path testing alone. Under arbitrary network partitions and process stalls, the database must strictly preserve its safety invariants: it may reject writes (sacrificing availability), but it must NEVER return acknowledged writes that are later lost, and it must NEVER serve corrupted divergent state.",
    "failureMode": "Deploying a distributed database to production after only running unit tests: the first real-world network switch flapping incident causes the cluster to accept conflicting writes and lose 5,000 committed customer orders.",
    "tryItFriction": "Build a Jepsen-style Chaos Test Harness in TypeScript: deploy a 5-node distributed cluster, inject randomized network partitions and clock skews while running 100 concurrent transactional clients, and verify linearizability using an automated history checker.",
    "socraticHints": [
      "What is an Asymmetric Network Partition?",
      "When Node A can send packets to Node B, but Node B cannot send packets back to Node A (unidirectional network drop)!",
      "Asymmetric partitions frequently break naive heartbeat and consensus implementations."
    ],
    "situationalPuzzle": {
      "scenario": "During Jepsen chaos testing of a distributed database, a network partition isolates the leader. The client receives `TimeoutException` on an `INSERT` statement. When the partition heals, the client checks if the record was inserted. The record DOES exist in the database! Did the database violate consistency?",
      "options": [
        "Yes, the database has a fatal bug.",
        "No, At-Least-Once Timeout Ambiguity: A `TimeoutException` means the client did not receive an acknowledgment before timing out; it does NOT mean the operation failed! The leader may have committed the write to quorum before the partition severed the client response. Distributed systems must handle ambiguous timeouts via idempotent client retries.",
        "The record was created by another user.",
        "The network reversed the packets."
      ],
      "answerIdx": 1,
      "debrief": "In distributed systems, a network timeout is ambiguous: the write may have committed, aborted, or still be in flight. Applications interacting with distributed databases must use idempotent transaction tokens to safely retry timed-out operations."
    },
    "quests": [
      {
        "id": "db-m2-d59-q1",
        "name": "Jepsen Testing Methodology: Nemesis Generators, Invariant Checkers & Fault Models",
        "type": "concept",
        "desc": "Formalize fault injection types: network partitions, process pauses, clock jumps, and disk stalls."
      },
      {
        "id": "db-m2-d59-q2",
        "name": "Detective Lab: Deconstructing Real Jepsen Test Failures in Popular Distributed Databases",
        "type": "detective",
        "desc": "Analyze historical Jepsen reports documenting dirty reads and data loss under network partitions."
      },
      {
        "id": "db-m2-d59-q3",
        "name": "Mastery Assignment: TypeScript Jepsen-Style Chaos Testing Framework for Distributed Clusters",
        "type": "assignment",
        "desc": "Build an automated chaos testing harness with randomized nemeses and linearizability verification."
      },
      {
        "id": "db-m2-d59-q4",
        "name": "Production Incident Lab: Network Switch Flapping Dual-Leader Catastrophe Postmortem",
        "type": "detective",
        "desc": "Perform postmortem root-cause analysis on a real-world multi-datacenter network flapping disaster."
      }
    ]
  },
  {
    "day": 60,
    "month": 2,
    "blockNum": 12,
    "title": "\ud83c\udfc6 CAPSTONE 2 / MASTER GATEWAY: TitanDB \u2014 Globally Distributed Sovereign Database Engine",
    "stageName": "Stage 4: Crucible & Viva",
    "stageNum": 4,
    "pedagogicalRole": "Open Challenge (Month 2 Master Gateway Viva Gate)",
    "spokenGoal": "Defend Month 2 Master Gateway: Deliver and defend 'TitanDB', an enterprise-grade Globally Distributed Sovereign Database Engine in TypeScript. Synthesize all 60 days of database engineering: LSM-Tree storage with leveled compaction, Raft consensus replication, horizontal sharding with consistent hashing, vectorized columnar execution, TrueTime-style commit wait, and autonomous SRE watchdog monitoring.",
    "conceptInvariant": "TitanDB Global Sovereignty Invariant: TitanDB must guarantee Strict Serializability across multi-node clusters, sustain high-throughput write streams via LSM architecture, deliver sub-second analytical queries via vectorized columnar execution, survive arbitrary node crashes with automated Raft leader election, and withstand adversarial Jepsen chaos injection with zero data loss.",
    "failureMode": "Failing the Master Gateway Crucible: submitting a database engine where a network partition induces split-brain, where LSM compaction corrupts tombstones, or where the candidate fails to defend concurrency invariants before the senior faculty review panel.",
    "tryItFriction": "Pass the TitanDB Master Crucible battery: process 100,000 mixed OLTP and OLAP transactions across a 7-node distributed cluster under active chaos fault injection, verify 100% linearizability, and defend design trade-offs in an exhaustive 2-hour Master Viva.",
    "socraticHints": [
      "What is the ultimate mark of a Master Database Engineer?",
      "Understanding that every database guarantee is a conscious architectural trade-off: latency vs consistency, write throughput vs read speed, hardware cost vs fault tolerance!",
      "Mastery is the ability to choose, defend, and implement the optimal trade-off for any mission-critical system."
    ],
    "situationalPuzzle": {
      "scenario": "During your TitanDB Master Viva defense, the panel injects a simultaneous 3-node network partition and a simulated 50ms clock skew while your engine processes a 500-transaction distributed money transfer batch. TitanDB pauses writes on the minority partition, commits transactions on the majority partition using commit wait, and heals without data loss or double-spend upon network reconnection. What core principles did your engine validate?",
      "options": [
        "Luck and coincidence.",
        "Mastery of Distributed Consensus, Commit Wait & CAP Guarantees: The minority partition correctly rejected writes due to lack of Raft quorum (preserving Safety over Availability). The majority partition maintained linearizability via Raft consensus and TrueTime commit wait. Reconnection resolved cleanly via log replication, proving TitanDB's architectural excellence.",
        "The computer had sufficient battery.",
        "TypeScript runs transactions atomically by default."
      ],
      "answerIdx": 1,
      "debrief": "TitanDB validates the pinnacle of modern database engineering: distributed consensus (Raft) guarantees single-leader authority and partition tolerance; TrueTime-style commit wait guarantees real-world linearizability; and rigorous state machine replication ensures zero data loss."
    },
    "quests": [
      {
        "id": "db-m2-d60-q1",
        "name": "TitanDB Master System Architecture & Global Topology Blueprint",
        "type": "concept",
        "desc": "Document the complete multi-layer architecture: Storage Engine, Consensus Engine, Query Router, and SRE Watchdog."
      },
      {
        "id": "db-m2-d60-q2",
        "name": "Detective Lab: TitanDB Master Verification: 100,000 Transaction Chaos Crucible Audit",
        "type": "detective",
        "desc": "Execute automated verification suites under active chaos injection, proving zero data loss and strict serializability."
      },
      {
        "id": "db-m2-d60-q3",
        "name": "Mastery Assignment: TitanDB Globally Distributed Sovereign Database Engine Complete Implementation",
        "type": "assignment",
        "desc": "Assemble and deliver the complete production-grade TitanDB TypeScript distributed database engine."
      },
      {
        "id": "db-m2-d60-q4",
        "name": "Master Gateway Viva: Defending TitanDB Distributed Architecture before Senior Faculty Panel",
        "type": "detective",
        "desc": "Defend architectural design decisions, consensus invariants, and failure recovery protocols in the Master Viva."
      }
    ]
  }
];
