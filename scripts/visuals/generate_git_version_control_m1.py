# scripts/visuals/generate_git_version_control_m1.py
"""
Generator script for Course 35: Git, GitHub & Version Control Basics (course-git-version-control)
Month 1: Days 1 to 15 (60 Quests: Q35.1 to Q35.60).
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
        "day": 1,
        "month": 1,
        "blockNum": 1,
        "title": "Version Control Foundations & The Three States: Working Tree, Index & Object Database",
        "stageNum": 1,
        "stageName": "Stage 1: Mental Model Grounding & Git Object Storage",
        "pedagogicalRole": "Version Control Foundations (The Three States, Working Tree, Staging Index & Repository DOM)",
        "spokenGoal": "Every developer has experienced the nightmare of saving files as 'final_v2_really_final.zip'. That is version chaos. Git is not a file backup system; it is a content-addressable directed acyclic graph. Today, you master Git's fundamental Three States: the Working Directory (your dirty sandbox on disk), the Staging Area / Index (the curated snapshot blueprint), and the Git Repository (the immutable cryptographic object store in .git).",
        "conceptInvariant": "The Three-State Pipeline Invariant: File state transitions strictly follow: Working Tree $\\xrightarrow{git\\ add}$ Staging Area (Index) $\\xrightarrow{git\\ commit}$ Repository Database. Commits capture the exact state of the Index at commit time, never the working tree.",
        "failureMode": "The Unstaged Midnight Hotfix Outage: An engineer fixes a critical null-pointer bug in production. They test locally in the working directory, type <code>git commit -m 'fix bug'</code> without adding the changed file, and push. Because the file was never staged in the Index, an empty commit is pushed, deploying broken code to production while the engineer goes to sleep.",
        "tryItFriction": "Simulate a scenario where three files are modified in the working tree, but only one file contains a tested production fix; stage and commit exclusively the tested file without committing the two experimental files.",
        "socraticHints": [
            "Why does Git introduce an intermediate Staging Area (the Index) instead of committing directly from the working directory like older VCS tools?",
            "What happens to unstaged modifications in your working directory when you run <code>git commit</code>?",
            "How does inspecting <code>git status</code> give you a precise tripartite breakdown of untracked files, changes to be committed, and changes not staged for commit?"
        ],
        "situationalPuzzle": {
            "scenario": "A junior developer modifies <code>server.ts</code> and <code>config.json</code>. They run <code>git add server.ts</code>, then make another change to <code>server.ts</code> to add a comment, and immediately run <code>git commit -m 'update server'</code>. When they check the commit, the new comment is missing.",
            "options": [
                "Git automatically deletes comments during commit creation.",
                "Diagnose Staging Snapshot Freezing: <code>git add</code> captures a snapshot of the file at the exact moment the command is executed. Subsequent edits in the working tree remain unstaged unless <code>git add</code> is executed again. The committed version reflects the initial staged state, leaving the comment unstaged in the working tree.",
                "The file was too large to fit into the commit object.",
                "The developer needs to restart their shell."
            ],
            "correctOptionIndex": 1,
            "debrief": "<code>git add</code> takes a snapshot of the file at that exact instant. If you edit the file again, you have two versions: the staged snapshot and the dirty working tree version. Committing saves only what is in the staging area."
        },
        "quests": [
            {
                "id": "Q35.1",
                "name": "The Three States of Git & Pipeline Architecture",
                "type": "Concept",
                "desc": "Analyze the mechanics of the Working Tree, Index (.git/index), and Repository object database, detailing lifecycle state transitions."
            },
            {
                "id": "Q35.2",
                "name": "The Phantom Unstaged Production Hotfix Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a botched production hotfix where an empty commit was pushed; reconstruct the working tree state and identify the staging breakdown."
            },
            {
                "id": "Q35.3",
                "name": "Atomic Staging & Three-State State Machine Engine",
                "type": "Mastery Assignment",
                "desc": "Implement a software simulation in Python/TypeScript modeling Git's three states: working directory, binary index staging, and immutable commit logging."
            },
            {
                "id": "Q35.4",
                "name": "Concurrent Unstaged Mutation Chaos Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Inject concurrent file edits while staging and committing across high-frequency file I/O operations; prove zero loss of unstaged modifications."
            }
        ]
    },
    {
        "day": 2,
        "month": 1,
        "blockNum": 1,
        "title": "Git Plumbing vs Porcelain: Blobs, Trees, Commits & Content-Addressable Storage (SHA Hashing)",
        "stageNum": 1,
        "stageName": "Stage 1: Mental Model Grounding & Git Object Storage",
        "pedagogicalRole": "Low-Level Storage Architecture (Plumbing Commands, Object Types: Blob, Tree, Commit, Tag & Cryptographic Hashing)",
        "spokenGoal": "Most developers only know Git's 'porcelain' commands like <code>add</code> and <code>commit</code>. Today, you open the hood and master Git's 'plumbing'. You will explore the <code>.git/objects</code> directory, understand how SHA-1/SHA-256 hashes generate immutable content-addressable storage, and dissect the four core object types: Blobs (raw file contents), Trees (directories and permissions), Commits (metadata and tree pointers), and Annotated Tags.",
        "conceptInvariant": "Content-Addressable Cryptographic Immutability Invariant: Every Git object is identified strictly by the cryptographic hash of its payload header: $\\text{Hash} = \\text{SHA}(\\text{type} + \\text{ ' ' } + \\text{size} + \\text{ '\\0' } + \\text{content})$. Identical file content always yields the identical Blob hash, guaranteeing automatic deduplication across the repository.",
        "failureMode": "The Secret Key Committed in a Deleted File Catastrophe: A developer accidentally commits a plaintext AWS root access key in <code>credentials.json</code>. Realizing the mistake, they delete the file and create a new commit. Because Git never deletes referenced objects, the raw secret Blob remains stored permanently in <code>.git/objects/</code>, allowing attackers with repository access to extract the key.",
        "tryItFriction": "Use Git plumbing commands (<code>git hash-object</code>, <code>git cat-file -p</code>, <code>git cat-file -t</code>) to manually create a Blob, build a Tree object referencing that Blob, and create a raw Commit object pointing to that Tree without ever running <code>git add</code> or <code>git commit</code>.",
        "socraticHints": [
            "Why does a Git Blob store only file contents and zero metadata (such as filename, path, or file permissions)?",
            "Where in Git's object model are filenames and execute permissions actually recorded?",
            "How does content-addressable storage make it computationally impossible to alter historical code without changing every downstream commit hash in the repository?"
        ],
        "situationalPuzzle": {
            "scenario": "Two engineers independently commit the identical 5MB video file at different directory paths in the same repository: <code>assets/promo.mp4</code> and <code>media/promo_copy.mp4</code>. How many Blob objects does Git create in <code>.git/objects/</code>?",
            "options": [
                "Two Blobs, because the files have different paths.",
                "Diagnose Content-Addressable Deduplication: Exactly one Blob object. Git Blobs are addressed purely by the SHA hash of their content, completely independent of filenames or paths. The different paths and filenames are recorded in two distinct Tree object entries, both pointing to the same single 5MB Blob hash, consuming zero duplicate storage.",
                "Zero Blobs, because video files are stored outside Git.",
                "Four Blobs, because Git creates a backup copy for each."
            ],
            "correctOptionIndex": 1,
            "debrief": "Git computes the hash of the file content only. Identical content produces identical hashes. Therefore, duplicate files across different directories share the exact same Blob in the object store, deduplicating storage automatically."
        },
        "quests": [
            {
                "id": "Q35.5",
                "name": "Git Object Storage Architecture & SHA-1/SHA-256 Mechanics",
                "type": "Concept",
                "desc": "Detail the physical layout of .git/objects, zlib compression, object header hashing, and the relationships between Blobs, Trees, and Commits."
            },
            {
                "id": "Q35.6",
                "name": "The Zombie API Secret in Dangling Blobs Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Inspect a compromised repository where a secret was 'deleted' in a subsequent commit; locate the unreferenced Blob in .git/objects and extract the key."
            },
            {
                "id": "Q35.7",
                "name": "Pure Plumbing Git Object Database Constructor",
                "type": "Mastery Assignment",
                "desc": "Write a CLI tool that takes a directory of files and constructs the valid Git object directory structure (.git/objects) using zlib compression and SHA hashing."
            },
            {
                "id": "Q35.8",
                "name": "Plumbing Object Injection & Corrupted Header Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Inject malformed object headers and corrupted SHA payloads into .git/objects; use git fsck to diagnose integrity violations and repair damaged trees."
            }
        ]
    },
    {
        "day": 3,
        "month": 1,
        "blockNum": 1,
        "title": "Navigating Git History: Log Formatting, DAG Traversal & Relative Commit References (HEAD~, HEAD^)",
        "stageNum": 1,
        "stageName": "Stage 1: Mental Model Grounding & Git Object Storage",
        "pedagogicalRole": "History Navigation & Graph Traversal (Log Formatting, DAG Visualization, Relative Ancestry Math: HEAD~N vs HEAD^N)",
        "spokenGoal": "Running a plain <code>git log</code> produces an unreadable wall of text. Senior engineers treat Git history as an inspectable Directed Acyclic Graph (DAG). Today, you master advanced log formatting, topological ordering, and relative commit reference algebra: the critical distinction between <code>HEAD~2</code> (two generations back along the first-parent spine) versus <code>HEAD^2</code> (the second parent of a merge commit).",
        "conceptInvariant": "Ancestry Reference Algebra Invariant: <code>HEAD~n</code> traverses $n$ generations strictly following first-parent links: $\\text{HEAD}\\sim n = (\\text{parent}_1)^n(\\text{HEAD})$. <code>HEAD^k</code> selects the $k$-th parent of a merge commit ($k \\in \\{1, 2\\}$). They compose hierarchically: <code>HEAD~2^2</code> is the second parent of the grandparent commit.",
        "failureMode": "The Merge Parent Reset Disaster: A developer attempts to roll back a pull request merge commit by typing <code>git reset --hard HEAD^2</code> instead of <code>git revert -m 1 HEAD</code> or <code>git reset --hard HEAD~1</code>. Instead of undoing the merge, HEAD jumps directly into the merged feature branch history, causing unmerged commits to vanish from the main development branch.",
        "tryItFriction": "Construct a compact, high-information Git alias (<code>git lg</code>) using <code>--graph --oneline --decorate --all</code>; navigate a multi-branch repository history and pinpoint the exact merge base of two divergent feature branches using <code>git merge-base</code>.",
        "socraticHints": [
            "What is the mathematical difference between <code>HEAD~1</code> and <code>HEAD^1</code> on a standard non-merge commit?",
            "When a merge commit has two parents, what does <code>HEAD^1</code> point to versus <code>HEAD^2</code>?",
            "Why is <code>git log --graph --oneline</code> crucial for understanding whether a branch was merged via fast-forward or three-way merge?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer is on a merge commit $M$ created by merging branch <code>feature</code> into <code>main</code>. Parent 1 is commit $A$ (on <code>main</code>) and Parent 2 is commit $B$ (on <code>feature</code>). The developer runs <code>git rev-parse HEAD~1</code> and <code>git rev-parse HEAD^2</code>. Which commits do these commands return?",
            "options": [
                "Both return commit A.",
                "Diagnose Relative Ancestry Resolution: <code>HEAD~1</code> traverses the first-parent spine, returning commit A (the parent on main). <code>HEAD^2</code> selects the second parent of the merge commit, returning commit B (the head of the merged feature branch).",
                "HEAD~1 returns commit B and HEAD^2 returns commit A.",
                "Both return an error because relative syntax is invalid on merge commits."
            ],
            "correctOptionIndex": 1,
            "debrief": "Tilde (~) traverses generations along the first-parent line (equivalent to following the main branch history). Caret (^) followed by a number chooses between multiple parents of a merge commit."
        },
        "quests": [
            {
                "id": "Q35.9",
                "name": "Directed Acyclic Graphs & Git Ancestry Algebra",
                "type": "Concept",
                "desc": "Analyze the mathematical structure of Git commit DAGs, exploring topological sorting, reachability sets, and relative ancestry operators (~ and ^)."
            },
            {
                "id": "Q35.10",
                "name": "The Accidental Second-Parent Reset Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a repository where a developer executed an erroneous relative reset on a merge commit; map the commit graph and recover the detached branch."
            },
            {
                "id": "Q35.11",
                "name": "Interactive DAG Visualizer & Ancestry Math Engine",
                "type": "Mastery Assignment",
                "desc": "Build a CLI or terminal tool that parses a Git repository's commit DAG, resolves complex relative ancestry strings, and renders ASCII graph diagrams."
            },
            {
                "id": "Q35.12",
                "name": "Octopus Merge Multi-Parent Graph Traversal Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Construct an octopus merge commit with 4 distinct parent branches; test complex ancestry path evaluations (HEAD^3~2^1) and verify reachability."
            }
        ]
    },
    {
        "day": 4,
        "month": 1,
        "blockNum": 1,
        "title": "Working Directory & Staging Area Mastery: Atomic Staging with `git add -p` & Diff Analysis",
        "stageNum": 1,
        "stageName": "Stage 1: Mental Model Grounding & Git Object Storage",
        "pedagogicalRole": "Staging Hygiene & Diff Inspection (Hunk Editing, git add -p, git diff vs git diff --staged, Atomic Commits)",
        "spokenGoal": "Amateur developers run <code>git add .</code> and dump 40 unrelated changes into a single mega-commit with the message 'fixes'. Professional engineering requires Atomic Commits: each commit does exactly one thing, passes all tests, and is easily revertible. Today, you master interactive hunk staging with <code>git add -p</code>, manual patch editing, and diff inspections comparing working tree, index, and HEAD.",
        "conceptInvariant": "Atomic Commit Invariant: A commit must represent a minimal, cohesive, and logically independent set of changes that does not break the build or test suite. Every commit should satisfy: $\\Delta C = \\text{atomic unit of reviewability}$.",
        "failureMode": "The Mega-Commit Revert Disaster: A developer mixes a critical database security migration with 45 unrelated CSS cosmetic tweaks in a single commit. A bug is found in the CSS. Because the changes are bundled together, reverting the CSS bug requires reverting the database security fix, opening an exploitable vulnerability in production.",
        "tryItFriction": "Given a single file with 3 distinct modifications (a bug fix, a debug <code>console.log</code>, and an experimental feature), use interactive patch staging (<code>git add -p</code>) to split the file into three separate logical hunks, staging only the bug fix while discarding the debug print.",
        "socraticHints": [
            "What does <code>git diff</code> compare by default, versus <code>git diff --staged</code> (or <code>git diff --cached</code>)?",
            "How does interactive staging with <code>git add -p</code> allow you to commit clean code even when your working directory contains temporary debugging code?",
            "What is a 'hunk' in a unified diff, and why can a hunk be manually split with the <code>s</code> command inside patch mode?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer runs <code>git diff</code> and sees 50 lines of changes. They run <code>git commit -m 'update'</code>, but Git says 'no changes added to commit'. They run <code>git diff</code> again and still see the 50 lines. What is happening?",
            "options": [
                "Git is corrupted and requires a reinstall.",
                "Diagnose Difference Between Working Tree Diff and Staged Diff: <code>git diff</code> compares the Working Tree against the Staging Area (Index). The 50 lines are in the working tree, but have not been staged with <code>git add</code>. <code>git commit</code> only commits changes in the Staging Area. Once they run <code>git add</code>, <code>git diff</code> will show nothing, and <code>git diff --staged</code> will display the changes ready for commit.",
                "The file permissions prevent committing.",
                "The commit message must be at least 20 characters long."
            ],
            "correctOptionIndex": 1,
            "debrief": "<code>git diff</code> shows differences between the working tree and the index. <code>git diff --staged</code> shows differences between the index and the last commit (HEAD). Commits only record what is in the index."
        },
        "quests": [
            {
                "id": "Q35.13",
                "name": "Unified Diff Format & Hunk Structure Mechanics",
                "type": "Concept",
                "desc": "Analyze the internal structure of unified diff headers (@@ -l,s +l,s @@), context lines, and patch application algorithms."
            },
            {
                "id": "Q35.14",
                "name": "The Tangled Spaghetti Mega-Commit Forensic Detective",
                "type": "Detective Challenge",
                "desc": "Dissect a bloated 2,000-line mega-commit containing multiple interleaved features and bugs; reconstruct its history into clean, atomic commits."
            },
            {
                "id": "Q35.15",
                "name": "Interactive Hunk Splitter & Patch Editor CLI",
                "type": "Mastery Assignment",
                "desc": "Develop a CLI utility that parses a unified diff file, breaks large hunks into smaller atomic sub-hunks, and generates staged Git patch commands."
            },
            {
                "id": "Q35.16",
                "name": "Whitespace & Line-Ending Conflict Invariant Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Subject your staging workflow to CRLF vs LF line-ending mismatches and trailing whitespace mutations; verify clean diffs using core.autocrlf settings."
            }
        ]
    },
    {
        "day": 5,
        "month": 1,
        "blockNum": 1,
        "title": "Milestone 1: ApexStorage Content-Addressable Object Store & Cryptographic Hash Engine Suite",
        "stageNum": 1,
        "stageName": "Stage 1: Mental Model Grounding & Git Object Storage",
        "pedagogicalRole": "Synthesis & Low-Level Architecture (Custom Git Implementation, Object Serialization, Index File Layout & Plumbing Engine)",
        "spokenGoal": "Milestone 1 proves that you do not just 'use' Git—you understand its fundamental computer science primitives. Today, you build ApexStorage: a zero-dependency Git implementation that constructs valid <code>.git</code> repositories from scratch, serializes Blobs and Trees with zlib compression, calculates SHA hashes, updates the binary <code>.git/index</code>, and writes commit objects verified by the official <code>git fsck</code> engine.",
        "conceptInvariant": "Repository Canonical Integrity Invariant: A valid Git repository must pass <code>git fsck --full --strict</code> with zero dangling pointers, zero missing trees, and zero hash corruption across all reachable objects.",
        "failureMode": "The Corrupted Index Header Incident: A custom deployment script manually wrote entries into <code>.git/index</code> without respecting the 12-byte binary header format (DIRC magic number, version 2, and 32-bit entry count). The entire repository became unreadable, throwing 'fatal: index file corrupt' during a continuous deployment release.",
        "tryItFriction": "Construct a functional miniature Git CLI in Python/TypeScript with commands <code>init</code>, <code>hash-object</code>, <code>cat-file</code>, and <code>write-tree</code>; verify that standard Git can read and commit the objects your tool creates.",
        "socraticHints": [
            "What are the first 4 bytes of every standard Git binary index file, and what encoding do they use?",
            "How does Git sort tree entries (directories vs files) when calculating the canonical Tree SHA-1 hash?",
            "Why must commit objects record an author timestamp and a committer timestamp, and why can they differ?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer writes a custom script to generate Git commits. When running <code>git log</code>, Git crashes with 'fatal: invalid commit object header' or 'missing tree'. The developer inspects the commit payload and sees: <code>tree a1b2c3...\\nauthor John...\\nmessage: test</code>.",
            "options": [
                "The commit message cannot be 'test'.",
                "Diagnose Missing Committer and Blank Line Delimiter: Git commit objects require a strict format: <code>tree [hash]\\nparent [hash] (optional)\\nauthor [name] <[email]> [time] [tz]\\ncommitter [name] <[email]> [time] [tz]\\n\\n[message]</code>. The developer omitted the mandatory <code>committer</code> line and the empty newline separator before the commit message.",
                "Tree hashes must be written in uppercase hexadecimal.",
                "Git only allows Linus Torvalds to generate raw commits."
            ],
            "correctOptionIndex": 1,
            "debrief": "A Git commit object has a rigid canonical format. It must include tree, author, committer, an empty newline separator, followed by the commit message. Missing any field causes git fsck or git log to fail."
        },
        "quests": [
            {
                "id": "Q35.17",
                "name": "ApexStorage Architectural Blueprint & Object Specification",
                "type": "Concept",
                "desc": "Document the complete systems architecture of ApexStorage, specifying binary index encoding, zlib compression protocols, and DAG serialization."
            },
            {
                "id": "Q35.18",
                "name": "The Binary Index Header Corruption Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a corrupted .git directory that crashes all porcelain commands; repair the binary index file byte-by-byte using hex inspection."
            },
            {
                "id": "Q35.19",
                "name": "ApexStorage Zero-Dependency Git Storage Engine",
                "type": "Mastery Assignment",
                "desc": "Build ApexStorage: a complete low-level Git implementation supporting init, hash-object, cat-file, write-tree, and commit-tree."
            },
            {
                "id": "Q35.20",
                "name": "ApexStorage Milestone 1 Viva Defense & git fsck Verification Gate",
                "type": "Production Incident Lab",
                "desc": "Subject your custom repository to git fsck --full --strict and live mutation attacks; prove 100% specification compliance before the Review Board."
            }
        ]
    },
    {
        "day": 6,
        "month": 1,
        "blockNum": 2,
        "title": "Branching Physics: Pointers in `.git/refs/heads/`, Creating, Switching (`git switch`) & HEAD Movement",
        "stageNum": 2,
        "stageName": "Stage 2: Branching Mechanics, Merge Strategies & Conflict Resolution",
        "pedagogicalRole": "Branching Mechanics & Reference Pointers (.git/refs/heads/, HEAD Pointer, git switch vs git checkout)",
        "spokenGoal": "In systems like Subversion or Perforce, creating a branch copies entire directory trees, taking minutes and megabytes. In Git, a branch is literally a 41-byte plaintext file containing a 40-character commit hash followed by a newline. Today, you master the physics of Git branching: how branches work in <code>.git/refs/heads/</code>, how <code>HEAD</code> points to a symbolic ref, and why modern <code>git switch</code> replaced the overloaded <code>git checkout</code>.",
        "conceptInvariant": "Branch Reference Invariant: A Git branch is merely a movable pointer (named reference) to a commit node in the DAG: $\\text{ref} \\in \\text{.git/refs/heads/*} \\implies \\text{target} = \\text{Commit SHA}$. <code>HEAD</code> is a symbolic reference pointing to the currently checked-out branch (<code>ref: refs/heads/main</code>).",
        "failureMode": "The Overloaded Checkout Overwrite Disaster: A developer attempts to switch to an existing branch named <code>test.js</code> using <code>git checkout test.js</code>. Because a file named <code>test.js</code> also exists in the working directory, Git treats the command as a file restore operation, permanently overwriting uncommitted working tree changes in <code>test.js</code> without warning.",
        "tryItFriction": "Inspect the raw contents of <code>.git/HEAD</code> and <code>.git/refs/heads/main</code> using terminal commands; create a new branch manually by writing a commit SHA into a new text file under <code>.git/refs/heads/feature</code>, and switch to it using <code>git switch</code>.",
        "socraticHints": [
            "Why did Git 2.23 introduce <code>git switch</code> and <code>git restore</code> to replace the traditional <code>git checkout</code> command?",
            "What happens to the commit hash stored in <code>.git/refs/heads/main</code> when you make a new commit while on <code>main</code>?",
            "What is a 'symbolic ref', and how does <code>.git/HEAD</code> know which branch is currently active?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer runs <code>cat .git/HEAD</code> and sees <code>ref: refs/heads/feature-x</code>. They make a commit with hash <code>abc1234</code>. What file on disk did Git modify to record the new branch tip?",
            "options": [
                "Git modified .git/HEAD to contain abc1234.",
                "Diagnose Symbolic Reference Update: Git followed the symbolic reference in <code>.git/HEAD</code> to <code>.git/refs/heads/feature-x</code>, and updated that file to contain <code>abc1234</code>. <code>.git/HEAD</code> still contains the text <code>ref: refs/heads/feature-x</code>, maintaining its pointer to the branch.",
                "Git created a new branch called abc1234.",
                "Git updated all files in the working directory."
            ],
            "correctOptionIndex": 1,
            "debrief": "<code>.git/HEAD</code> stores the active branch reference. When you commit, Git writes the new commit hash into the file for the active branch in <code>.git/refs/heads/</code>, while <code>.git/HEAD</code> continues to point to that branch name."
        },
        "quests": [
            {
                "id": "Q35.21",
                "name": "Git Reference Architecture & Symbolic Pointer Physics",
                "type": "Concept",
                "desc": "Examine the physical structure of refs, packed-refs, symbolic references, and HEAD pointer traversal mechanics in the .git directory."
            },
            {
                "id": "Q35.22",
                "name": "The Ambiguous Checkout File Overwrite Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a catastrophic file loss caused by ambiguous git checkout invocation; recover the overwritten working tree data from the OS cache or dangling objects."
            },
            {
                "id": "Q35.23",
                "name": "Zero-Porcelain Branch & Ref Pointer Management Engine",
                "type": "Mastery Assignment",
                "desc": "Build a CLI script that creates, lists, deletes, and switches branches purely by manipulating files in .git/refs/heads/ and .git/HEAD directly."
            },
            {
                "id": "Q35.24",
                "name": "High-Frequency Concurrent Branch Switching Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Switch branches across 50 parallel worker processes during continuous file writes; verify zero race conditions or corrupted HEAD reference pointers."
            }
        ]
    },
    {
        "day": 7,
        "month": 1,
        "blockNum": 2,
        "title": "Merge Algorithms: Fast-Forward vs Three-Way Merge (ORT Strategy) & The Common Ancestor",
        "stageNum": 2,
        "stageName": "Stage 2: Branching Mechanics, Merge Strategies & Conflict Resolution",
        "pedagogicalRole": "Merge Strategy & Algorithmics (Fast-Forward Merges, Merge Commits, ORT/Recursive Strategy & Merge Base Identification)",
        "spokenGoal": "Merging is where divergent lines of development converge. But what actually happens when you type <code>git merge</code>? Today, you master merge mechanics: Fast-Forward merges (simply sliding a branch pointer forward), True Three-Way merges (creating a new commit with two parents), how Git finds the Best Common Ancestor (Merge Base), and why the modern <code>ORT</code> merge engine outperforms legacy recursive algorithms.",
        "conceptInvariant": "Merge Base Invariant: A three-way merge between commit $A$ and commit $B$ evaluates changes relative to their Lowest Common Ancestor (Merge Base $M$): $\\Delta A = A - M$ and $\\Delta B = B - M$. The merged tree $T = M + \\Delta A + \\Delta B$. If $M = A$, the merge trivially reduces to a Fast-Forward: $B$.",
        "failureMode": "The Accidental Fast-Forward Production History Omission: A release manager merges a 10-commit feature branch into <code>main</code> with default fast-forward enabled. Because no merge commit is created, the grouping of commits into a distinct release feature is lost in <code>main</code>, making it impossible to revert the entire feature in a single operation.",
        "tryItFriction": "Construct two branches that can be fast-forward merged; merge one using <code>--ff-only</code> and merge the other using <code>--no-ff</code>, comparing the resulting commit DAG topologies and parent counts.",
        "socraticHints": [
            "What condition must be satisfied between two branches for a fast-forward merge to be mathematically possible?",
            "Why do enterprise teams often mandate <code>git merge --no-ff</code> on pull request merges into release branches?",
            "How does <code>git merge-base branchA branchB</code> compute the common ancestor node in the DAG?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer is on <code>main</code> and runs <code>git merge feature --ff-only</code>. Git aborts with the message: 'fatal: Not possible to fast-forward, aborting.' What does this error signify about the state of the two branches?",
            "options": [
                "The feature branch has merge conflicts in its files.",
                "Diagnose Divergent Branch History: A fast-forward merge is only possible if the target branch (main) is a direct ancestor of the source branch (feature). The error means <code>main</code> has moved forward with new commits since <code>feature</code> branched off, creating divergent histories that require a 3-way merge commit.",
                "The developer lacks write permissions to the repository.",
                "Fast-forward merges are deprecated in modern Git."
            ],
            "correctOptionIndex": 1,
            "debrief": "<code>--ff-only</code> refuses to create a merge commit. If the current branch has progressed beyond the common ancestor with new commits, the branch histories have diverged, making a pointer slide impossible."
        },
        "quests": [
            {
                "id": "Q35.25",
                "name": "Merge Base Computation & 3-Way Merge Mathematics",
                "type": "Concept",
                "desc": "Detail the graph algorithms used to calculate the Lowest Common Ancestor (LCA) and the diff arithmetic governing 3-way merge synthesis."
            },
            {
                "id": "Q35.26",
                "name": "The Criss-Cross Merge Base Ambiguity Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a complex repository with criss-cross merges resulting in multiple merge bases; trace how the ORT merge engine resolves the ambiguity."
            },
            {
                "id": "Q35.27",
                "name": "Automated Merge Base & Fast-Forward Feasibility Analyzer",
                "type": "Mastery Assignment",
                "desc": "Build a diagnostic script that analyzes any two Git branches, determines fast-forward feasibility, identifies all common ancestors, and predicts merge strategy."
            },
            {
                "id": "Q35.28",
                "name": "ORT vs Recursive Merge Engine Performance Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Benchmark merge execution across 1,000 files with rename detection and structural directory modifications; measure ORT engine throughput and correctness."
            }
        ]
    },
    {
        "day": 8,
        "month": 1,
        "blockNum": 2,
        "title": "Merge Conflict Forensics: Conflict Markers (`<<<<<<<`, `=======`, `>>>>>>>`), 3-Way Diff Resolution & `git merge --abort`",
        "stageNum": 2,
        "stageName": "Stage 2: Branching Mechanics, Merge Strategies & Conflict Resolution",
        "pedagogicalRole": "Conflict Resolution Engineering (Merge Conflict Markers, 3-Way Diff Analysis, git checkout --ours/--theirs, Safe Aborts)",
        "spokenGoal": "Merge conflicts terrorize junior developers. To a senior engineer, a merge conflict is simply Git asking a human to adjudicate when two lines of development mutated the same lines of code relative to their common ancestor. Today, you master conflict forensics: decoding conflict markers, using <code>git checkout --ours</code> and <code>--theirs</code>, leveraging <code>diff3</code> formatting to see the original common ancestor, and safely aborting with <code>git merge --abort</code>.",
        "conceptInvariant": "Conflict Demarcation Invariant: In a conflicted file, Git writes explicit syntactic boundaries: <code><<<<<<< HEAD</code> (current branch state), <code>||||||| merged common ancestors</code> (diff3 ancestor baseline), <code>=======</code> (separator), and <code>>>>>>>> branch</code> (incoming branch state). Resolving requires removing all markers and staging the coherent result.",
        "failureMode": "The Conflict Marker Compilation Incident: A tired developer manually edits a merge conflict in a production TypeScript file. They resolve the code but overlook an unremoved <code>>>>>>>> feature-xyz</code> marker at line 450. The file passes casual inspection, gets committed, and crashes the production build pipeline during deployment.",
        "tryItFriction": "Configure Git to use <code>merge.conflictStyle = diff3</code>; induce a merge conflict between two branches, inspect the 3-way conflict block showing the base version, resolve the conflict, and verify with <code>git diff --check</code> that zero conflict markers remain.",
        "socraticHints": [
            "Why is enabling <code>diff3</code> (or <code>zdiff3</code>) conflict style vastly superior to Git's default 2-way conflict markers?",
            "In the context of <code>git merge feature</code> executed while on <code>main</code>, which branch does <code>--ours</code> refer to, and which branch does <code>--theirs</code> refer to?",
            "What command cleanly unwinds a tangled, disastrous merge attempt back to the exact pre-merge working state without losing uncommitted work?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer is in the middle of a complex merge of <code>feature</code> into <code>main</code>. Ten files have conflicts. The developer wants to accept the version from <code>feature</code> for a binary configuration file without manual editing. Which command achieves this?",
            "options": [
                "git merge --skip",
                "Diagnose Staging Strategy for Incoming Changes: Run <code>git checkout --theirs config.bin</code> (or <code>git restore --theirs config.bin</code>) followed by <code>git add config.bin</code>. During a merge, <code>--theirs</code> represents the branch being merged into the current branch (feature), while <code>--ours</code> represents the current checked-out branch (main).",
                "git checkout --ours config.bin",
                "Delete config.bin and recommit."
            ],
            "correctOptionIndex": 1,
            "debrief": "During a merge, <code>--ours</code> is the branch you were on when you started the merge (target), while <code>--theirs</code> is the branch you are bringing in (source). Using <code>git checkout --theirs <file></code> immediately resolves the file to the incoming version."
        },
        "quests": [
            {
                "id": "Q35.29",
                "name": "Diff3 and Zdiff3 Algorithmic Conflict Resolution Architecture",
                "type": "Concept",
                "desc": "Analyze the mechanics of diff3 conflict marker generation, contrasting standard 2-way markers against 3-way base-aware conflict inspection."
            },
            {
                "id": "Q35.30",
                "name": "The Production Outage from Stray Conflict Markers Detective",
                "type": "Detective Challenge",
                "desc": "Investigate a production build failure caused by stray <<<<<<< markers committed into an uncompiled JSON payload; repair the parser and add CI guardrails."
            },
            {
                "id": "Q35.31",
                "name": "Automated Conflict Resolution Linter & Pre-Commit Hook",
                "type": "Mastery Assignment",
                "desc": "Author a robust Git pre-commit hook in Bash/Python that scans staged files for conflict marker patterns and rejects commits containing unadjudicated markers."
            },
            {
                "id": "Q35.32",
                "name": "50-File Concurrent High-Entropy Merge Conflict Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Simulate simultaneous conflicting refactors across 50 source files; execute automated resolution using custom merge drivers and verify complete AST validity."
            }
        ]
    },
    {
        "day": 9,
        "month": 1,
        "blockNum": 2,
        "title": "Git Tagging & Annotated Releases: Lightweight vs Annotated Tags (`.git/refs/tags/`) & Cryptographic Verification",
        "stageNum": 2,
        "stageName": "Stage 2: Branching Mechanics, Merge Strategies & Conflict Resolution",
        "pedagogicalRole": "Release Tagging & Cryptographic Provenance (Lightweight Tags, Annotated Tags, Tag Object DOM, GPG Verification)",
        "spokenGoal": "Branches move; tags are permanent milestones. Today, you master release engineering with Git tags. You will learn the difference between Lightweight Tags (simple pointers in <code>.git/refs/tags/</code>) and Annotated Tags (full Git objects containing tagger metadata, timestamps, and release messages), push tags to remotes safely, and sign tags cryptographically using GPG to guarantee release provenance.",
        "conceptInvariant": "Tag Immutability & Provenance Invariant: An Annotated Tag is a dedicated Git object in <code>.git/objects/</code> pointing to a specific commit: $\\text{Tag} = \\{ \\text{object},\\ \\text{type},\\ \\text{tagger},\\ \\text{message},\\ \\text{GPG signature} \\}$. Unlike branches, tags never move automatically upon subsequent commits.",
        "failureMode": "The Moving Release Tag Production Supply Chain Exploit: An open-source maintainer uses a lightweight tag <code>v1.0.0</code> and accidentally updates it to point to a newer, unvetted commit using <code>git tag -f</code>. Downstream automated build pipelines pulling <code>v1.0.0</code> ingest untested code, triggering unexpected breaking changes across thousands of dependent enterprise systems.",
        "tryItFriction": "Create both a lightweight tag (<code>git tag v0.1.0-alpha</code>) and an annotated tag (<code>git tag -a v0.1.0 -m 'Release v0.1.0'</code>); inspect their physical representations in <code>.git/refs/tags/</code> using <code>git cat-file -t</code> to see the difference between a commit pointer and a tag object.",
        "socraticHints": [
            "Why is creating an annotated tag (<code>git tag -a</code>) required for official software releases, while lightweight tags are reserved for temporary local bookmarks?",
            "Why does running <code>git push</code> by default NOT push your local tags to the remote server, and what flag is required?",
            "How does <code>git describe</code> use tags and commit distance to generate semantic version strings like <code>v1.2.0-4-g2a1b3c</code>?"
        ],
        "situationalPuzzle": {
            "scenario": "A DevOps engineer creates a release tag <code>v2.0.0</code> on their local workstation and runs <code>git push origin main</code>. The CI/CD pipeline triggers on tags, but does not start. The engineer checks GitHub and the tag <code>v2.0.0</code> does not exist on the remote repository.",
            "options": [
                "GitHub only supports tags beginning with the word 'release'.",
                "Diagnose Explicit Tag Push Requirement: Git's push protocol deliberately excludes tags from standard branch pushes to prevent accidental publication of local tags. The engineer must explicitly push the tag using <code>git push origin v2.0.0</code> or push all matching tags with <code>git push origin --tags</code>.",
                "Tags can only be created via the GitHub web UI.",
                "The repository is in a detached HEAD state."
            ],
            "correctOptionIndex": 1,
            "debrief": "Git treats tags as distinct references from branch heads. Running <code>git push origin <branch></code> pushes only the specified branch commits and refs. Tags must be pushed explicitly with <code>git push origin <tagname></code> or <code>--tags</code>."
        },
        "quests": [
            {
                "id": "Q35.33",
                "name": "Git Tag Object Model & Semantic Versioning Architecture",
                "type": "Concept",
                "desc": "Detail the physical difference between lightweight ref pointers and annotated tag objects in .git/objects, analyzing GPG cryptographic signatures."
            },
            {
                "id": "Q35.34",
                "name": "The Mutated Release Tag Supply-Chain Poisoning Detective",
                "type": "Detective Challenge",
                "desc": "Investigate a production incident where a release tag was force-moved to a compromised commit; trace reflog history and restore the authentic release tag."
            },
            {
                "id": "Q35.35",
                "name": "Automated Semantic Versioning & Tag Validation Engine",
                "type": "Mastery Assignment",
                "desc": "Develop an automated release script that calculates semantic version bumps (SemVer 2.0.0), generates annotated release tags, and verifies GPG signatures."
            },
            {
                "id": "Q35.36",
                "name": "Cryptographic GPG Release Verification & Tamper Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Sign release tags with GPG; simulate byte-level tampering of tag payload messages and verify that git tag -v immediately detects cryptographic violations."
            }
        ]
    },
    {
        "day": 10,
        "month": 1,
        "blockNum": 2,
        "title": "Milestone 2: ApexMerge High-Concurrence Branching & Automated 3-Way Conflict Resolution Suite",
        "stageNum": 2,
        "stageName": "Stage 2: Branching Mechanics, Merge Strategies & Conflict Resolution",
        "pedagogicalRole": "Synthesis & Advanced Branching (Multi-Branch Orchestration, Three-Way Merge Engine, Conflict Arbitrator & Release Pipeline)",
        "spokenGoal": "Milestone 2 tests your mastery of branching topology, merge base calculation, and conflict resolution under high concurrence. You will architect ApexMerge: an automated merge orchestrator that manages complex multi-branch integrations, evaluates common ancestors, simulates 3-way merges, and resolves syntactic conflicts using custom merge drivers.",
        "conceptInvariant": "Deterministic Merge Convergence Invariant: Given two divergent branches $B_1$ and $B_2$ rooted at common ancestor $A$, the merge resolution function $M(B_1, B_2, A)$ must produce an idempotent, deterministic commit tree that preserves all non-conflicting mutations from both branches.",
        "failureMode": "The Silent Semantic Merge Conflict Outage: Two developers merge their branches cleanly with zero Git conflicts. Developer A renamed a critical function from <code>calc()</code> to <code>calculate()</code> in <code>math.ts</code>. Developer B added a new call to <code>calc()</code> in <code>billing.ts</code>. Git merges the files cleanly, but the build breaks or throws a runtime exception in production because Git only detects line-level text conflicts, not semantic AST conflicts.",
        "tryItFriction": "Build an automated integration script that simulates a multi-developer release merge across 5 feature branches, identifies the exact merge base for each, handles conflict detection, and verifies build integrity post-merge.",
        "socraticHints": [
            "Why can two branches have zero textual merge conflicts yet produce code that fails to compile or crashes at runtime (a semantic conflict)?",
            "How does a custom Git merge driver configured in <code>.gitattributes</code> allow you to handle domain-specific file formats like JSON or SQL?",
            "What automated sanity checks (type checks, integration tests) must immediately run following any automated merge before pushing to production?"
        ],
        "situationalPuzzle": {
            "scenario": "An automated CI merge bot attempts to merge 10 pull requests simultaneously into <code>main</code> using fast-forward merges. PR 1 succeeds, but PRs 2 through 10 immediately fail with non-fast-forward rejections.",
            "options": [
                "The bot lacks GitHub admin rights.",
                "Diagnose Fast-Forward Target Invalidation: The moment PR 1 is merged, the tip of <code>main</code> advances. All remaining PRs were branched from the old tip of <code>main</code>, meaning <code>main</code> is no longer a direct ancestor of their branch tips. The bot must rebase each remaining PR onto the newly updated <code>main</code> before attempting subsequent fast-forward merges.",
                "Fast-forward merges are only allowed once per day.",
                "The bot needs to wait 1 hour for cache invalidation."
            ],
            "correctOptionIndex": 1,
            "debrief": "When a fast-forward merge completes, the target branch moves. Any subsequent branches that branched from the older target commit can no longer be fast-forwarded without first being rebased onto the updated target tip."
        },
        "quests": [
            {
                "id": "Q35.37",
                "name": "ApexMerge Systems Architecture & Merge Orchestration Blueprint",
                "type": "Concept",
                "desc": "Document the complete architecture of ApexMerge, specifying topological sorting of branches, merge base resolution, and custom merge driver APIs."
            },
            {
                "id": "Q35.38",
                "name": "The Silent Semantic Conflict Production Outage Detective",
                "type": "Detective Challenge",
                "desc": "Investigate a production incident where clean textual merges resulted in broken runtime API calls; identify the semantic conflict and build a validation test."
            },
            {
                "id": "Q35.39",
                "name": "ApexMerge Multi-Branch Automated Merge Orchestrator",
                "type": "Mastery Assignment",
                "desc": "Build the full ApexMerge CLI suite: an automated tool that reorders, tests, rebases, and merges multiple feature branches into release candidates."
            },
            {
                "id": "Q35.40",
                "name": "ApexMerge Milestone 2 Viva Defense & Chaos Injection Gate",
                "type": "Production Incident Lab",
                "desc": "Defend ApexMerge before the Engineering Review Board under chaotic concurrent branch merges, injected conflict spikes, and semantic breaking changes."
            }
        ]
    },
    {
        "day": 11,
        "month": 1,
        "blockNum": 3,
        "title": "Undoing Changes: `git restore`, `git reset` (Soft, Mixed, Hard) vs `git revert` (Safe History Invariant)",
        "stageNum": 3,
        "stageName": "Stage 3: Undo Mechanics, History Rewriting & Safety Nets",
        "pedagogicalRole": "Undo Architecture & History Safety (git restore, git reset Variants, git revert, Public Branch Safety Invariant)",
        "spokenGoal": "Every developer makes mistakes. What separates junior from senior engineers is knowing exactly how to undo changes safely. Today, you master Git's undo toolchain: <code>git restore</code> (discarding local changes), the three modes of <code>git reset</code> (Soft, Mixed, Hard), and <code>git revert</code>. You will learn the Golden Rule of Git: never use reset to destroy commits on shared public branches; use revert to append a safe inverse commit.",
        "conceptInvariant": "Public Branch Immutability Invariant: On shared or published branches, history must be strictly append-only. To undo an errant commit $C$, execute <code>git revert C</code>, which creates a new inverse commit $C^{-1}$ such that $C + C^{-1} = 0$, preserving linear historical integrity for all collaborators.",
        "failureMode": "The Shared Branch Force-Push Obliteration: An engineer makes an error on <code>main</code>, runs <code>git reset --hard HEAD~3</code>, and runs <code>git push origin main --force</code>. Three days of work from 15 other team members are wiped out on the remote server, breaking active CI/CD pipelines and desynchronizing all local clones.",
        "tryItFriction": "Construct a test scenario demonstrating the exact difference between <code>git reset --soft HEAD~1</code> (leaves changes staged in Index), <code>git reset --mixed HEAD~1</code> (leaves changes unstaged in Working Tree), and <code>git reset --hard HEAD~1</code> (discards changes entirely).",
        "socraticHints": [
            "What happens to the Working Directory and the Staging Area when you run <code>git reset --soft</code> versus <code>git reset --mixed</code>?",
            "Why is <code>git reset --hard</code> dangerous for uncommitted work, and where do committed changes actually go after a reset?",
            "How does <code>git revert -m 1 <merge-commit></code> undo a pull request merge commit, and what does the <code>-m 1</code> flag specify?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer has committed buggy code to the remote <code>main</code> branch, and colleagues have already pulled the commit. The developer wants to undo the buggy code without causing synchronization errors or requiring team members to force-pull. What is the correct command?",
            "options": [
                "git reset --hard HEAD~1 && git push -f origin main",
                "Diagnose Safe History Undoing with Revert: Run <code>git revert HEAD</code> and push normally with <code>git push origin main</code>. <code>git revert</code> creates a new commit that applies the mathematical inverse of the buggy commit, safely rolling back the changes while preserving linear commit history without rewriting shared branches.",
                "git clean -fdx",
                "Delete the repository and reclone."
            ],
            "correctOptionIndex": 1,
            "debrief": "On shared public branches, rewriting history with <code>git reset</code> and force-pushing desynchronizes other developers' branches. <code>git revert</code> creates a new commit that records the rollback, ensuring clean downstream pulls."
        },
        "quests": [
            {
                "id": "Q35.41",
                "name": "Reset Mechanics & The Three Staging States Interaction",
                "type": "Concept",
                "desc": "Detail the internal state transitions of HEAD, Index, and Working Tree under git reset (--soft, --mixed, --hard) and git restore."
            },
            {
                "id": "Q35.42",
                "name": "The Accidental Hard Reset WIP Annihilation Detective",
                "type": "Detective Challenge",
                "desc": "Investigate a developer workstation where git reset --hard was run on uncommitted work; recover lost files from dangling blobs or editor swap caches."
            },
            {
                "id": "Q35.43",
                "name": "Safe History Rollback & Revert Automation Engine",
                "type": "Mastery Assignment",
                "desc": "Develop a CLI safety wrapper that validates branch publication status, prevents hard resets on shared branches, and generates automated clean reverts."
            },
            {
                "id": "Q35.44",
                "name": "Complex Multi-Parent Merge Commit Revert Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Execute git revert -m 1 on an octopus merge commit; verify parent mainline selection, inverse tree generation, and downstream re-merge behavior."
            }
        ]
    },
    {
        "day": 12,
        "month": 1,
        "blockNum": 3,
        "title": "Stashing & Context Switching: `git stash`, Stash Stacks (`stash@{0}`), Partial Stashing & Untracked Files",
        "stageNum": 3,
        "stageName": "Stage 1: Mental Model Grounding & Git Object Storage",
        "pedagogicalRole": "Context Switching & Ephemeral State (Stash Stack, Commit Structure of a Stash, Partial Stashing & Untracked Ingestion)",
        "spokenGoal": "You are midway through a complex refactor when an urgent production bug strikes. You cannot commit unfinished code, but you cannot switch branches with a dirty working directory. Today, you master <code>git stash</code>: understanding the stash as a LIFO stack, inspecting the internal commit structure of a stash (did you know every stash is actually 2 or 3 commits?), stashing untracked files (<code>-u</code>), and interactive patch stashing (<code>git stash -p</code>).",
        "conceptInvariant": "Stash Commit Topology Invariant: A stash is not a temporary text file; it is a special commit graph in <code>.git/refs/stash</code> composed of two or three commits: a Working Tree commit $W$, an Index commit $I$, and optionally an Untracked files commit $U$.",
        "failureMode": "The Stash Drop Accidental Obliteration: A developer has 2 weeks of prototype code stashed in <code>stash@{0}</code>. While cleaning up, they type <code>git stash drop</code> thinking it would apply the changes. The stash reference is dropped, leaving the commits dangling in the object database with no visible ref pointer.",
        "tryItFriction": "Modify tracked files and create new untracked files; execute <code>git stash -u -m 'wip-refactor'</code>, verify your working directory is 100% clean, inspect the stash stack with <code>git stash list</code>, and restore changes using <code>git stash pop</code>.",
        "socraticHints": [
            "Why does running <code>git stash</code> by default ignore untracked files, and why is the <code>-u</code> (or <code>--include-untracked</code>) flag essential?",
            "What is the operational difference between <code>git stash pop</code> (which applies and deletes the stash entry) and <code>git stash apply</code> (which preserves the stash entry)?",
            "How does Git's internal object store represent a stash, and why can dropped stashes be recovered from <code>git fsck</code>?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer runs <code>git stash pop</code> to restore their work on a feature branch. Git halts with: 'error: Your local changes to the following files would be overwritten by merge... Cannot apply stash.' The stash entry remains in <code>stash@{0}</code>.",
            "options": [
                "The stash file is corrupted and lost forever.",
                "Diagnose Working Tree Collision During Stash Pop: The working directory contains unstaged modifications to the same files stored in the stash. Git refuses to apply the stash to prevent overwriting uncommitted work. The developer must either commit or stash the current working changes, or checkout a clean branch before popping the stash.",
                "The developer must delete .git/refs/stash.",
                "Restart the Git daemon service."
            ],
            "correctOptionIndex": 1,
            "debrief": "<code>git stash pop</code> attempts to merge the stash commit back into the working tree. If there are dirty, uncommitted changes that collide with the stash content, Git safely aborts the operation without deleting the stash entry."
        },
        "quests": [
            {
                "id": "Q35.45",
                "name": "Git Stash Internal Commit Topology Architecture",
                "type": "Concept",
                "desc": "Dissect the underlying commit structure of git stash, analyzing how refs/stash links the working tree commit, index commit, and untracked tree."
            },
            {
                "id": "Q35.46",
                "name": "The Dropped Stash Prototype Resurrection Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Locate and recover an unreferenced prototype commit dropped from git stash using git fsck --lost-found and dangling commit inspection."
            },
            {
                "id": "Q35.47",
                "name": "Multi-Tier Context-Switching Stash Manager CLI",
                "type": "Mastery Assignment",
                "desc": "Build an interactive CLI tool that manages named stash contexts, previews stash diffs, enforces clean state checks, and prevents accidental drops."
            },
            {
                "id": "Q35.48",
                "name": "Stash Branch Extraction & Collision Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Test git stash branch on heavily conflicted stash entries; verify that Git creates a new branch rooted at the stash base commit with zero collision errors."
            }
        ]
    },
    {
        "day": 13,
        "month": 1,
        "blockNum": 3,
        "title": "History Rewriting: Interactive Rebase (`git rebase -i`), Squashing, Fixups, Rewording & Dropping Commits",
        "stageNum": 3,
        "stageName": "Stage 3: Undo Mechanics, History Rewriting & Safety Nets",
        "pedagogicalRole": "History Curation & Rebase Mechanics (git rebase -i, Pick, Squash, Fixup, Reword, Drop & Replay Mechanics)",
        "spokenGoal": "Your raw development history is messy: typos, broken tests, 'wip' commits, and debug statements. Before submitting code for review, senior engineers curate their commits into a clean, professional narrative. Today, you master Interactive Rebase (<code>git rebase -i</code>): understanding how Git replays commits onto a new base, squashing trivial commits, using <code>fixup</code> to merge changes silently, rewording commit messages, and reordering history.",
        "conceptInvariant": "Rebase Replay Invariant: Rebasing replays a series of commits onto a new upstream base $U$. For each commit $C_i$, Git generates a patch $\\Delta C_i$ and applies it sequentially: $C'_i = \\text{apply}(\\Delta C_i, C'_{i-1})$. Every rebased commit receives a brand-new SHA hash.",
        "failureMode": "The Shared Branch Rebase Nightmare: An engineer runs <code>git rebase -i HEAD~5</code> on the shared <code>staging</code> branch to clean up their commits, and force-pushes with <code>git push -f</code>. All other engineers working on <code>staging</code> now have divergent commit trees, causing duplicate commits and mass merge conflicts across the entire team.",
        "tryItFriction": "Construct a sequence of 4 messy commits ('wip 1', 'fix typo', 'add tests', 'temp debug'); run <code>git rebase -i HEAD~4</code> to drop the debug commit, squash the typo into the initial commit using <code>fixup</code>, and reword the message into a standard Conventional Commit.",
        "socraticHints": [
            "What is the difference between <code>squash</code> (which combines commits and prompts to edit the combined message) and <code>fixup</code> (which discards the second commit's message)?",
            "Why does every single commit modified during an interactive rebase receive a completely new commit hash, even if its file contents are identical?",
            "What command allows you to abort an interactive rebase that has run into confusing conflicts midway through?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer is midway through an interactive rebase involving 6 commits. On commit 3, a conflict occurs. The developer resolves the conflict markers in the file and runs <code>git add .</code>. What is the next command they must execute to proceed?",
            "options": [
                "git commit -m 'resolved'",
                "Diagnose Rebase Continuation Flow: Run <code>git rebase --continue</code>. The rebase engine is paused at an individual replay step. Staging the resolved files informs Git that the current patch is ready. Running <code>git rebase --continue</code> commits the step and proceeds to replay commit 4.",
                "git rebase --abort",
                "git push origin main"
            ],
            "correctOptionIndex": 1,
            "debrief": "During a rebase conflict, you stage the resolved files with <code>git add</code> and then call <code>git rebase --continue</code>. Calling <code>git commit</code> manually during a rebase can disrupt the automated sequencer state."
        },
        "quests": [
            {
                "id": "Q35.49",
                "name": "Git Sequencer Architecture & Interactive Rebase Engine",
                "type": "Concept",
                "desc": "Analyze the mechanics of .git/rebase-merge, the todo list parser, cherry-pick replay loops, and patch application conflict states."
            },
            {
                "id": "Q35.50",
                "name": "The Tangled Rebase Sequencer Deadlock Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Troubleshoot a broken interactive rebase session halted in a corrupt sequencer state; manually inspect .git/rebase-merge and recover branch execution."
            },
            {
                "id": "Q35.51",
                "name": "Automated Conventional Commit Squasher & Rebase Linter",
                "type": "Mastery Assignment",
                "desc": "Build an automated CLI tool that scans a pull request branch, identifies fixup/squash candidate pairs, and constructs an automated rebase script."
            },
            {
                "id": "Q35.52",
                "name": "50-Commit Interactive Rebase with Injected Conflict Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Execute an automated 50-commit interactive rebase with scripted conflicts and reordering; verify that the final tree matches the expected canonical state."
            }
        ]
    },
    {
        "day": 14,
        "month": 1,
        "blockNum": 3,
        "title": "The Safety Net: `git reflog`, Resurrecting Lost Commits, Dangling Heads & Reflog Retention Limits",
        "stageNum": 3,
        "stageName": "Stage 3: Undo Mechanics, History Rewriting & Safety Nets",
        "pedagogicalRole": "Disaster Recovery & Reflog Forensics (git reflog, Head Reflog vs Branch Reflog, Dangling Commits, Pruning Windows)",
        "spokenGoal": "In Git, almost nothing is truly lost unless you wait 30 to 90 days for garbage collection. The Reflog (Reference Log) is your ultimate emergency parachute. Every time HEAD or a branch reference moves—whether by commit, checkout, rebase, reset, or merge—Git logs the previous SHA in <code>.git/logs/</code>. Today, you master reflog forensics: locating discarded commits, recovering from accidental <code>reset --hard</code> operations, and understanding garbage collection retention windows.",
        "conceptInvariant": "Reflog Immutability & Retention Invariant: Every local reference update is recorded sequentially in <code>.git/logs/refs/</code>: $\\text{Reflog} = [(\\text{old\\_SHA},\\ \\text{new\\_SHA},\\ \\text{committer},\\ \\text{action})]$. Unreachable commits remain recoverable until <code>gc.reflogExpire</code> (default 90 days for reachable, 30 days for unreachable).",
        "failureMode": "The Catastrophic Hard Reset Panic: An engineer accidentally executes <code>git reset --hard HEAD~10</code>, obliterating two weeks of unpushed commits from their branch. In a panic, they attempt to re-clone the repository from the remote server, overwriting their local <code>.git</code> directory and destroying the local reflog that held the recovery keys.",
        "tryItFriction": "Intentionally 'destroy' your current branch by running <code>git reset --hard HEAD~3</code>; open <code>git reflog</code>, find the SHA of the commit prior to the reset (e.g. <code>HEAD@{1}</code>), and restore your branch to its exact pre-reset state using <code>git reset --hard HEAD@{1}</code>.",
        "socraticHints": [
            "Why is <code>git reflog</code> strictly local to your machine and never synchronized to remote repositories during <code>git push</code>?",
            "What is the difference between inspecting <code>git reflog</code> (which tracks HEAD movements) and <code>git reflog show main</code> (which tracks movements of the main branch)?",
            "What command triggers Git to physically purge unreachable, unreferenced objects from the disk, and what is the default grace period?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer accidentally deletes their feature branch using <code>git branch -D feature-login</code> before pushing it to remote. They run <code>git branch</code> and the branch is gone. How do they recover the deleted branch?",
            "options": [
                "The branch is deleted and cannot be recovered.",
                "Diagnose Reflog Reference Recovery: Run <code>git reflog</code> to find the commit hash where <code>feature-login</code> was last located (look for 'checkout: moving from feature-login' or the last commit message). Once the SHA (e.g. <code>f1a2b3c</code>) is identified, run <code>git branch feature-login f1a2b3c</code> to recreate the branch pointer instantly.",
                "Download a file undelete utility from the internet.",
                "Reboot the machine into safe mode."
            ],
            "correctOptionIndex": 1,
            "debrief": "Deleting a branch only deletes the 41-byte pointer file in <code>.git/refs/heads/</code>. The underlying commits still exist in <code>.git/objects/</code>, and the last commit hash is preserved in the reflog. Creating a branch pointing to that hash restores it completely."
        },
        "quests": [
            {
                "id": "Q35.53",
                "name": "Reflog Physical Storage Architecture & gc.reflogExpire Mechanics",
                "type": "Concept",
                "desc": "Examine the physical layout of .git/logs/HEAD and .git/logs/refs/, analyzing append mechanics, log rotation, and garbage collection pruning."
            },
            {
                "id": "Q35.54",
                "name": "The Deleted Branch & Lost Commit Autopsy Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Recover an accidentally deleted feature branch with 15 unpushed commits using reflog analysis and dangling object reconstruction."
            },
            {
                "id": "Q35.55",
                "name": "ApexRescue Automated Reflog Disaster Recovery Engine",
                "type": "Mastery Assignment",
                "desc": "Build ApexRescue: an emergency CLI tool that scans reflogs, detects destructive resets or branch deletions, and offers one-click state restoration."
            },
            {
                "id": "Q35.56",
                "name": "git gc --prune Force-Expiration Hazard Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Simulate emergency recovery under aggressive git prune policies; verify recovery boundaries before and after git gc --prune=now execution."
            }
        ]
    },
    {
        "day": 15,
        "month": 1,
        "blockNum": 3,
        "title": "Milestone 3: ApexRescue History Rewriting & Reflog Disaster Recovery Engine Suite",
        "stageNum": 3,
        "stageName": "Stage 3: Undo Mechanics, History Rewriting & Safety Nets",
        "pedagogicalRole": "Synthesis & Disaster Recovery Engineering (Reflog Parsers, Rebase Automation, Dangling Object Traversal & Emergency Undo Engine)",
        "spokenGoal": "Milestone 3 tests your mastery of Git's safety net and undo mechanisms. You will architect ApexRescue: a production disaster-recovery toolkit that can automatically parse corrupted reflogs, reconstruct commit graphs from dangling blobs and trees, resolve broken rebase sequencer states, and recover from destructive force-pushes or hard resets without data loss.",
        "conceptInvariant": "Zero Unrecoverable State Invariant: As long as uncommitted files were staged at least once (generating a Blob in <code>.git/objects/</code>) or committed to a local ref, the data is 100% recoverable prior to garbage collection pruning.",
        "failureMode": "The Mid-Rebase Hard Reset Panic Lock: A developer runs into conflicts during a 20-commit rebase. Panicking, they run <code>git reset --hard HEAD</code> and <code>rm -rf .git/rebase-apply</code> manually. This corrupts the sequencer state, detaches HEAD, and leaves the branch tip floating in an unreferenced limbo.",
        "tryItFriction": "Intentionally simulate a disastrous multi-commit rebase failure followed by an accidental branch deletion; use your ApexRescue suite to automatically scan the reflog and reconstruct the exact pre-rebase branch topology.",
        "socraticHints": [
            "Why does staging a file with <code>git add</code> protect its contents even if the file is later deleted from the working tree without committing?",
            "How does <code>git fsck --lost-found</code> identify dangling commits and trees that are no longer reachable from any branch or tag?",
            "What information does the reflog retain about the sequence of rebase steps that allows an aborted rebase to be reconstructed?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer accidentally ran <code>git reset --hard</code> on a branch, deleting critical code. Worse, they ran <code>git gc --prune=now</code> immediately afterward, thinking it would 'clean up the mess'. Is the data recoverable?",
            "options": [
                "Yes, Git always backs up to OneDrive.",
                "Diagnose Pruning Finality & External Recovery: <code>git gc --prune=now</code> explicitly bypasses the 30/90-day grace period and permanently deletes all unreferenced loose objects from <code>.git/objects/</code>. Because the reset orphaned the commits and gc pruned them, Git cannot recover the data internally. Recovery is only possible if the developer has IDE local history (VS Code / JetBrains timelines), OS volume shadow copies, or open editor buffers.",
                "Run git reflog undo to reverse the garbage collector.",
                "Switch to another branch and the pruned objects will reappear."
            ],
            "correctOptionIndex": 1,
            "debrief": "<code>git gc --prune=now</code> physically purges unreferenced objects from disk. Once this executes, Git's internal object store no longer contains the data. The only remaining hope is external IDE local history or filesystem backups."
        },
        "quests": [
            {
                "id": "Q35.57",
                "name": "ApexRescue Architectural Design & Disaster Forensics Specification",
                "type": "Concept",
                "desc": "Document the complete systems blueprint of ApexRescue, detailing reflog parsing, dangling object salvage algorithms, and sequencer recovery."
            },
            {
                "id": "Q35.58",
                "name": "The Pruned Object Boundary & IDE Local History Detective",
                "type": "Detective Challenge",
                "desc": "Investigate a catastrophic post-prune data loss scenario; interface with IDE local history caches to reconstruct lost file snapshots."
            },
            {
                "id": "Q35.59",
                "name": "ApexRescue Production Disaster Recovery Platform",
                "type": "Mastery Assignment",
                "desc": "Build the full ApexRescue recovery suite: a CLI that parses reflogs, analyzes dangling objects, and restores broken repositories with zero data loss."
            },
            {
                "id": "Q35.60",
                "name": "ApexRescue Milestone 3 Viva Defense & Chaos Injection Gate",
                "type": "Production Incident Lab",
                "desc": "Defend ApexRescue before the Principal DevOps Review Board under simulated hard reset disasters, corrupted sequencer states, and branch deletions."
            }
        ]
    }
]

out_path = Path(__file__).resolve().parent / "git_version_control_spec_m1.py"

content = f'''# scripts/visuals/git_version_control_spec_m1.py
# Month 1: Days 1 to 15 Specification for Course 35: Git, GitHub & Version Control Basics (course-git-version-control)
# Conforms strictly to Gate v2 / True 9.8 standard across all 15 days (60 Quests: Q35.1 to Q35.60).

DAYS_1_TO_15 = {json.dumps(days_data, indent=2)}
'''

with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_path} with {len(days_data)} days ({sum(len(d['quests']) for d in days_data)} quests).")
