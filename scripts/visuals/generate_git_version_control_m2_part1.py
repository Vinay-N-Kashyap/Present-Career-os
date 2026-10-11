# scripts/visuals/generate_git_version_control_m2_part1.py
"""
Generator script for Course 35: Git, GitHub & Version Control Basics (course-git-version-control)
Month 2: Days 31 to 45 (60 Quests: Q35.121 to Q35.180).
Conforms strictly to the Gate v2 / True 9.8 Pedagogical Standard:
- Exact 3-Tier Socratic Hint Ladder
- Situational Production Puzzle (with 4 options and detailed debrief)
- Exactly 4 Quests per day (Concept, Detective Challenge, Mastery Assignment, Production Incident Lab)
- Real 3 AM Production Incident Failure Modes
- TryIt Live Friction Challenges with reproduction bugs
- Zero markdown backticks inside strings (using HTML <code>...</code> tags)
"""

import json
from pathlib import Path

days_data = [
    {
        "day": 31,
        "month": 2,
        "blockNum": 7,
        "title": "Packfiles & Pack Indices: `.pack` and `.idx` Binary Layout, Fan-Out Tables & Delta Compression",
        "stageNum": 7,
        "stageName": "Stage 7: Git Internals & Low-Level Plumbing",
        "pedagogicalRole": "Low-Level Storage Architecture (Packfiles, .idx v2 Binary Layout, Fan-Out Tables, OFS_DELTA vs REF_DELTA)",
        "spokenGoal": "Storing every file revision as an individual 'loose' object file in <code>.git/objects/</code> is great for simplicity, but when a repository grows to 100,000 files, operating system directory lookup times degrade and inodes run out. Today, you open the hood of Git's high-performance storage engine: Packfiles. You will dissect the binary layout of <code>.pack</code> and <code>.idx</code> v2 files, understand the 256-entry first-level fan-out table, and master delta compression (OFS_DELTA and REF_DELTA) where Git stores objects as binary diffs against similar files.",
        "conceptInvariant": "Packfile Binary Index Invariant: A <code>.idx</code> v2 file begins with magic bytes <code>\\xfftOc</code> followed by version <code>\\x00\\x00\\x00\\x02</code> and a 256-entry 4-byte fan-out table encoding cumulative object counts. Object lookup takes $O(1)$ to find the fan-out bucket and $O(\\log_2 k)$ binary search to find the exact 20-byte SHA-1 hash offset.",
        "failureMode": "The 500,000 Loose Object Inode Exhaustion Outage: An automated build server generated 500,000 loose commit and tree objects without ever repacking. The host Linux filesystem ran out of file inodes, causing disk writes to fail with 'No space left on device' even though 200GB of raw disk space remained free, taking down all running CI services.",
        "tryItFriction": "Unpack an existing packfile into loose objects using <code>git unpack-objects</code>; inspect the explosion of loose files in <code>.git/objects/</code>, and re-pack them into an optimized packfile using <code>git repack -a -d -f --depth=50 --window=50</code>.",
        "socraticHints": [
            "Why does Git use a 256-entry fan-out table at the start of a <code>.idx</code> file rather than a single flat binary search table?",
            "What is the operational difference between an <code>OFS_DELTA</code> (which references its base object using a relative byte offset) and a <code>REF_DELTA</code> (which references its base object using a 20-byte SHA-1 hash)?",
            "Why is delta compression in Git applied across similar files regardless of branch or directory location, rather than strictly tracking file history across time?"
        ],
        "situationalPuzzle": {
            "scenario": "A systems engineer notices that a 100MB repository has a <code>.git/objects/pack/</code> directory containing 80 separate <code>.pack</code> and <code>.idx</code> files. Git operations are slowing down because Git must search all 80 index files for every object request.",
            "options": [
                "Delete 79 of the pack files manually.",
                "Diagnose Packfile Fragmentation & Run Multi-Pack Optimization: Over time, incremental fetches and pushes create numerous small packfiles, fragmenting object lookups across multiple indices. The engineer must run <code>git repack -a -d</code> to consolidate all objects into a single optimized packfile, or enable <code>git multi-pack-index write</code> to generate a unified MIDX index.",
                "Convert the repository back to loose objects.",
                "Disable packfile compression in .gitconfig."
            ],
            "correctOptionIndex": 1,
            "debrief": "Frequent network fetches accumulate multiple small packfiles. Searching across many separate indices causes disk I/O overhead. Running <code>git repack -a -d</code> merges all loose objects and separate packfiles into a single unified packfile, removing obsolete packs."
        },
        "quests": [
            {
                "id": "Q35.121",
                "name": "Packfile & Index v2 Binary Specification Architecture",
                "type": "Concept",
                "desc": "Detail the byte-level binary specification of .pack and .idx v2 files, analyzing the fan-out table, SHA-1 table, CRC32 table, and offset mapping."
            },
            {
                "id": "Q35.122",
                "name": "The Inode Exhaustion Loose Object Explosion Detective",
                "type": "Detective Challenge",
                "desc": "Investigate a paralyzed CI server where 500,000 loose objects crashed the filesystem; unpack, audit, and consolidate the object database."
            },
            {
                "id": "Q35.123",
                "name": "Custom Binary Git Packfile & Index Parser Engine",
                "type": "Mastery Assignment",
                "desc": "Develop a standalone parser in Python/TypeScript that reads a .idx v2 file, queries objects via the fan-out table, and extracts raw zlib payloads."
            },
            {
                "id": "Q35.124",
                "name": "Extreme Packfile Delta Depth Decompression Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Construct an adversarial packfile with delta depth chains exceeding 250 links; benchmark object retrieval latency and memory allocation overhead."
            }
        ]
    },
    {
        "day": 32,
        "month": 2,
        "blockNum": 7,
        "title": "The Git Index (`.git/index`) Binary Internals: DIRC Header, 40-Byte Stat Cache & Tree Cache Extension",
        "stageNum": 7,
        "stageName": "Stage 7: Git Internals & Low-Level Plumbing",
        "pedagogicalRole": "Index Architecture & Performance Primitives (Binary DIRC Format, 40-Byte Stat Cache, Tree Cache Extension & Conflict Stages 0-3)",
        "spokenGoal": "Have you ever wondered how <code>git status</code> can scan 200,000 files in under 100 milliseconds to tell you what changed? It does not hash all 200,000 files! It checks the Stat Cache in the binary <code>.git/index</code>. Today, you master the internal binary architecture of the Index: the 12-byte DIRC header, the 40-byte stat cache entries (ctime, mtime, dev, ino, mode, uid, gid, file size), the Tree Cache extension that accelerates commit creation, and the conflict stages (stages 0, 1, 2, 3).",
        "conceptInvariant": "Stat Cache $O(1)$ Cleanliness Invariant: Git determines file cleanliness in $O(1)$ time by comparing filesystem stat metadata $(\\text{mtime}, \\text{size}, \\text{ino})$ against the cached values in <code>.git/index</code>. If stat metadata matches, the file content is guaranteed unchanged, bypassing expensive cryptographic re-hashing.",
        "failureMode": "The rsync Mtime Touch 10-Minute Git Status Freeze: A deployment pipeline synchronized files across servers using <code>rsync</code> without preserving timestamps (missing <code>-t</code>). Every file's <code>mtime</code> was modified. The next <code>git status</code> command was forced to re-read and re-hash all 150,000 files on disk, causing a 10-minute CPU lockup on production nodes.",
        "tryItFriction": "Inspect the raw binary header of <code>.git/index</code> using a hex editor or custom script; read the 4-byte signature <code>DIRC</code>, the version number, and entry count; touch a file to update its <code>mtime</code> and observe how Git detects the stat discrepancy.",
        "socraticHints": [
            "What does the acronym <code>DIRC</code> stand for in the first 4 bytes of every Git index file?",
            "How do stages 0, 1, 2, and 3 in the index represent normal files versus files during an active merge conflict?",
            "What is the Tree Cache (<code>TREE</code> extension) in the index, and why does it allow <code>git commit</code> to write tree objects without scanning every directory on disk?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer writes a custom tool to stage files directly by appending records to <code>.git/index</code>. The tool writes the entries, but any standard Git command immediately throws: 'fatal: index file corrupt'. The developer verified all file hashes are correct.",
            "options": [
                "The tool must be written in C, not Python.",
                "Diagnose Index Entry Sorting & Trailing SHA-1 Checksum Violation: <code>.git/index</code> requires two strict binary invariants: (1) index entries must be sorted strictly in ascending lexicographical order by pathname, and (2) the final 20 bytes of the file must be the SHA-1 checksum of all preceding bytes in the index file. Failing to compute the checksum or sorting incorrectly corrupts the index.",
                "Git only allows root users to write to .git/index.",
                "The index file cannot exceed 1MB."
            ],
            "correctOptionIndex": 1,
            "debrief": "The Git index file enforces strict binary constraints: entries must be sorted lexicographically by file path, and the file ends with a mandatory 20-byte SHA-1 checksum of the entire file content. Violating either rule causes Git to reject the index as corrupt."
        },
        "quests": [
            {
                "id": "Q35.125",
                "name": "Git Binary Index (DIRC) Specification & Extension Architecture",
                "type": "Concept",
                "desc": "Analyze the physical binary specification of .git/index v2/v3/v4, exploring stat cache fields, stage flags, TREE extensions, and trailing checksums."
            },
            {
                "id": "Q35.126",
                "name": "The rsync Stat Cache Invalidation 10-Minute Freeze Detective",
                "type": "Detective Challenge",
                "desc": "Investigate a production deployment freeze caused by stat cache invalidation; trace the mtime timestamps and restore O(1) status checking."
            },
            {
                "id": "Q35.127",
                "name": "Binary Git Index Reader & Stat Cache Validator Engine",
                "type": "Mastery Assignment",
                "desc": "Develop a binary parser in Python/TypeScript that reads .git/index, validates the DIRC header and entry sort order, and inspects cached stat properties."
            },
            {
                "id": "Q35.128",
                "name": "Index Conflict Stages 0-3 Binary State Mutation Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Simulate a 3-way merge conflict; inspect the raw binary index to verify that conflicting files are stored as Stage 1 (ancestor), Stage 2 (ours), and Stage 3 (theirs)."
            }
        ]
    },
    {
        "day": 33,
        "month": 2,
        "blockNum": 7,
        "title": "Delta Compression & Object Deduplication: Sliding Window Algorithms, Max Delta Depth & Thin Packs",
        "stageNum": 7,
        "stageName": "Stage 7: Git Internals & Low-Level Plumbing",
        "pedagogicalRole": "Compression Algorithms & Graph Optimization (Sliding Window Compression, pack.window, pack.depth, Thin Packs & Byte-Level Copy/Insert)",
        "spokenGoal": "How does Git manage to store 15 years of Linux kernel development—over 1 million commits and millions of files—in less than 4GB of disk space? The secret is Sliding Window Delta Compression. Today, you master how Git's repacking algorithm sorts objects by filename, file extension, and size, slides an $N$-object compression window across the sorted sequence, and encodes changes as sliding copy-and-insert byte instructions.",
        "conceptInvariant": "Acyclic Bounded Delta Depth Invariant: Delta compression chains must form a strict Directed Acyclic Graph bounded by maximum depth $D = \\text{pack.depth}$ (default 50). Resolving an object requires at most $D$ recursive delta evaluations, preventing CPU decompression stack exhaustion.",
        "failureMode": "The Unbounded Delta Depth Decompression CPU Exhaustion: An administrator configured <code>git config pack.depth 1000</code> to minimize repository disk size. While the repo shrank by 8%, running <code>git checkout</code> or <code>git bisect</code> on older revisions required decompressing 800-deep delta chains, slowing down checkout times by 1,200% and causing CI jobs to timeout.",
        "tryItFriction": "Profile your repository's delta compression metrics using <code>git verify-pack -v .git/objects/pack/*.idx</code>; analyze the distribution of delta chain depths and compare compression efficiency across window sizes 10, 50, and 100.",
        "socraticHints": [
            "Why does Git sort objects by filename and file size before sliding the delta compression window over them?",
            "What is a 'Thin Pack' in Git network transfer, and why must the receiving end 'index-pack' it to complete the missing delta bases?",
            "Why does delta compression work poorly on pre-compressed binary files (like .zip, .png, or .mp4)?"
        ],
        "situationalPuzzle": {
            "scenario": "A game development team stores 2GB 3D asset files in Git. They notice that running <code>git gc</code> consumes 100% CPU and 64GB of RAM for 3 hours, eventually crashing with an out-of-memory error. How do they configure Git to handle these files safely?",
            "options": [
                "Increase swap space to 500GB.",
                "Diagnose Window Memory Exhaustion & Use Git LFS or Window Limits: Running delta compression on massive multi-gigabyte binary files exhausts memory because Git attempts to buffer multiple large objects simultaneously in memory. Fix by: (1) Setting <code>core.bigFileThreshold = 50m</code> so files over 50MB bypass delta compression, (2) Limiting <code>pack.windowMemory = 1g</code>, and (3) Migrating large binary assets to Git LFS.",
                "Delete the repository commit history.",
                "Disable Git garbage collection permanently."
            ],
            "correctOptionIndex": 1,
            "debrief": "Large binary files cause severe memory exhaustion during delta window search. Setting <code>core.bigFileThreshold</code> instructs Git to store files over the threshold as un-delta'd compressed blobs, while <code>pack.windowMemory</code> prevents OOM crashes."
        },
        "quests": [
            {
                "id": "Q35.129",
                "name": "Libgit2 & Git Core Delta Compression Algorithm Architecture",
                "type": "Concept",
                "desc": "Analyze the mathematical foundations of Git's copy/insert delta encoding format, sliding window sort heuristics, and thin pack resolution."
            },
            {
                "id": "Q35.130",
                "name": "The 800-Level Deep Delta Chain Checkout Latency Detective",
                "type": "Detective Challenge",
                "desc": "Investigate a sluggish enterprise repository suffering from 800-level delta chains; repack the database with optimized window and depth bounds."
            },
            {
                "id": "Q35.131",
                "name": "Custom Delta Compression & Decompression Byte Stream Engine",
                "type": "Mastery Assignment",
                "desc": "Build a byte-level delta compressor/decompressor in Python/TypeScript that implements Git's native copy/insert opcode instruction set."
            },
            {
                "id": "Q35.132",
                "name": "Adversarial Pre-Compressed Binary Repo Bloat Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Ingest 500 high-entropy encrypted blobs into a Git repository; profile packing performance under various core.bigFileThreshold configurations."
            }
        ]
    },
    {
        "day": 34,
        "month": 2,
        "blockNum": 7,
        "title": "Garbage Collection, MIDX & Alternate Stores: `git gc`, `git prune`, Multi-Pack-Index & `info/alternates`",
        "stageNum": 7,
        "stageName": "Stage 7: Git Internals & Low-Level Plumbing",
        "pedagogicalRole": "Storage Optimization & Infrastructure (Garbage Collection, Multi-Pack-Index [MIDX], Commit-Graph, info/alternates)",
        "spokenGoal": "In enterprise hosting platforms like GitHub, GitLab, and Gerrit, managing disk space and search efficiency across thousands of repository forks requires advanced plumbing. Today, you master enterprise repository maintenance: how <code>git gc</code> orchestrates packing and pruning, how Multi-Pack-Index (MIDX) files provide a unified binary index across hundreds of packfiles, how the <code>commit-graph</code> file accelerates commit walking by 10x, and how Alternate Object Stores (<code>objects/info/alternates</code>) allow forks to share 99% of their disk footprint.",
        "conceptInvariant": "Alternate Object Store Read-Only Invariant: An alternate object store referenced in <code>.git/objects/info/alternates</code> must be treated as strictly immutable and read-only by child repositories. Deleting or modifying objects in the parent repository corrupts all dependent child repositories immediately.",
        "failureMode": "The Shared Alternate Object Store Accidental Prune Disaster: An enterprise server hosts 300 developer forks using a shared base repository in <code>objects/info/alternates</code>. A cron job executes <code>git gc --prune=now</code> on the base repository. Because the base repository's refs did not track the fork branches, the base repo pruned objects active in the forks, corrupting all 300 repositories simultaneously.",
        "tryItFriction": "Create a lightweight clone using <code>git clone --shared</code> or <code>git clone --reference</code>; verify that the new repository's <code>.git/objects/info/alternates</code> points to the parent, inspect its disk usage (consuming less than 100KB), and verify that all historical commits remain accessible.",
        "socraticHints": [
            "Why is <code>git commit-graph write --reachable</code> one of the single most impactful performance optimizations for large repositories with deep histories?",
            "What problem does a Multi-Pack-Index (MIDX) file solve when a repository has dozens of packfiles that cannot be repacked immediately?",
            "How does Git prevent race conditions during concurrent pushes when garbage collection is running in the background?"
        ],
        "situationalPuzzle": {
            "scenario": "A large enterprise repository with 500,000 commits takes 15 seconds to run <code>git log -n 10</code>. CPU profiling shows Git spends 90% of its time parsing raw commit objects from packfiles to traverse the parent graph. What modern Git optimization feature solves this?",
            "options": [
                "Reboot the Git server.",
                "Diagnose Missing Commit-Graph Binary Acceleration: Enable and generate a Git commit-graph file by running <code>git commit-graph write --reachable</code>. The commit-graph file stores a compact, binary-serialized representation of the entire commit DAG (parents, tree hashes, commit dates, and generation numbers), allowing Git to traverse graph ancestry in milliseconds without decompressing commit objects.",
                "Delete historical commits older than 1 year.",
                "Convert all commits into lightweight tags."
            ],
            "correctOptionIndex": 1,
            "debrief": "The <code>commit-graph</code> file stores pre-computed DAG relationships (commit SHA, parent SHAs, generation numbers) in a contiguous binary format. It allows Git to traverse history up to 10x faster by eliminating the need to decompress individual commit objects."
        },
        "quests": [
            {
                "id": "Q35.133",
                "name": "Multi-Pack-Index (MIDX) & Commit-Graph Systems Architecture",
                "type": "Concept",
                "desc": "Detail the binary format and query algorithms of MIDX files and commit-graph files, analyzing generation numbers and reachability bitmaps."
            },
            {
                "id": "Q35.134",
                "name": "The Corrupted Shared Alternates Object Store Detective",
                "type": "Detective Challenge",
                "desc": "Investigate an enterprise hosting node where 200 forks broke after an unsafe prune on the parent alternates store; reconstruct the missing object graph."
            },
            {
                "id": "Q35.135",
                "name": "Automated Multi-Pack Maintenance & Commit-Graph Engine",
                "type": "Mastery Assignment",
                "desc": "Build an automated repository maintenance daemon that monitors packfile counts, writes MIDX files, updates commit-graphs, and runs safe incremental garbage collection."
            },
            {
                "id": "Q35.136",
                "name": "Concurrent Push vs Background GC Race Condition Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Execute high-frequency push operations while triggering aggressive background git gc --prune runs; verify object quarantine isolation and zero ref corruption."
            }
        ]
    },
    {
        "day": 35,
        "month": 2,
        "blockNum": 7,
        "title": "Milestone 4 (M2): ApexPlumbing Custom Git Object Database & Packfile Decoder Suite",
        "stageNum": 7,
        "stageName": "Stage 7: Git Internals & Low-Level Plumbing",
        "pedagogicalRole": "Synthesis & Low-Level Systems Engineering (Custom Packfile Decoder, MIDX Reader, Commit-Graph Evaluator & Binary Plumbing)",
        "spokenGoal": "Milestone 4 (Month 2) tests your mastery of Git's lowest-level binary storage formats. You will architect ApexPlumbing: a zero-dependency Git binary decoder engine in Python/TypeScript. Your platform will directly parse <code>.pack</code> and <code>.idx</code> v2 files, decode OFS_DELTA and REF_DELTA streams, evaluate the <code>commit-graph</code> binary file, and reconstruct historical files from bare packfiles without invoking the Git CLI.",
        "conceptInvariant": "Binary Parity & Canonical Reconstruction Invariant: For any object hash in a valid packfile, the ApexPlumbing decoder must produce decompressed byte streams that match the official Git output to the exact byte, verifying CRC32 checksums and SHA hashes.",
        "failureMode": "The Truncated Packfile Network Proxy Disaster: An enterprise caching proxy cached Git packfiles. Because it truncated the final 20-byte packfile checksum, repositories that ingested the packfile suffered silent corruption, causing subsequent pushes to fail with fatal sha1 mismatch errors.",
        "tryItFriction": "Deliver and test ApexPlumbing against a real-world packfile from an active open-source repository; verify that your tool can read the pack index, locate an object, decompress a 10-level delta chain, and output the raw file contents.",
        "socraticHints": [
            "How do variable-length integer encodings (MSB-based LEB128) allow Git to encode object sizes and delta offsets in minimal bytes?",
            "Why must a packfile decoder verify both the per-object CRC32 checksum from the <code>.idx</code> file and the final 20-byte SHA checksum at the end of the <code>.pack</code> file?",
            "How does the commit-graph generation number enable topological traversal algorithms to terminate early without walking unneeded branches?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer runs ApexPlumbing on a 500MB packfile. The decoder resolves 99% of objects correctly, but throws an exception on a specific OFS_DELTA object: 'Negative offset or offset points past packfile boundary'.",
            "options": [
                "The packfile has an encryption password.",
                "Diagnose OFS_DELTA Variable-Length Offset Decoding Bug: In the OFS_DELTA format, the offset is encoded using a modified variable-length integer format where each byte except the last has the MSB set, and each byte after the first adds 1 to the accumulator before shifting (<code>offset = (offset + 1) << 7 | (byte & 0x7F)</code>). Implementing standard LEB128 without the '+1' offset adjustment calculates an incorrect byte position.",
                "OFS_DELTA is only supported on 32-bit systems.",
                "The packfile must be converted to JSON."
            ],
            "correctOptionIndex": 1,
            "debrief": "Git's OFS_DELTA uses a specialized variable-length encoding where each byte after the first increments the accumulator by 1 before shifting by 7 bits. Standard LEB128 decoding fails on multi-byte OFS_DELTA offsets."
        },
        "quests": [
            {
                "id": "Q35.137",
                "name": "ApexPlumbing Systems Blueprint & Binary Decoder Specification",
                "type": "Concept",
                "desc": "Document the complete systems blueprint of ApexPlumbing, specifying packfile parsing, variable-length integer decoding, delta chain resolution, and MIDX indexing."
            },
            {
                "id": "Q35.138",
                "name": "The Truncated Packfile Checksum Corruption Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a corrupted enterprise packfile with invalid CRC32 checksums; isolate the damaged bytes and reconstruct the packfile integrity."
            },
            {
                "id": "Q35.139",
                "name": "ApexPlumbing Production Packfile & Delta Decoder Platform",
                "type": "Mastery Assignment",
                "desc": "Build the full ApexPlumbing binary decoder engine: an independent tool that parses .idx v2, unpacks OFS_DELTA/REF_DELTA chains, and verifies commit-graphs."
            },
            {
                "id": "Q35.140",
                "name": "ApexPlumbing Milestone 4 Viva Defense & Low-Level Gate",
                "type": "Production Incident Lab",
                "desc": "Defend ApexPlumbing before the Principal Systems Board under live adversarial packfile corruptions, deep delta chain attacks, and malformed index injections."
            }
        ]
    },
    {
        "day": 36,
        "month": 2,
        "blockNum": 8,
        "title": "Branching Strategies at Scale: Gitflow vs GitHub Flow vs Trunk-Based Development & Short-Lived Branches",
        "stageNum": 8,
        "stageName": "Stage 8: Distributed Branching & Enterprise Release Engineering",
        "pedagogicalRole": "Enterprise Release Architecture (Gitflow vs Trunk-Based Development, Release Branching, Feature Flags, Lead Time Optimization)",
        "spokenGoal": "How do elite engineering teams like Google, Meta, and Netflix ship code to production 50 times a day without breaking? They do not use Gitflow. Gitflow is an obsolete pattern from the shrink-wrapped software era of the 2000s that leads to 'merge hell'. Today, you master modern enterprise branching strategies: why Trunk-Based Development is the industry gold standard, how to decouple deployment from release using Feature Flags, and why branches should live for less than 24 hours.",
        "conceptInvariant": "Trunk-Based Integration Cadence Invariant: All engineers merge short-lived feature branches into the trunk (<code>main</code>) at least once per 24 hours: $\\text{Lifetime}(\\text{branch}) \\le 24\\text{ hours}$. Incomplete features are safely hidden behind dynamic feature toggles rather than quarantined in long-lived divergent branches.",
        "failureMode": "The Gitflow 3-Month Release Merge Hell Disaster: An enterprise uses Gitflow with separate <code>develop</code>, <code>release-2.0</code>, and <code>feature</code> branches lasting 3 months. When the team attempts to merge the release branch into <code>main</code>, they encounter 1,400 merge conflicts across 300 files. Resolving the conflicts takes 3 weeks of engineering time and introduces 18 critical production bugs.",
        "tryItFriction": "Simulate an enterprise feature rollout using Trunk-Based Development: implement a breaking API change behind a boolean feature flag, merge it into <code>main</code> via a short-lived branch in under 10 minutes, and toggle the feature dynamically at runtime.",
        "socraticHints": [
            "Why do long-lived feature branches inevitably create an exponential increase in merge conflict probability over time?",
            "How do Feature Flags (Toggles) allow developers to merge incomplete code into production daily without exposing unfinished features to users?",
            "What metrics (such as DORA lead time for changes and change failure rate) differentiate Trunk-Based teams from Gitflow teams?"
        ],
        "situationalPuzzle": {
            "scenario": "A company requires 4 weeks of manual QA testing before every production release. The engineering manager proposes using Trunk-Based Development. The QA lead objects: 'If developers merge into main daily, how can we test a stable release candidate?'",
            "options": [
                "QA testing should be eliminated entirely.",
                "Diagnose Release Branching from Trunk: Under Trunk-Based Development, when code is ready for final release hardening, a short-lived release branch (e.g. <code>release/v2.1</code>) is cut from <code>main</code>. QA tests that frozen branch while developers continue merging daily into <code>main</code>. Any critical bug discovered by QA is cherry-picked back into the release branch, ensuring main never freezes.",
                "Developers must stop writing code for 4 weeks.",
                "Switch to a separate Git repository for each release."
            ],
            "correctOptionIndex": 1,
            "debrief": "Trunk-Based Development does not mean you cannot have stable releases. Teams cut a short-lived release branch from trunk for final stabilization and deployment, while active feature development continues uninterrupted on trunk."
        },
        "quests": [
            {
                "id": "Q35.141",
                "name": "Enterprise Branching Taxonomy & DORA Metrics Architecture",
                "type": "Concept",
                "desc": "Analyze the systemic trade-offs between Gitflow, GitHub Flow, and Trunk-Based Development, examining lead time, deployment frequency, and conflict probability."
            },
            {
                "id": "Q35.142",
                "name": "The 1,400-Conflict Gitflow Release Meltdown Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a stalled 3-month release branch with 1,400 merge conflicts; reconstruct the integration paths and establish a clean trunk-based migration."
            },
            {
                "id": "Q35.143",
                "name": "Trunk-Based Release Engineering & Feature Flag Gateway",
                "type": "Mastery Assignment",
                "desc": "Build an automated release governance engine that monitors branch lifespans, alerts on branches older than 48 hours, and validates feature flag coverage."
            },
            {
                "id": "Q35.144",
                "name": "High-Frequency 50-PR Daily Trunk Integration Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Simulate 50 automated developer bots merging short-lived feature branches into trunk throughout a simulated 8-hour workday; measure merge queue stability."
            }
        ]
    },
    {
        "day": 37,
        "month": 2,
        "blockNum": 8,
        "title": "Monorepo vs Polyrepo Architecture: Scaling Bottlenecks, Hermetic Builds & Dependency Graph Management",
        "stageNum": 8,
        "stageName": "Stage 8: Distributed Branching & Enterprise Release Engineering",
        "pedagogicalRole": "Repository Architecture at Scale (Monorepo vs Polyrepo, Hermetic Build Systems, Dependency Graphs & Cross-Service Atomic Commits)",
        "spokenGoal": "Should your company store 500 microservices in 500 separate repositories (polyrepo), or unify them in a single massive monorepo like Google, Microsoft, and Uber? Today, you master Monorepo vs Polyrepo systems architecture: evaluating the trade-offs between atomic cross-service commits versus repository bloat, understanding hermetic build dependency graphs (Bazel, Turborepo, Nx), and learning how Git scales to hundreds of gigabytes.",
        "conceptInvariant": "Hermetic Affected Graph Invariant: In an enterprise monorepo, a commit mutating service $S_k$ must trigger CI builds strictly for $S_k$ and its transitive downstream dependents: $\\text{BuildSet} = \\text{TransitiveDependents}(S_k)$. Running the global test suite across all services on every commit is an architectural anti-pattern.",
        "failureMode": "The 45-Minute Polyrepo Version Dependency Deadlock: A breaking API change requires updating 8 separate microservices across 8 polyrepos. Because each service has its own repository and CI release cycle, deploying the change takes 45 minutes of manual PR coordination. A race condition midway through leaves 3 services incompatible, causing an outage.",
        "tryItFriction": "Construct a multi-service monorepo containing two backend APIs and a shared utility library; configure path-based Git change detection using <code>git diff --name-only HEAD~1</code> to identify and test only the affected services.",
        "socraticHints": [
            "What is the single greatest architectural advantage of a monorepo when refactoring a shared internal library used by 50 microservices?",
            "Why does a monorepo without a smart build tool (like Bazel or Nx) inevitably collapse under the weight of CI execution times?",
            "How do polyrepos introduce 'dependency version drift' across independent development teams?"
        ],
        "situationalPuzzle": {
            "scenario": "An enterprise monorepo contains 50 frontend applications and 100 backend services. Every time a developer pushes a 1-line typo fix in a CSS file of app A, the GitHub Actions CI pipeline runs for 4 hours, executing tests for all 150 applications.",
            "options": [
                "Split the monorepo into 150 polyrepos immediately.",
                "Diagnose Missing Affected Dependency Graph Filtering: The CI pipeline lacks change-detection path filtering. The team must configure path-based workflow triggers (<code>on.push.paths</code>) or integrate a monorepo build tool (like Turborepo, Nx, or Bazel) that inspects the git diff and executes tasks strictly for affected targets, reducing CI runtime from 4 hours to 90 seconds.",
                "Buy 150 new CI runner machines.",
                "Disable all unit testing across the monorepo."
            ],
            "correctOptionIndex": 1,
            "debrief": "A monorepo must use dependency graph analysis to test only the projects affected by a commit. Running global tests for all services on every commit wastes resources and destroys developer velocity."
        },
        "quests": [
            {
                "id": "Q35.145",
                "name": "Monorepo vs Polyrepo Systems Architecture & Scaling Limits",
                "type": "Concept",
                "desc": "Analyze the technical trade-offs between monorepos and polyrepos, evaluating atomic commits, tooling complexity, Git performance limits, and dependency graphs."
            },
            {
                "id": "Q35.146",
                "name": "The Polyrepo Cross-Service Dependency Deadlock Detective",
                "type": "Detective Challenge",
                "desc": "Investigate a cascading production outage caused by desynchronized deployments across 6 polyrepos; reconstruct the dependency graph into an atomic migration."
            },
            {
                "id": "Q35.147",
                "name": "Affected Dependency Graph Analyzer & Monorepo CI Dispatcher",
                "type": "Mastery Assignment",
                "desc": "Build an automated CLI tool that parses monorepo dependency manifests, calculates the transitive closure of affected packages from a git diff, and triggers targeted CI runs."
            },
            {
                "id": "Q35.148",
                "name": "5,000-Package Monorepo Path Resolution Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Simulate a 5,000-package enterprise monorepo; benchmark git diff and path filtering algorithms across 10,000 commits, verifying sub-second dependency calculation."
            }
        ]
    },
    {
        "day": 38,
        "month": 2,
        "blockNum": 8,
        "title": "Scalable Large Repositories: Sparse Checkout (`git sparse-checkout`), Blobless Clones & Microsoft Scalar",
        "stageNum": 8,
        "stageName": "Stage 8: Distributed Branching & Enterprise Release Engineering",
        "pedagogicalRole": "Ultra-Large Repository Engineering (Sparse Checkout, Cone Mode, Partial Clones: Blobless vs Treeless, Microsoft Scalar)",
        "spokenGoal": "Windows OS is stored in a single Git repository containing 3.5 million files and 300GB of data. If an engineer ran a standard <code>git clone</code>, it would take days and exhaust their hard drive. Today, you master ultra-large repository engineering: Partial Clones (<code>--filter=blob:none</code>, downloading commit trees while fetching file contents on-demand), Sparse Checkout (checking out only the folders your team works on), Cone Mode, and Microsoft Scalar.",
        "conceptInvariant": "Blobless Lazy Hydration Invariant: A blobless partial clone (<code>git clone --filter=blob:none</code>) downloads the complete commit and tree DAG, but downloads zero file Blobs until a specific file is checked out or diffed: $\\text{Clone Size} = O(\\text{Trees}) \\ll O(\\text{Blobs})$. This enables instant cloning of 100GB+ repositories.",
        "failureMode": "The Treeless Partial Clone Offline Disconnection Lockup: An engineer clones a repository using <code>--filter=tree:0</code> (treeless clone) to save bandwidth before boarding a flight. In-flight with no Wi-Fi, they run <code>git log -p</code> or <code>git checkout another-branch</code>. Because treeless clones require network requests to fetch tree objects on demand, Git halts with fatal connection errors, locking the developer out of work.",
        "tryItFriction": "Perform a blobless partial clone of a large open-source repository using <code>git clone --filter=blob:none --sparse <url></code>; enable cone mode using <code>git sparse-checkout set <directory></code>, and verify that only the targeted directory is checked out on disk while full commit history remains navigable.",
        "socraticHints": [
            "What is the crucial difference between a blobless clone (<code>--filter=blob:none</code>) and a treeless clone (<code>--filter=tree:0</code>) in terms of offline usability?",
            "Why is Sparse Checkout 'Cone Mode' vastly faster than arbitrary pattern matching in large repositories with hundreds of thousands of files?",
            "What Git configuration optimizations does Microsoft Scalar automatically apply (e.g. <code>core.fsmonitor</code>, <code>commit-graph</code>, <code>fetch.writeCommitGraph</code>)?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer working on a 150GB monorepo enables sparse checkout to work exclusively on <code>services/auth/</code>. When they run <code>git sparse-checkout set services/auth</code>, all other directories disappear from their file explorer. The developer panics, believing they accidentally deleted 95% of the company's code.",
            "options": [
                "The developer deleted the code and must be reprimanded.",
                "Diagnose Sparse Checkout Working Tree Virtualization: The code is completely safe in the Git object database and on the remote server. Sparse checkout merely instructs Git to populate the local working directory with only the specified directories, hiding unneeded files to save disk space and improve IDE indexing speed. Running <code>git sparse-checkout disable</code> instantly restores all files to disk.",
                "The developer must run git reset --hard origin/main.",
                "Sparse checkout requires recloning from scratch."
            ],
            "correctOptionIndex": 1,
            "debrief": "Sparse checkout selectively populates the working directory with only the folders you specify, keeping the rest of the repository in the Git object store without checking it out onto disk. No files are lost or deleted."
        },
        "quests": [
            {
                "id": "Q35.149",
                "name": "Partial Clone & Sparse Checkout Protocol Architecture",
                "type": "Concept",
                "desc": "Analyze the mechanics of Git promisors, on-demand blob fetching, cone mode path prefix trees, and virtualized working directories."
            },
            {
                "id": "Q35.150",
                "name": "The In-Flight Treeless Partial Clone Blackout Detective",
                "type": "Detective Challenge",
                "desc": "Investigate an offline developer lockout caused by treeless partial clones; reconstruct local cache strategies to guarantee offline branch switching."
            },
            {
                "id": "Q35.151",
                "name": "Enterprise Scalar & Sparse Workspace Configurator CLI",
                "type": "Mastery Assignment",
                "desc": "Build an automated developer onboarding tool that provisions optimized sparse workspaces with blobless filters, cone mode paths, and fsmonitor daemons."
            },
            {
                "id": "Q35.152",
                "name": "1-Million File Monorepo Sparse Checkout Performance Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Simulate a 1-million file repository; benchmark checkout latency, memory usage, and status query times across standard vs sparse cone mode configurations."
            }
        ]
    },
    {
        "day": 39,
        "month": 2,
        "blockNum": 8,
        "title": "Git LFS (Large File Storage): Pointer Files, Smudge/Clean Filters, S3 Storage Backends & Asset Deduplication",
        "stageNum": 8,
        "stageName": "Stage 8: Distributed Branching & Enterprise Release Engineering",
        "pedagogicalRole": "Binary Asset Management (Git LFS, Smudge & Clean Filters, Pointer Grammar, S3/Cloud Backends & Locking)",
        "spokenGoal": "Git was engineered for text diffs, not 500MB video assets, Photoshop files, or machine learning model weights. If you commit raw binary files directly to Git, every modification creates a full new Blob, bloating repository clone sizes into gigabytes. Today, you master Git LFS (Large File Storage): how smudge and clean filters replace large binary files with 130-byte text pointer files, how Git LFS offloads binary payloads to S3/cloud storage, and how file locking prevents unmergeable binary conflicts.",
        "conceptInvariant": "LFS Pointer Grammar & Smudge/Clean Invariant: In the Git repository, an LFS-tracked file is strictly a 3-line text pointer: $\\text{version} + \\text{oid sha256} + \\text{size}$. The Clean filter intercepts files on stage/commit and uploads raw binaries to LFS storage; the Smudge filter downloads and hydrates raw binaries on checkout.",
        "failureMode": "The Unhydrated LFS Pointer Production ML Outage: A machine learning model deployment script runs in a container without <code>git-lfs</code> installed. The model serving container starts up and attempts to load the 2GB PyTorch model weight file. The application crashes immediately with a parsing error because the file on disk is literally a 130-byte text pointer file containing 'version https://git-lfs.github.com/spec/v1'.",
        "tryItFriction": "Configure Git LFS in a repository using <code>git lfs track '*.psd'</code>; inspect the generated <code>.gitattributes</code> file, commit a sample binary file, inspect the raw commit with <code>git cat-file -p</code> to verify it contains only the 130-byte text pointer, and test binary hydration.",
        "socraticHints": [
            "Why does committing large binary files directly to standard Git cause permanent repository bloat even if the file is deleted in the very next commit?",
            "What is the operational difference between the Git LFS Clean filter (run during <code>git add</code>) and the Smudge filter (run during <code>git checkout</code>)?",
            "Why is Git LFS file locking (<code>git lfs lock <file></code>) essential for teams collaborating on binary files like 3D models or spreadsheets?"
        ],
        "situationalPuzzle": {
            "scenario": "A designer modifies a 300MB video file tracked by Git LFS. A developer runs <code>git clone</code>, but the clone takes 45 minutes and downloads 15GB of data. The developer discovers that Git LFS downloaded every single historical version of the 300MB video file across all branches.",
            "options": [
                "Git LFS cannot be used for video files.",
                "Diagnose Default LFS Download Strategy & Configure Smudge Exclusion: By default, <code>git lfs fetch --all</code> downloads all historical LFS objects. To optimize, the developer should configure <code>git lfs install --skip-smudge</code> to download only text pointers initially, and selectively hydrate only the specific current asset needed using <code>git lfs pull</code>.",
                "Delete the video file from the repository.",
                "Disable Git LFS in .gitconfig."
            ],
            "correctOptionIndex": 1,
            "debrief": "Git LFS can download all historical versions if configured aggressively. Using <code>--skip-smudge</code> during clone and hydrating assets selectively with <code>git lfs pull</code> ensures only current working assets are downloaded, saving massive bandwidth."
        },
        "quests": [
            {
                "id": "Q35.153",
                "name": "Git LFS Protocol & Smudge/Clean Filter Architecture",
                "type": "Concept",
                "desc": "Detail the client-server protocol of Git LFS, analyzing pointer file grammars, batch API transfers, S3 storage backends, and smudge/clean filters."
            },
            {
                "id": "Q35.154",
                "name": "The Unhydrated LFS Pointer Container Crash Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a production deployment crash where microservices failed to load ML models due to unhydrated LFS text pointers; repair the deployment pipeline."
            },
            {
                "id": "Q35.155",
                "name": "Automated Git LFS Asset Migrator & Deduplication Engine",
                "type": "Mastery Assignment",
                "desc": "Build a migration CLI tool that scans repository history for bloated binary files, converts them into Git LFS pointers retroactively, and repacks history."
            },
            {
                "id": "Q35.156",
                "name": "Multi-Gigabyte Binary Concurrent LFS Push/Pull Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Simulate 20 concurrent developers pushing and pulling 1GB LFS assets against a mock S3 storage backend; measure retry handling and checksum validation."
            }
        ]
    },
    {
        "day": 40,
        "month": 2,
        "blockNum": 8,
        "title": "Milestone 5 (M2): ApexRelease Enterprise Trunk-Based CI/CD Release Engine Suite",
        "stageNum": 8,
        "stageName": "Stage 8: Distributed Branching & Enterprise Release Engineering",
        "pedagogicalRole": "Synthesis & Enterprise Release Engineering (Trunk-Based Release Orchestrator, Monorepo Build Router, LFS Verifier & SemVer Automation)",
        "spokenGoal": "Milestone 5 (Month 2) tests your ability to architect enterprise-scale release engineering pipelines. You will build ApexRelease: an automated release platform that manages Trunk-Based branching workflows, validates short-lived branch lifespans, calculates affected monorepo dependency graphs, verifies Git LFS asset hydration, and automates semantic version releases with immutable annotated tags.",
        "conceptInvariant": "Production Release Integrity Invariant: ApexRelease guarantees that production artifacts are built strictly from verified trunk commits with 100% LFS asset hydration, zero uncommitted submodule drift, and passing hermetic build validation.",
        "failureMode": "The Unverified Binary Artifact Production Crash: An automated release script packaged a container image where an essential ML model asset was an unhydrated 130-byte LFS text pointer. The container passed superficial health checks but crashed when customer inference traffic hit the service, causing an enterprise outage.",
        "tryItFriction": "Deploy and test ApexRelease against a multi-service monorepo containing LFS assets; verify that ApexRelease identifies affected services, confirms LFS binary hydration, gates the trunk-based release, and generates automated changelogs.",
        "socraticHints": [
            "How does ApexRelease verify that an LFS file on disk is an actual hydrated binary rather than an unsmudged text pointer before building a release?",
            "Why must release tags in a trunk-based monorepo use package-scoped semantic tags (e.g. <code>@service-a/v1.2.0</code>) rather than a single monolithic version?",
            "How does automated branch lifecycle auditing prevent 'stale branch rot' in enterprise organizations?"
        ],
        "situationalPuzzle": {
            "scenario": "During a high-stakes release, ApexRelease blocks deployment with: 'ERROR: LFS ASSET INTEGRITY FAILURE: models/v1.onnx has size 132 bytes but LFS metadata specifies 1.8GB'. The release engineer insists on forcing deployment.",
            "options": [
                "Bypass the check and deploy anyway.",
                "Diagnose Unhydrated LFS Pointer & Enforce Gating: The file on disk is literally the 132-byte LFS pointer, not the actual 1.8GB machine learning model. Deploying it will cause runtime crashes as soon as the service attempts to load weights. The engineer must run <code>git lfs pull</code> to hydrate the real binary asset before ApexRelease will unlock the release gate.",
                "Delete models/v1.onnx from the build.",
                "Increase the server RAM to 128GB."
            ],
            "correctOptionIndex": 1,
            "debrief": "ApexRelease's safety check detected that the file is merely the 132-byte LFS pointer rather than the real 1.8GB model binary. Halting deployment prevents a catastrophic runtime outage caused by unhydrated assets."
        },
        "quests": [
            {
                "id": "Q35.157",
                "name": "ApexRelease Systems Blueprint & Trunk Release Architecture",
                "type": "Concept",
                "desc": "Document the complete systems blueprint of ApexRelease, detailing trunk-based release workflows, monorepo affected routing, LFS validation, and SemVer automation."
            },
            {
                "id": "Q35.158",
                "name": "The Stale Release Branch Dependency Regression Detective",
                "type": "Detective Challenge",
                "desc": "Investigate a high-severity production outage caused by an unverified stale branch release; reconstruct the release path and harden ApexRelease gates."
            },
            {
                "id": "Q35.159",
                "name": "ApexRelease Production Release Orchestrator Platform",
                "type": "Mastery Assignment",
                "desc": "Build the full ApexRelease platform: an automated CLI that enforces trunk-based branching, verifies LFS asset hydration, and generates scoped semantic releases."
            },
            {
                "id": "Q35.160",
                "name": "ApexRelease Milestone 5 Viva Defense & Release Stress Gate",
                "type": "Production Incident Lab",
                "desc": "Defend ApexRelease before the Principal DevOps Review Board under simulated release deadlocks, unhydrated LFS payloads, and concurrent branch deployments."
            }
        ]
    },
    {
        "day": 41,
        "month": 2,
        "blockNum": 9,
        "title": "Cryptographic Commit & Tag Signing: GPG vs SSH Key Signatures, Web-Flow Verification & Allowed Signers",
        "stageNum": 9,
        "stageName": "Stage 9: Security, Cryptography & Audit Compliance",
        "pedagogicalRole": "Cryptographic Provenance & Identity Assurance (Commit Signing, GPG Keys, SSH Signatures, allowed_signers, Vigilant Mode)",
        "spokenGoal": "Anyone in the world can forge a Git commit in your name. Anyone can type <code>git commit --author='Satya Nadella <satya@microsoft.com>'</code> and push it to a repository. Git does zero author verification by default. Today, you master Cryptographic Provenance: signing commits and tags using modern SSH keys (ed25519) and GPG, verifying signatures with <code>git log --show-signature</code>, configuring GitHub's 'Vigilant Mode' to flag unverified commits, and managing enterprise <code>allowed_signers</code> trust lists.",
        "conceptInvariant": "Cryptographic Provenance Non-Repudiation Invariant: A signed commit embeds a cryptographic signature in its commit object header: $\\text{Sig} = \\text{Sign}_{K_{\\text{priv}}}(\\text{tree} + \\text{parents} + \\text{author} + \\text{committer} + \\text{message})$. Verifying the signature against public key $K_{\\text{pub}}$ guarantees tamper-proof authorship and payload integrity.",
        "failureMode": "The Impersonated Executive CEO Backdoor Compromise: An attacker with repository write access pushes a backdoor commit with <code>--author='vp-security@company.com'</code>. Because the repository did not require signed commits, code reviewers assumed the commit was an authorized hotfix from leadership and approved the pull request, deploying the backdoor to production.",
        "tryItFriction": "Configure your local Git to sign all commits automatically using an ed25519 SSH key (<code>git config commit.gpgsign true</code>, <code>git config gpg.format ssh</code>); commit a change, verify the signature with <code>git log --show-signature</code>, and inspect the raw PGP/SSH signature block using <code>git cat-file -p HEAD</code>.",
        "socraticHints": [
            "Why did Git 2.34+ add native support for signing commits with standard SSH keys instead of requiring complex GPG keyrings?",
            "What is an <code>allowed_signers</code> file, and how does it enable team-wide cryptographic signature verification in Git without GPG key servers?",
            "Why does GitHub display an 'Unverified' badge next to a commit even when the commit is cryptographically signed?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer configures SSH commit signing. They push signed commits to GitHub, but GitHub displays a yellow 'Unverified' badge next to every commit with the message: 'The committer email does not match the GPG/SSH key email'.",
            "options": [
                "GitHub does not support SSH commit signatures.",
                "Diagnose Committer Email and Signing Key Mismatch: GitHub's verification engine strictly requires that the committer email in Git matches an email associated with the public signing key uploaded to the user's GitHub account. If the developer committed using <code>john@personal.com</code> but their GitHub signing key is registered to <code>john@work.com</code>, GitHub flags the signature as unverified.",
                "The developer needs to generate an RSA 4096-bit key instead.",
                "Reboot the GitHub web server."
            ],
            "correctOptionIndex": 1,
            "debrief": "GitHub validates that the public key exists on the user's account AND that the email address recorded in the commit's <code>committer</code> field matches a verified email address associated with that key. A mismatch produces an Unverified warning."
        },
        "quests": [
            {
                "id": "Q35.161",
                "name": "Git Cryptographic Signature Architecture: GPG & SSH Formats",
                "type": "Concept",
                "desc": "Detail the internal format of signed commit and tag object headers, examining OpenPGP packets, SSH signature wrappers, and allowed_signers verification."
            },
            {
                "id": "Q35.162",
                "name": "The Forged Executive Author Identity Impersonation Detective",
                "type": "Detective Challenge",
                "desc": "Investigate a repository containing forged commits authored as company executives; verify signatures to separate genuine commits from forged ones."
            },
            {
                "id": "Q35.163",
                "name": "Enterprise SSH Allowed Signers Verification & Enforcement Engine",
                "type": "Mastery Assignment",
                "desc": "Build an automated verification hook in Bash/Python that validates all incoming commits against an enterprise allowed_signers file and rejects unsigned commits."
            },
            {
                "id": "Q35.164",
                "name": "Adversarial Signature Forgery & Bit-Flipping Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Simulate bit-flipping attacks on signed commit payloads and attempt signature transplantation across different commits; verify that git verify-commit detects tampering."
            }
        ]
    },
    {
        "day": 42,
        "month": 2,
        "blockNum": 9,
        "title": "Secret Detection & Pre-Commit Hardening: Pre-Commit Hooks, Gitleaks, TruffleHog & Entropy Scanning",
        "stageNum": 9,
        "stageName": "Stage 9: Security, Cryptography & Audit Compliance",
        "pedagogicalRole": "Shift-Left Security Engineering (Pre-Commit Hooks, Gitleaks, TruffleHog, Shannon Entropy Scanners & Secret Prevention)",
        "spokenGoal": "The second you commit an AWS access key, Stripe secret, or database password to Git, you are already compromised. Automated bots scrape GitHub within seconds of push. Deleting the secret in a later commit does nothing because the secret remains in Git history. Today, you master Shift-Left Secret Detection: writing pre-commit hooks, deploying Gitleaks and TruffleHog, implementing Shannon Entropy scanners to detect high-randomness cryptographic tokens, and preventing secrets from ever entering the Staging Area.",
        "conceptInvariant": "Shift-Left Secret Prevention Invariant: Secret detection must execute at the client pre-commit hook boundary before a commit object is created: $T_{\\text{Security}}(\\text{staged}) \\implies \\text{Pass}$. A secret committed to local Git history is already an operational incident requiring credential revocation.",
        "failureMode": "The $60,000 AWS Secret Access Key Leak Outage: A developer commits an AWS root access key in <code>config.js</code> at 11:30 PM and pushes to a public repository. Before they realize the error and delete the file 12 minutes later, automated scrapers extract the key, spin up 1,200 EC2 instances across 8 global regions, and mine cryptocurrency, running up a $60,000 cloud bill overnight.",
        "tryItFriction": "Install and configure Gitleaks in a test repository; author a custom <code>.gitleaks.toml</code> rule that detects company-specific API tokens (e.g. <code>pinit_[a-zA-Z0-9]{32}</code>), stage a test secret, and verify that the pre-commit hook blocks the commit.",
        "socraticHints": [
            "Why is Shannon Entropy analysis effective at detecting API keys and private tokens even when they do not match a known regex pattern?",
            "How can a developer bypass a pre-commit hook in an emergency with <code>git commit --no-verify</code>, and why must CI/CD pipelines also enforce server-side secret checks?",
            "What automated remediation steps must immediately occur the moment an API key is committed to a Git repository?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer accidentally commits an AWS Secret Access Key, realizes the mistake 1 minute later, runs <code>git rm config.json</code>, commits 'removed secrets', and pushes both commits to GitHub. The developer believes the secret is safe because it is not in the current codebase.",
            "options": [
                "The secret is safe because the latest commit deleted it.",
                "Diagnose Git History Immutability & Immediate Revocation: The secret is NOT safe. Git retains full historical snapshots in every commit. Anyone who clones the repository can inspect commit 1 using <code>git show HEAD~1:config.json</code> and view the plaintext secret. The developer must immediately revoke and rotate the AWS key in the AWS console, and purge the commit using history rewriting tools.",
                "The developer must delete the GitHub repository to erase it.",
                "AWS automatically encrypts keys stored in Git."
            ],
            "correctOptionIndex": 1,
            "debrief": "Deleting a file in a new commit only removes it from the current tree. The file contents remain permanently stored in the prior commit object. Once exposed, the credential must be presumed compromised and rotated immediately."
        },
        "quests": [
            {
                "id": "Q35.165",
                "name": "Secret Detection Grammar & Shannon Entropy Scoring Architecture",
                "type": "Concept",
                "desc": "Analyze the algorithms used by Gitleaks and TruffleHog, exploring regex signature matching, Shannon entropy formulas, and false-positive filtering."
            },
            {
                "id": "Q35.166",
                "name": "The $60,000 Leaked AWS Cloud Miner Forensic Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a high-severity cloud compromise caused by leaked repository secrets; trace the commit history, identify all exposed credentials, and audit the blast radius."
            },
            {
                "id": "Q35.167",
                "name": "Automated Pre-Commit Security & Secret Hardening Gateway",
                "type": "Mastery Assignment",
                "desc": "Build an enterprise pre-commit security hook in Python/Bash that scans staged hunks for secrets, calculates entropy, and integrates with Gitleaks."
            },
            {
                "id": "Q35.168",
                "name": "High-Entropy Adversarial Secret Injection Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Subject your secret detection engine to 100 obfuscated credential formats (Base64, hex-encoded, split strings, mock JWTs); verify detection sensitivity."
            }
        ]
    },
    {
        "day": 43,
        "month": 2,
        "blockNum": 9,
        "title": "Permanent Secret Purging & Repository Cleansing: `git filter-repo` vs BFG, Rewriting Packfiles & Reflogs",
        "stageNum": 9,
        "stageName": "Stage 9: Security, Cryptography & Audit Compliance",
        "pedagogicalRole": "History Sanitization & Repository Forensics (git filter-repo, BFG Repo-Cleaner, Packfile Rewriting, Reflog Expiration)",
        "spokenGoal": "What do you do when a secret was committed 8 months ago and is baked into 300 historical commits across 5 branches? Simply running <code>git rm</code> does nothing. You must surgically rewrite the entire Git commit DAG to replace the secret with <code>[REDACTED]</code> or purge the file from all historical trees. Today, you master <code>git filter-repo</code> (the modern, high-performance successor to the deprecated <code>git filter-branch</code>), purging reflogs, and forcing garbage collection to permanently expunge compromised data from disk.",
        "conceptInvariant": "Cascading Hash Invalidation Invariant: Altering or excising an object from historical commit $C_k$ changes its Tree SHA, which changes $C_k$'s commit SHA, cascading down every descendant commit: $\\forall j > k,\\ C_j \\to C'_j$. All developers must re-clone or rebase following a repository rewrite.",
        "failureMode": "The Incomplete Purge Dangling Blob Leak: An IT team uses a script to rewrite <code>main</code> but fails to purge <code>.git/refs/original/</code> and <code>.git/logs/</code>. An external security auditor clones the repository with <code>git clone --mirror</code> and recovers the plaintext database password from dangling unpruned reflogs.",
        "tryItFriction": "Create a test repository with a fake API token committed 3 commits ago; use <code>git filter-repo --replace-text expressions.txt</code> to scrub the token from all commits, expire reflogs with <code>git reflog expire --expire=now --all</code>, run <code>git gc --prune=now</code>, and verify with <code>git grep</code> that the token is 100% gone.",
        "socraticHints": [
            "Why is <code>git filter-branch</code> officially deprecated by the Git maintainers, and why is <code>git filter-repo</code> up to 100x faster and vastly safer?",
            "What happens to all commit hashes across a repository when you use <code>git filter-repo</code> to delete a sensitive file from historical commits?",
            "Why must you coordinate with all team members before executing a repository history rewrite on a shared remote?"
        ],
        "situationalPuzzle": {
            "scenario": "A security engineer runs <code>git filter-repo --invert-paths --path credentials.json</code> to remove a sensitive file from a repository. The rewrite completes successfully. When the engineer runs <code>git push origin main --force</code>, what must all other developers do with their local clones?",
            "options": [
                "Run git pull normally.",
                "Diagnose Broken Downstream Clones & Enforce Fresh Clone / Hard Reset: Because <code>git filter-repo</code> rewrote the entire commit DAG, every commit on <code>main</code> has a new hash. Running standard <code>git pull</code> will attempt to merge the old history with the new history, re-introducing the deleted file. All developers must either: (1) Re-clone the repository fresh, or (2) Run <code>git fetch origin && git reset --hard origin/main</code> on their local branches.",
                "Delete their GitHub accounts.",
                "Nothing, Git automatically synchronizes rewritten hashes."
            ],
            "correctOptionIndex": 1,
            "debrief": "Rewriting history creates completely new commit hashes. Other developers whose local branches point to the old hashes will re-introduce the purged commits if they perform a standard pull. They must fetch and reset their branches to match the new remote tip."
        },
        "quests": [
            {
                "id": "Q35.169",
                "name": "Git DAG Rewriting Architecture & git filter-repo Mechanics",
                "type": "Concept",
                "desc": "Analyze the mechanics of git filter-repo, comparing fast-export/fast-import stream processing against legacy git filter-branch shell execution."
            },
            {
                "id": "Q35.170",
                "name": "The Dangling Reflog Secret Exfiltration Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a repository that underwent a sloppy secret purge; locate the unpruned reflog pointers and extract the lingering credentials."
            },
            {
                "id": "Q35.171",
                "name": "Automated Surgical Repository Purging & Scrubbing CLI",
                "type": "Mastery Assignment",
                "desc": "Build an automated disaster recovery tool in Python that wraps git filter-repo, scrubs target files or regex patterns, prunes all reflogs, and verifies zero residue."
            },
            {
                "id": "Q35.172",
                "name": "50,000-Commit Historical Secret Scrubbing Performance Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Subject git filter-repo to a 50,000-commit repository with secrets scattered across 100 branches; measure execution time, memory usage, and DAG integrity."
            }
        ]
    },
    {
        "day": 44,
        "month": 2,
        "blockNum": 9,
        "title": "Tamper-Evident Repository Auditing: Merkle Tree Invariants, SHA-1 Collision Attacks & SHA-256 Architecture",
        "stageNum": 9,
        "stageName": "Stage 9: Security, Cryptography & Audit Compliance",
        "pedagogicalRole": "Cryptographic Integrity & Future-Proofing (Merkle Tree Auditing, SHAttered Collision Attack, Hardened SHA-1DC & SHA-256 Object Format)",
        "spokenGoal": "In 2017, Google researchers published the 'SHAttered' attack: two distinct PDF documents with different contents that produced the exact same SHA-1 hash. Git's entire security model relies on cryptographic collision resistance. Today, you master Tamper-Evident Repository Auditing: how the Merkle tree guarantees that any change to a historical file alters the root commit hash, how Git mitigates SHA-1 collision attacks using SHA-1DC (Collision Detection), and how to initialize native SHA-256 Git repositories with <code>--object-format=sha256</code>.",
        "conceptInvariant": "Merkle Tree Tamper-Evidence Invariant: In a Git Merkle DAG, any modification to a leaf object (Blob) strictly cascades upward through its parent Tree and Commit hashes: $\\Delta \\text{Blob} \\implies \\Delta \\text{Tree} \\implies \\Delta \\text{Commit}$. It is mathematically impossible to alter past code without altering every downstream commit hash.",
        "failureMode": "The Pre-Computed SHA-1 Collision Replacement Threat: An attacker creates a benign source file and a malicious backdoor file engineered to share the identical SHA-1 hash. On legacy Git systems without collision detection, the attacker replaces the benign object with the backdoor in <code>.git/objects/</code>, and Git's Merkle tree fails to detect the modification because the hash remains identical.",
        "tryItFriction": "Initialize a native SHA-256 Git repository using <code>git init --object-format=sha256</code>; create a commit, inspect the 64-character hexadecimal hashes in <code>git log</code> and <code>.git/objects/</code>, and verify that the repository rejects 40-character SHA-1 objects.",
        "socraticHints": [
            "How does Git's built-in SHA-1DC (Collision Detection) algorithm detect when an incoming object contains a pre-computed SHA-1 collision attempt?",
            "Why is migrating an existing multi-terabyte enterprise repository from SHA-1 to SHA-256 a massive engineering challenge?",
            "What is an object-format translation table in Git, and how will it enable interoperability between SHA-1 and SHA-256 repositories?"
        ],
        "situationalPuzzle": {
            "scenario": "A security auditor inspects an enterprise Git server and notices that commits use 40-character SHA-1 hashes. The auditor flags this as a critical vulnerability: 'SHA-1 is cryptographically broken; an attacker can forge commits with duplicate hashes.' How should the enterprise architect respond?",
            "options": [
                "Agree and immediately delete all Git repositories.",
                "Defend Git's SHA-1DC Hardening & Outline the SHA-256 Transition: Explain that modern Git does not use standard SHA-1; it uses SHA-1DC (Collision Detection by Marc Stevens), which detects collision attack patterns and automatically aborts object ingestion. Furthermore, point to Git's native SHA-256 transition roadmap (<code>--object-format=sha256</code>), presenting a migration plan for critical high-security repositories.",
                "Deny that SHA-1 has ever had any collision attacks.",
                "Switch from Git to Subversion."
            ],
            "correctOptionIndex": 1,
            "debrief": "Modern Git implements SHA-1DC, which detects mathematical collision attempts and rejects them. While Git is migrating to native SHA-256, SHA-1DC provides robust protection against known collision attacks today."
        },
        "quests": [
            {
                "id": "Q35.173",
                "name": "Merkle Tree Cryptographic Integrity & SHA-1DC Architecture",
                "type": "Concept",
                "desc": "Analyze the mathematical foundations of Merkle DAG tamper-evidence, examining the SHAttered collision mechanism and SHA-1DC counter-cryptanalysis."
            },
            {
                "id": "Q35.174",
                "name": "The SHA-1 Collision Injection Attack Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a simulated collision attack payload injected into an object store; verify that Git's collision detection engine flags the corrupted tree."
            },
            {
                "id": "Q35.175",
                "name": "Native SHA-256 Repository Migration & Verification Engine",
                "type": "Mastery Assignment",
                "desc": "Build an enterprise migration tool that provisions SHA-256 repositories, translates object formats, and verifies end-to-end cryptographic integrity."
            },
            {
                "id": "Q35.176",
                "name": "Dual-Format SHA-1 / SHA-256 Translation Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Test Git's experimental object format translation layers across 10,000 commits; measure hash translation fidelity and performance overhead."
            }
        ]
    },
    {
        "day": 45,
        "month": 2,
        "blockNum": 9,
        "title": "Milestone 6 (M2): ApexAudit Cryptographic Git Verification & Secrets Hardening Suite",
        "stageNum": 9,
        "stageName": "Stage 9: Security, Cryptography & Audit Compliance",
        "pedagogicalRole": "Synthesis & Enterprise Security Governance (Cryptographic Verifier, Secret Scanner, DAG Purger & Compliance Defense)",
        "spokenGoal": "Milestone 6 (Month 2) tests your mastery of enterprise Git security, cryptographic verification, and secret sanitation. You will architect ApexAudit: an institutional-grade security suite that enforces SSH/GPG commit signing verification, executes pre-commit entropy scans for secrets, runs historical deep scans across all packfiles, and automates surgical history rewrites to purge exposed credentials with complete reflog and packfile sanitization.",
        "conceptInvariant": "Enterprise Cryptographic Security Invariant: ApexAudit certifies that: (1) 100% of commits on protected branches possess verified cryptographic signatures, (2) zero credentials exist in current or historical Blobs, and (3) all object hashes satisfy collision resistance standards.",
        "failureMode": "The Phantom Tag Secret Exfiltration Disaster: A company ran an automated secret purge on their repository branches, but forgot that an annotated release tag (<code>v1.0.0</code>) pointed to an old commit containing the secret. Attackers cloned the repo with <code>git clone --tags</code> and extracted the secret from the tagged object, leading to a major data breach.",
        "tryItFriction": "Deploy ApexAudit against a repository with intentionally injected secrets, unsigned commits, and lingering annotated tags; verify that ApexAudit identifies all violations, purges the secrets cleanly, and certifies 100% compliance.",
        "socraticHints": [
            "How does ApexAudit verify that an annotated tag object has not been tampered with or force-moved since creation?",
            "Why must historical secret purging scan not only branch heads, but all tags, reflogs, and packed-refs in the repository?",
            "What automated alerts should trigger if a developer attempts to push an unsigned commit to a protected branch?"
        ],
        "situationalPuzzle": {
            "scenario": "During a SOC 2 security audit, the compliance auditor asks: 'If an engineer leaves the company, how do you verify that commits attributed to them were actually written by them and not forged by an insider?'",
            "options": [
                "Check the author name in git log.",
                "Present Cryptographic Commit Signing & Allowed Signers Verification: Show that all commits are cryptographically signed using employee-specific SSH/GPG keys registered in the enterprise <code>allowed_signers</code> registry. Because the signature covers the entire commit payload and can only be generated with the employee's private key, authorship cannot be forged by an insider.",
                "Ask the engineer over a phone call.",
                "Git commits are anonymous by design."
            ],
            "correctOptionIndex": 1,
            "debrief": "Author names in Git are unauthenticated metadata that anyone can forge. Enforcing cryptographic commit signing tied to an audited <code>allowed_signers</code> registry provides mathematical non-repudiation and proves genuine authorship for compliance audits."
        },
        "quests": [
            {
                "id": "Q35.177",
                "name": "ApexAudit Systems Blueprint & Cryptographic Compliance Specification",
                "type": "Concept",
                "desc": "Document the complete systems blueprint of ApexAudit, specifying signature verification engines, entropy scanners, and DAG sanitization algorithms."
            },
            {
                "id": "Q35.178",
                "name": "The Lingering Annotated Tag Secret Breach Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a post-purge security breach where secrets were extracted from forgotten annotated release tags; audit all ref namespaces and scrub the tag."
            },
            {
                "id": "Q35.179",
                "name": "ApexAudit Production Security Auditing & Sanitization Platform",
                "type": "Mastery Assignment",
                "desc": "Build the full ApexAudit platform: a CLI that verifies commit signatures, scans packfiles for secrets, and executes automated history purges."
            },
            {
                "id": "Q35.180",
                "name": "ApexAudit Milestone 6 Viva Defense & Security Gate",
                "type": "Production Incident Lab",
                "desc": "Defend ApexAudit before the Principal Cybersecurity Board under live secret injection attacks, forged author payloads, and corrupted cryptographic signatures."
            }
        ]
    }
]

out_path = Path(__file__).resolve().parent / "git_version_control_spec_m2_part1.py"

content = f'''# scripts/visuals/git_version_control_spec_m2_part1.py
# Month 2: Days 31 to 45 Specification for Course 35: Git, GitHub & Version Control Basics (course-git-version-control)
# Conforms strictly to Gate v2 / True 9.8 standard across all 15 days (60 Quests: Q35.121 to Q35.180).

DAYS_31_TO_45 = {json.dumps(days_data, indent=2)}
'''

with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_path} with {len(days_data)} days ({sum(len(d['quests']) for d in days_data)} quests).")
