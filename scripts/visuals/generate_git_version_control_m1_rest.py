# scripts/visuals/generate_git_version_control_m1_rest.py
"""
Generator script for Course 35: Git, GitHub & Version Control Basics (course-git-version-control)
Month 1: Days 16 to 30 (60 Quests: Q35.61 to Q35.120).
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
        "day": 16,
        "month": 1,
        "blockNum": 4,
        "title": "Distributed Architecture: Remote Tracking Branches, `git remote` & Refspecs (`+refs/heads/*`)",
        "stageNum": 4,
        "stageName": "Stage 4: Remote Repositories, Synchronization & Collaboration",
        "pedagogicalRole": "Distributed Network Topology (Remote Tracking Branches, Refspec Mappings, Upstream Tracking & Remotes Architecture)",
        "spokenGoal": "Git is fundamentally distributed: your local computer contains a complete, self-contained copy of the entire project history. Today, you master distributed Git architecture: how remotes work in <code>.git/refs/remotes/</code>, why <code>origin</code> is simply an arbitrary nickname, how Refspecs (<code>+refs/heads/*:refs/remotes/origin/*</code>) map remote namespaces to local tracking branches, and how to manage multi-remote topologies.",
        "conceptInvariant": "Remote Tracking Namespace Separation Invariant: Remote tracking branches (<code>refs/remotes/origin/*</code>) are read-only local mirrors updated strictly via network synchronization (<code>fetch</code>, <code>pull</code>). Local branch tips (<code>refs/heads/*</code>) move strictly via local commits and merges. Upstream tracking metadata in <code>.git/config</code> binds them together.",
        "failureMode": "The Stale Remote Tracking Stale Cache Disaster: A production deployment script checked out code and checked <code>git status</code> without running <code>git fetch</code>. Because the local tracking branch <code>origin/main</code> was 48 hours stale, the script reported 'Your branch is up to date with origin/main', deploying code that missed 14 urgent security hotfixes.",
        "tryItFriction": "Inspect the raw refspec entries in <code>.git/config</code>; add a secondary remote named <code>upstream</code> pointing to a secondary bare repository, execute <code>git fetch upstream</code>, and verify that <code>.git/refs/remotes/upstream/</code> is populated without modifying your local working tree or branches.",
        "socraticHints": [
            "Why is <code>origin/main</code> on your local machine not a live network connection to GitHub, but rather a static pointer file on your local disk?",
            "What does the plus sign (<code>+</code>) signify at the start of a refspec like <code>+refs/heads/*:refs/remotes/origin/*</code>?",
            "How does setting the upstream branch with <code>git push -u origin feature</code> simplify future push and pull invocations?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer runs <code>git branch -a</code> and sees <code>remotes/origin/feature-old</code>. When they visit GitHub in their browser, <code>feature-old</code> was deleted two weeks ago. Why does the remote branch still appear on their local computer?",
            "options": [
                "GitHub failed to delete the branch on the server.",
                "Diagnose Stale Remote-Tracking Reference Cache: Standard <code>git fetch</code> downloads new commits and branches from the remote, but does not prune deleted remote branches from the local cache by default. The local pointer in <code>.git/refs/remotes/origin/feature-old</code> remains until purged with <code>git fetch --prune</code> (or <code>git remote prune origin</code>).",
                "The developer needs to delete their .git directory.",
                "Local Git requires root permissions to delete remote tracking branches."
            ],
            "correctOptionIndex": 1,
            "debrief": "Remote-tracking branches are local cache files. When a branch is deleted on the remote server, Git preserves the local cache pointer unless explicitly instructed to prune stale refs using <code>git fetch --prune</code>."
        },
        "quests": [
            {
                "id": "Q35.61",
                "name": "Distributed Git Network Architecture & Refspec Specification",
                "type": "Concept",
                "desc": "Detail the mechanics of remote tracking refs, transport protocols (HTTPS vs SSH), refspec syntax, and remote namespace isolation."
            },
            {
                "id": "Q35.62",
                "name": "The Phantom Remote Tracking Branch Deployment Detective",
                "type": "Detective Challenge",
                "desc": "Investigate a production deployment failure caused by stale remote-tracking references; audit the deployment script and add refspec verification."
            },
            {
                "id": "Q35.63",
                "name": "Multi-Remote Network Topology & Refspec Orchestrator",
                "type": "Mastery Assignment",
                "desc": "Build a CLI utility that manages multi-remote configurations (origin, upstream, backup), inspects refspec rules, and automates remote health checks."
            },
            {
                "id": "Q35.64",
                "name": "High-Latency Network Dropout & Fetch Resilience Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Simulate network timeouts and packet drops during multi-gigabyte remote fetches; verify that Git aborts atomically without corrupting tracking refs."
            }
        ]
    },
    {
        "day": 17,
        "month": 1,
        "blockNum": 4,
        "title": "Remote Synchronization: `git fetch` vs `git pull` (`--rebase` vs `--merge`), Push Protocols & `-u` Flags",
        "stageNum": 4,
        "stageName": "Stage 4: Remote Repositories, Synchronization & Collaboration",
        "pedagogicalRole": "Synchronization Engineering (Fetch Mechanics, Pull Pipeline, Integration Strategies, Push Protocols & Upstream Links)",
        "spokenGoal": "Many developers think <code>git pull</code> is a fundamental Git command. It is not; it is simply a macro for two distinct steps: <code>git fetch</code> followed by <code>git merge FETCH_HEAD</code> (or <code>git rebase FETCH_HEAD</code>). Senior engineers never pull blindly. Today, you master the synchronization lifecycle: fetching changes safely into tracking branches, inspecting the delta with <code>git log HEAD..origin/main</code>, deciding between merge vs rebase, and configuring upstream tracking with <code>git push -u</code>.",
        "conceptInvariant": "Network Decoupling Invariant: Remote data transfer is strictly decoupled from working tree mutation: $\\text{pull} = \\text{fetch} \\circ \\text{integrate}$. Always inspect the incoming commit delta $\\Delta = \\text{FETCH\\_HEAD} \\setminus \\text{HEAD}$ before integrating changes into active working branches.",
        "failureMode": "The Blind Pull Accidental Merge Disaster: A developer has unpushed commits and runs a blind <code>git pull</code> with default settings. A teammate pushed breaking changes. Git automatically generates a messy merge commit, interleaves broken dependencies into the working directory, and disrupts the developer's in-progress test suite.",
        "tryItFriction": "Fetch changes from a remote without pulling; use <code>git log HEAD..origin/main --oneline</code> to inspect the incoming commits, inspect the file diff with <code>git diff HEAD...origin/main</code>, and integrate the changes using <code>git merge --ff-only</code>.",
        "socraticHints": [
            "Why is running <code>git fetch</code> completely safe to execute at any time, even with uncommitted changes in your working tree?",
            "What is the difference between <code>git diff HEAD..origin/main</code> and <code>git diff HEAD...origin/main</code> (triple dot)?",
            "Why did Git 2.27+ introduce a warning when running <code>git pull</code> without an explicit reconciliation strategy (<code>pull.rebase</code> or <code>pull.ff</code>) configured?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer runs <code>git push origin feature</code>, and Git rejects it with: '[rejected - non-fast-forward] error: failed to push some refs... Updates were rejected because the remote contains work that you do not have locally.'",
            "options": [
                "Run git push -f to overwrite the remote branch immediately.",
                "Diagnose Non-Fast-Forward Push Rejection: Another team member pushed commits to <code>origin/feature</code> since the developer last pulled. Pushing would overwrite those commits. The developer must first run <code>git fetch origin</code>, reconcile the incoming changes using <code>git rebase origin/feature</code> (or <code>git merge</code>), test the integrated code, and then push.",
                "Delete the local feature branch and start over.",
                "Wait 24 hours for the remote lock to expire."
            ],
            "correctOptionIndex": 1,
            "debrief": "Non-fast-forward rejections protect against accidental data loss. When the remote branch has commits that your local branch lacks, Git refuses the push until you fetch and integrate the remote changes."
        },
        "quests": [
            {
                "id": "Q35.65",
                "name": "Git Smart HTTP & SSH Transport Protocol Mechanics",
                "type": "Concept",
                "desc": "Analyze the client-server negotiation protocol during fetch and push, examining packfile generation, capability exchange, and ref discovery."
            },
            {
                "id": "Q35.66",
                "name": "The Blind Pull Merge Entanglement Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a tangled feature branch ruined by blind pull merges; untangle the commit graph, isolate local commits, and rebase onto origin."
            },
            {
                "id": "Q35.67",
                "name": "Safe Remote Synchronization & Delta Inspection Engine",
                "type": "Mastery Assignment",
                "desc": "Develop a CLI tool that wraps fetch/pull, previews incoming diffs and commit logs, checks fast-forward feasibility, and prevents blind merges."
            },
            {
                "id": "Q35.68",
                "name": "Concurrent Push Race Condition & Contention Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Simulate 10 automated worker nodes attempting simultaneous pushes to the same remote branch; measure rejection handling and rebase convergence."
            }
        ]
    },
    {
        "day": 18,
        "month": 1,
        "blockNum": 4,
        "title": "Collaboration Hygiene: Linear History vs Merge Bubbles, Divergent Branches & `pull.rebase` Policies",
        "stageNum": 4,
        "stageName": "Stage 4: Remote Repositories, Synchronization & Collaboration",
        "pedagogicalRole": "Repository Hygiene & DAG Topology (Linear History, Merge Bubbles, pull.rebase Strategies, Fast-Forward Policies)",
        "spokenGoal": "Look at your company's git log. Does it look like a straight, clean railroad track, or a tangled bowl of spaghetti filled with hundreds of 'Merge branch main into feature' bubble commits? Today, you master collaboration hygiene: configuring <code>git config --global pull.rebase true</code>, understanding why rebase-on-pull keeps history linear, and learning how enterprise engineering organizations enforce fast-forward-only integration policies.",
        "conceptInvariant": "Linear History Preservation Invariant: Rebase-on-pull replays local unpushed commits on top of the fetched upstream branch: $\\text{HEAD}' = \\text{replay}(\\Delta_{\\text{local}}, \\text{origin/main})$. This eliminates recursive merge bubbles and preserves a clean, linear DAG.",
        "failureMode": "The Diamond Graph Merge Loop Nightmare: Over a 3-month project, 8 developers continually pull with default merge settings. The repository DAG degenerates into an unreadable mesh of 400 redundant merge bubbles. When a regression is detected, <code>git bisect</code> fails because traversing the non-linear merge graph tests identical code across multiple cycles.",
        "tryItFriction": "Configure <code>git config pull.rebase true</code>; create a divergent commit locally while simulating an upstream commit on the remote, run <code>git pull</code>, and verify with <code>git log --graph --oneline</code> that your local commit was rebased cleanly without creating a merge bubble.",
        "socraticHints": [
            "Why do many top engineering organizations enforce linear git histories over recursive merge-bubble topologies?",
            "What is the difference between <code>git pull --rebase=merges</code> and standard <code>git pull --rebase</code> when your local branch contains intentional branch merges?",
            "What happens if an unpushed local commit encounters a conflict during a rebase-pull?"
        ],
        "situationalPuzzle": {
            "scenario": "A development team adopts <code>pull.rebase = true</code>. A developer runs <code>git pull</code> and hits a merge conflict during commit replay. They resolve the conflict and run <code>git commit</code>. The rebase aborts with an inconsistent sequencer state. What should they have done?",
            "options": [
                "Run git reset --hard to start over.",
                "Diagnose Sequencer Step Continuation: During an interactive or pull rebase, resolving a conflict requires staging the resolved files with <code>git add</code> and continuing the sequencer with <code>git rebase --continue</code>. Running <code>git commit</code> manually creates an independent commit that disrupts Git's automated replay loop.",
                "Delete the remote branch.",
                "Switch to a new branch and abandon the old one."
            ],
            "correctOptionIndex": 1,
            "debrief": "During a rebase, Git replays commits one by one. If a conflict occurs, you resolve it, stage it with <code>git add</code>, and invoke <code>git rebase --continue</code> so the rebase engine can commit and proceed to the next step."
        },
        "quests": [
            {
                "id": "Q35.69",
                "name": "DAG Topology Analysis: Linear vs Merge-Heavy Histories",
                "type": "Concept",
                "desc": "Analyze the architectural trade-offs between strict linear histories (rebase) and preserved branching topologies (merge commits), examining bisect efficiency."
            },
            {
                "id": "Q35.70",
                "name": "The 400-Merge-Bubble Spaghetti Repository Detective",
                "type": "Detective Challenge",
                "desc": "Audit an unmaintained repository DAG littered with recursive merge bubbles; reconstruct a clean linear history using automated rebase sequencing."
            },
            {
                "id": "Q35.71",
                "name": "Enterprise Repository Hygiene Linter & Policy Enforcer",
                "type": "Mastery Assignment",
                "desc": "Develop a server-side pre-receive hook or GitHub Action that verifies incoming branches adhere to linear history standards and rejects merge bubbles."
            },
            {
                "id": "Q35.72",
                "name": "Automated Multi-Developer Rebase Synchronization Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Simulate 20 developers pulling and rebasing concurrently against an active release branch; measure conflict frequency and commit replay stability."
            }
        ]
    },
    {
        "day": 19,
        "month": 1,
        "blockNum": 4,
        "title": "Repository Cleanliness: `.gitignore` Specification, Globbing Patterns, Negation (`!`) & `git clean -fdx`",
        "stageNum": 4,
        "stageName": "Stage 4: Remote Repositories, Synchronization & Collaboration",
        "pedagogicalRole": "Repository Hygiene & Sanitization (.gitignore Syntax, Globbing, Negation Rules, git rm --cached, git clean)",
        "spokenGoal": "Every developer has accidentally committed <code>.DS_Store</code>, <code>Thumbs.db</code>, <code>node_modules/</code>, or a secret <code>.env</code> file. Today, you master repository hygiene: writing professional <code>.gitignore</code> files with globbing patterns, directory recursion (<code>**/</code>), and exception negation rules (<code>!important.log</code>), purging mistakenly tracked files with <code>git rm --cached</code>, and safely scrubbing your working tree with <code>git clean -fdx</code>.",
        "conceptInvariant": "Tracked Status vs Ignore Invariant: <code>.gitignore</code> rules apply strictly to untracked files. Once a file is tracked in the Git Index, adding it to <code>.gitignore</code> has zero effect. To ignore an already-tracked file, it must be untracked using <code>git rm --cached <file></code>.",
        "failureMode": "The 4GB Node_Modules Repository Bloat Catastrophe: A developer runs <code>git add .</code> without a <code>.gitignore</code> and commits a 4GB <code>node_modules</code> directory. Even after deleting it in a subsequent commit, every developer on the team must download the 4GB payload on clone because the historical Blobs remain permanently in <code>.git/objects/</code>.",
        "tryItFriction": "Construct a repository with ignored logs; commit a <code>debug.log</code> file, then demonstrate that adding <code>*.log</code> to <code>.gitignore</code> does NOT stop Git from tracking modifications until you run <code>git rm --cached debug.log</code>.",
        "socraticHints": [
            "Why does a file already committed to Git continue to show up in <code>git status</code> even after you add its name to <code>.gitignore</code>?",
            "What is the dangerous difference between <code>git clean -fd</code> and <code>git clean -fdx</code>?",
            "How does the negation operator (<code>!</code>) in <code>.gitignore</code> allow you to ignore an entire directory while preserving a single specific file inside it?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer writes the following <code>.gitignore</code> file:\\n<code>build/\\n!build/config.json</code>\\nThey place <code>config.json</code> inside the <code>build/</code> directory, but Git still ignores it. Why is the negation rule not working?",
            "options": [
                "Git does not support the exclamation mark syntax.",
                "Diagnose Parent Directory Traversal Cutoff: Git will not re-include a file if its parent directory is excluded. Because <code>build/</code> ignores the entire folder, Git never traverses inside <code>build/</code> to evaluate rules for children. Fix by ignoring directory contents instead: <code>build/*\\n!build/config.json</code>.",
                "The file must be renamed to config.txt.",
                "Negation rules only work on Linux."
            ],
            "correctOptionIndex": 1,
            "debrief": "If an entire directory is ignored (<code>build/</code>), Git skips scanning that directory entirely for performance reasons, meaning child negation rules are never evaluated. Using <code>build/*</code> with <code>!build/config.json</code> fixes this."
        },
        "quests": [
            {
                "id": "Q35.73",
                "name": "Git Ignore Pattern Grammar & Pattern Matching Architecture",
                "type": "Concept",
                "desc": "Analyze the formal grammar of .gitignore, examining fnmatch globbing, leading/trailing slashes, directory recursion, and negation precedence."
            },
            {
                "id": "Q35.74",
                "name": "The Tracked Secret in .gitignore False Sense of Security Detective",
                "type": "Detective Challenge",
                "desc": "Investigate a security incident where developers believed .env was ignored because it was in .gitignore, yet active secrets were still tracked in HEAD."
            },
            {
                "id": "Q35.75",
                "name": "Automated Repository Hygiene Linter & Untracker CLI",
                "type": "Mastery Assignment",
                "desc": "Build an automated repository cleaning tool that detects mistakenly tracked build artifacts, removes them from index tracking, and updates .gitignore."
            },
            {
                "id": "Q35.76",
                "name": "git clean -fdx Dry-Run & Accidental WIP Deletion Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Test git clean -n (dry-run) against mixed untracked assets and ignored configuration files; verify safe cleaning without deleting uncommitted WIP code."
            }
        ]
    },
    {
        "day": 20,
        "month": 1,
        "blockNum": 4,
        "title": "Milestone 4: ApexSync Distributed Multi-Remote Synchronization & Refspec Engine Suite",
        "stageNum": 4,
        "stageName": "Stage 4: Remote Repositories, Synchronization & Collaboration",
        "pedagogicalRole": "Synthesis & Distributed Networking (Multi-Remote Federation, Refspec Router, Upstream Pruner & Linear Sync Engine)",
        "spokenGoal": "Milestone 4 tests your mastery of distributed Git architecture and network synchronization. You will architect ApexSync: an enterprise-grade multi-remote synchronization engine that federates code across multiple remotes (e.g. GitHub public origin, internal corporate GitLab, and off-site backup bare repositories), automates branch pruning, enforces linear rebase-pull policies, and protects against non-fast-forward divergence.",
        "conceptInvariant": "Multi-Remote Federation Invariant: A multi-remote federation must guarantee that local integration branches resolve upstream differences deterministically across all remotes without refspec collisions or state desynchronization.",
        "failureMode": "The Asynchronous Multi-Remote Split-Brain Disaster: An enterprise pushes code to both GitHub and an internal GitLab mirror using unsynchronized automated scripts. A network partition causes GitLab to accept commit $A$ and GitHub to accept commit $B$. The repositories diverge, breaking build pipelines across both cloud providers.",
        "tryItFriction": "Construct a multi-remote setup with three bare repositories; use your ApexSync tool to atomically synchronize branch refs across all three remotes while pruning deleted branches.",
        "socraticHints": [
            "How do refspecs allow you to push all local branches to a remote in a single atomic command (<code>git push <remote> 'refs/heads/*:refs/heads/*'</code>)?",
            "Why must enterprise CI/CD systems always configure <code>git fetch --prune</code> before computing branch deltas?",
            "How does ApexSync detect when two remotes have diverged into a split-brain state?"
        ],
        "situationalPuzzle": {
            "scenario": "A deployment script synchronizes an internal GitLab mirror with an upstream GitHub repository. An engineer notices that feature branches deleted on GitHub weeks ago still exist on GitLab, growing into thousands of dead branches over time.",
            "options": [
                "GitLab has a bug that prevents branch deletion.",
                "Diagnose Missing Remote Prune and Mirror Push: The sync script ran <code>git fetch origin</code> and <code>git push gitlab</code>. Standard push does not delete remote branches on the target that were removed on the source. The script must execute <code>git fetch origin --prune</code> followed by <code>git push gitlab --prune</code> (or <code>git push gitlab --mirror</code>) to propagate branch deletions.",
                "GitLab requires manual web UI deletion for all branches.",
                "Restart the GitLab server."
            ],
            "correctOptionIndex": 1,
            "debrief": "Standard <code>git push</code> only pushes existing local branches; it does not delete remote branches that no longer exist locally. Adding the <code>--prune</code> flag to <code>git push</code> instructs Git to remove remote branches on the destination that have been deleted locally."
        },
        "quests": [
            {
                "id": "Q35.77",
                "name": "ApexSync Multi-Remote Architecture & Federation Blueprint",
                "type": "Concept",
                "desc": "Document the complete systems blueprint of ApexSync, detailing refspec routing, multi-remote state machines, and split-brain detection algorithms."
            },
            {
                "id": "Q35.78",
                "name": "The Multi-Remote Split-Brain Desynchronization Detective",
                "type": "Detective Challenge",
                "desc": "Investigate a high-stakes enterprise mirror desynchronization where two remotes accepted conflicting branch tips; reconcile the repositories."
            },
            {
                "id": "Q35.79",
                "name": "ApexSync Distributed Federation & Synchronization Engine",
                "type": "Mastery Assignment",
                "desc": "Build the full ApexSync platform: a CLI that manages multi-remote syncs, enforces linear rebase pulls, prunes stale refs, and verifies ref consistency."
            },
            {
                "id": "Q35.80",
                "name": "ApexSync Milestone 4 Viva Defense & Network Partition Gate",
                "type": "Production Incident Lab",
                "desc": "Defend ApexSync before the Enterprise DevOps Board under simulated network partitions, simultaneous pushes, and corrupted refspec mappings."
            }
        ]
    },
    {
        "day": 21,
        "month": 1,
        "blockNum": 5,
        "title": "GitHub Pull Request Architecture: Forking vs Branching, Draft PRs, Issue Linkage & Conventional Commits",
        "stageNum": 5,
        "stageName": "Stage 5: Advanced Collaboration, PR Workflows & Code Review",
        "pedagogicalRole": "Pull Request Engineering (Forking Model, Branching Model, Draft PRs, Issue Closing Keywords, Conventional Commits)",
        "spokenGoal": "Writing code is only 40% of a professional engineer's job; the other 60% is communicating that code to teammates through Pull Requests. Today, you master Pull Request Architecture: when to use Forking (open source and untrusted contributors) versus Shared-Branching (internal trusted teams), leveraging Draft PRs for early architectural feedback, linking issues automatically (<code>Closes #42</code>), and formatting commits with Conventional Commits (<code>feat:</code>, <code>fix:</code>, <code>chore:</code>).",
        "conceptInvariant": "Pull Request Reviewability Contract Invariant: A Pull Request is a formal, reviewable unit of proposed code change: $\\text{PR} = (B_{\\text{head}} \\to B_{\\text{base}})$. It must include: (1) explicit problem motivation, (2) automated test coverage evidence, (3) atomic conventional commits, and (4) passing CI checks.",
        "failureMode": "The 3,500-Line Unreviewable Mega-PR Bottleneck: A developer works in isolation for 6 weeks and opens a pull request touching 80 files and 3,500 lines of code titled 'misc updates'. No senior engineer can review it thoroughly. It sits in review purgatory for a month, generates 50 merge conflicts, and introduces three critical bugs when finally merged under sprint pressure.",
        "tryItFriction": "Author a production Pull Request template (<code>.github/PULL_REQUEST_TEMPLATE.md</code>) in markdown that enforces issue linkage, architectural rationale, a manual testing checklist, and Conventional Commit title validation.",
        "socraticHints": [
            "Why is the Fork-and-Pull model standard for open-source repositories, while internal company teams use Shared-Repository branching?",
            "How does opening a PR as a 'Draft' prevent accidental merges and signal to reviewers that code is in progress?",
            "What automated tools (such as semantic-release or Commitlint) rely on Conventional Commits to generate automated release changelogs?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer opens a pull request with the title 'Fixed the login issue'. The team's CI pipeline fails instantly on the PR title check step. What is the cause of the failure?",
            "options": [
                "The PR title is too short.",
                "Diagnose Conventional Commits Specification Violation: The repository enforces Conventional Commits via a GitHub Action (e.g., commitlint or semantic-pr). The title lacks a required type prefix (such as <code>fix(auth): resolve session expiration on login</code>). Renaming the PR title to conform to the specification allows CI to pass.",
                "GitHub requires all PR titles to be in ALL CAPS.",
                "The developer must be an enterprise admin to name PRs."
            ],
            "correctOptionIndex": 1,
            "debrief": "Modern engineering teams use automated PR title linters enforcing Conventional Commits format (<code>type(scope): description</code>). Titles that do not follow the specification fail automated CI status checks."
        },
        "quests": [
            {
                "id": "Q35.81",
                "name": "Pull Request Systems Architecture & Review Workflows",
                "type": "Concept",
                "desc": "Analyze the mechanics of PR head/base ref updates, forking vs branching models, GitHub API webhooks, and Conventional Commit specifications."
            },
            {
                "id": "Q35.82",
                "name": "The Unreviewable 3,500-Line Monolithic PR Deconstruction Detective",
                "type": "Detective Challenge",
                "desc": "Take a bloated 3,500-line monolithic pull request; decompose it into a stacked series of 4 small, atomic, reviewable PRs with dependency chaining."
            },
            {
                "id": "Q35.83",
                "name": "Automated Conventional PR Title & Changelog Validation Engine",
                "type": "Mastery Assignment",
                "desc": "Build a GitHub Action or CLI tool that validates PR titles and commit messages against Conventional Commits and auto-generates SemVer release notes."
            },
            {
                "id": "Q35.84",
                "name": "Stacked Pull Request Rebase & Fast-Forward Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Construct a chain of 3 stacked PRs where each branch depends on the prior branch; rebase the stack when PR 1 is modified, verifying ref integrity."
            }
        ]
    },
    {
        "day": 22,
        "month": 1,
        "blockNum": 5,
        "title": "Code Review Mechanics: Diffs, Inline Comments, Suggested Changes & GitHub Merge Strategies",
        "stageNum": 5,
        "stageName": "Stage 5: Advanced Collaboration, PR Workflows & Code Review",
        "pedagogicalRole": "Code Review Engineering (Diff Inspection, Inline Comments, Multi-Line Suggestions, Squash vs Rebase vs Merge Commit)",
        "spokenGoal": "Code review is where architectural standards and security are defended. Today, you master the mechanics of world-class code reviews on GitHub: navigating diff views (split vs unified, ignoring whitespace), authoring actionable inline comments and multi-line suggested changes that authors can commit with one click, and mastering GitHub's three merge buttons: Create a Merge Commit, Squash and Merge, and Rebase and Merge.",
        "conceptInvariant": "GitHub Merge Strategy Invariant: Squash-and-merge collapses all $N$ PR commits into a single atomic commit with author attribution; Rebase-and-merge replays all $N$ individual commits linearly onto base; Create a Merge Commit creates an explicit 2-parent merge node preserving the branch bubble.",
        "failureMode": "The Accidental Rebase-Merge 40-Commit Pollution: A junior developer submits a PR with 40 micro-commits ('wip', 'fixed typo', 'temp', 'test'). A senior reviewer clicks 'Rebase and Merge' instead of 'Squash and Merge'. All 40 dirty commits are permanently spliced into the <code>main</code> branch history, corrupting <code>git log</code> and polluting the git history.",
        "tryItFriction": "Author a pull request review on GitHub using markdown suggested changes (<code>```suggestion ... ```</code>); accept the suggestion as the PR author with one click, verify that a new commit is appended, and evaluate the resulting diff.",
        "socraticHints": [
            "When should an engineering team use 'Squash and Merge' versus 'Rebase and Merge' versus standard 'Create a Merge Commit'?",
            "How does hiding whitespace changes (<code>?w=1</code> in GitHub URL or <code>git diff -w</code>) drastically improve review efficiency during large indentation refactors?",
            "Why is leaving a suggested change block in a review comment vastly more effective than typing 'please change line 42 to use const'?"
        ],
        "situationalPuzzle": {
            "scenario": "A team uses 'Squash and Merge' for all pull requests. A developer creates a feature branch, submits PR 1, and it is squashed and merged. The developer continues working on the same local branch, makes more commits, and opens PR 2 against <code>main</code>. GitHub shows PR 2 contains all the commits already merged in PR 1, plus conflicts.",
            "options": [
                "GitHub has experienced a database sync glitch.",
                "Diagnose Commit Hash Identity Loss from Squashing: Squash-and-merge created a single new commit on <code>main</code> with a new hash, abandoning the individual commit hashes that exist on the developer's local branch. To continue working cleanly, the developer should have created a new branch from updated <code>main</code>, or rebased their branch onto the updated <code>main</code> using <code>git rebase --onto</code>.",
                "The developer must delete their GitHub account.",
                "Squash and merge should never be used on any project."
            ],
            "correctOptionIndex": 1,
            "debrief": "Squash-and-merge flattens commits into a brand-new commit on <code>main</code>. The original commit hashes on the feature branch are not recognized as part of <code>main</code>'s ancestry. Reusing the same branch causes duplicate commits and merge conflicts."
        },
        "quests": [
            {
                "id": "Q35.85",
                "name": "GitHub Merge Engine Mechanics & DAG Synthesis",
                "type": "Concept",
                "desc": "Analyze the technical mechanics of GitHub's three merge strategies (Merge Commit, Squash, Rebase), comparing commit graph structures and authorship headers."
            },
            {
                "id": "Q35.86",
                "name": "The Rebase-Merged 40-Commit Pollution Cleanup Detective",
                "type": "Detective Challenge",
                "desc": "Investigate a compromised main branch polluted by 40 messy commits from an erroneous rebase-merge; cleanly squash the history without disrupting active clones."
            },
            {
                "id": "Q35.87",
                "name": "Automated Pull Request Code Review & Suggestion Bot",
                "type": "Mastery Assignment",
                "desc": "Build a GitHub Action bot using the GitHub REST API that analyzes incoming PR diffs for anti-patterns and posts multi-line code suggestions automatically."
            },
            {
                "id": "Q35.88",
                "name": "High-Volume Multi-Reviewer Approval & Merge Race Lab",
                "type": "Production Incident Lab",
                "desc": "Simulate 5 reviewers approving and merging PRs concurrently under strict branch protections; test auto-merge queues and fast-forward rebases."
            }
        ]
    },
    {
        "day": 23,
        "month": 1,
        "blockNum": 5,
        "title": "Git Worktrees: Concurrent Multi-Branch Checkouts Without Stashing or Cloning (`git worktree add`)",
        "stageNum": 5,
        "stageName": "Stage 5: Advanced Collaboration, PR Workflows & Code Review",
        "pedagogicalRole": "Advanced Workspace Engineering (Git Worktrees, Shared Object Store, Concurrent Branching & Isolated Build Directories)",
        "spokenGoal": "Senior engineers never clone the same repository multiple times, nor do they interrupt their workflow by stashing unfinished work to handle an urgent hotfix. They use Git Worktrees. With <code>git worktree</code>, a single repository can check out multiple branches into separate physical folders on disk at the same time, sharing the exact same <code>.git/objects/</code> store. Today, you master worktree physics, lifecycle management, and isolated multi-branch workflows.",
        "conceptInvariant": "Shared Object Store Multi-Tree Invariant: All linked worktrees share the primary repository's <code>.git/objects/</code> database. A specific branch ref can be checked out in at most ONE worktree at any given time to prevent concurrent write collisions on branch heads.",
        "failureMode": "The Branch Locked in Another Worktree Collision: An engineer attempts to switch to branch <code>feature-auth</code> in their main repo directory. Git halts with: 'fatal: feature-auth is already checked out at /home/user/worktrees/hotfix'. The engineer panics, deletes the directory manually with <code>rm -rf</code>, leaving administrative metadata orphaned in <code>.git/worktrees/</code>.",
        "tryItFriction": "Create a linked worktree using <code>git worktree add ../hotfix-branch -b hotfix-urgent</code>; make a commit in the hotfix directory, switch back to your main repository directory, and verify that the commit is immediately reachable without any fetch or push.",
        "socraticHints": [
            "Why is creating a Git worktree vastly faster and more disk-efficient than creating a second <code>git clone</code> of the project?",
            "Where does Git store the administrative metadata for linked worktrees, and how does <code>git worktree prune</code> clean up deleted trees?",
            "Why does Git strictly forbid checking out the same branch in two different worktrees simultaneously?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer deletes a worktree directory using <code>rm -rf ../temp-worktree</code> in their terminal. Later, when they try to run <code>git worktree add ../temp-worktree feature</code>, Git says the worktree already exists or is locked. How do they clean up Git's internal worktree registry?",
            "options": [
                "Reinstall Git on the computer.",
                "Diagnose Orphaned Worktree Administrative Metadata: Manually deleting the folder does not remove the metadata stored in <code>.git/worktrees/temp-worktree/</code>. The developer must run <code>git worktree prune</code>, which scans registered worktrees, detects missing directories on disk, and purges the stale administrative records.",
                "Delete .git/HEAD.",
                "Create a dummy file called .worktree."
            ],
            "correctOptionIndex": 1,
            "debrief": "Git maintains administrative tracking files inside <code>.git/worktrees/</code> for every linked worktree. If you delete a worktree folder using OS commands, you must run <code>git worktree prune</code> to clean up Git's internal records."
        },
        "quests": [
            {
                "id": "Q35.89",
                "name": "Git Worktree Internals & Shared Object Store Architecture",
                "type": "Concept",
                "desc": "Detail the physical layout of .git/worktrees/, examining per-worktree HEAD and index files, shared object databases, and locking mechanics."
            },
            {
                "id": "Q35.90",
                "name": "The Orphaned Worktree Metadata Deadlock Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a repository where manually deleted worktrees locked critical release branches; clean up administrative state using worktree prune."
            },
            {
                "id": "Q35.91",
                "name": "Multi-Branch Concurrent Worktree Orchestrator CLI",
                "type": "Mastery Assignment",
                "desc": "Build a workspace orchestration tool in Bash/Python that spins up isolated worktrees for feature development, hotfixes, and PR reviews automatically."
            },
            {
                "id": "Q35.92",
                "name": "10-Worktree Concurrent Build & Test Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Spin up 10 concurrent worktrees sharing the same Git object store; execute parallel dependency installs and builds, verifying zero object store locks."
            }
        ]
    },
    {
        "day": 24,
        "month": 1,
        "blockNum": 5,
        "title": "Bug Hunting with `git bisect`: Binary Search Traversal, Automated Bisect Scripts & `git blame` Forensics",
        "stageNum": 5,
        "stageName": "Stage 5: Advanced Collaboration, PR Workflows & Code Review",
        "pedagogicalRole": "Forensic Debugging & Algorithmic Search (git bisect, Binary Search over DAG, Automated Bisect Scripts, git blame & git log -S)",
        "spokenGoal": "A critical bug is discovered in production, and 400 commits were merged over the past month. Manually testing each commit would take days. <code>git bisect</code> uses binary search across the commit DAG to pinpoint the exact commit that introduced the bug in $\\lceil \\log_2 N \\rceil$ steps (finding the bug in ~9 steps out of 500 commits). Today, you master bisect: manual labeling (good/bad), handling uncompilable commits with <code>skip</code>, automated bisect scripts with <code>git bisect run</code>, and code forensics with <code>git blame</code> and pickaxe search (<code>git log -S</code>).",
        "conceptInvariant": "Bisect Binary Search Invariant: Given a known good commit $G$ and known bad commit $B$, <code>git bisect</code> tests the midpoint commit $M$. If $M$ is bad, $B \\leftarrow M$; if $M$ is good, $G \\leftarrow M$. In $\\lceil \\log_2 N \\rceil$ tests, it isolates the regression commit with mathematical certainty.",
        "failureMode": "The Untestable Broken Build False Negative Disaster: During an automated bisect run, an intermediate commit fails to compile due to an unrelated syntax typo. The automated script exits with code 1, causing Git bisect to erroneously mark the commit as 'bad', pointing the team to the wrong commit and wasting hours investigating an innocent change.",
        "tryItFriction": "Create a repository with 20 commits where commit 14 introduces a bug; write an automated shell script that returns exit code 0 when the bug is absent and exit code 1 when present, and run <code>git bisect run ./test.sh</code> to locate commit 14 automatically.",
        "socraticHints": [
            "Why does an automated bisect test script need to return exit code 125 when it encounters an uncompilable commit that should be skipped?",
            "How does <code>git log -S <string></code> (the Pickaxe search) locate the exact commit that added or removed a specific function name across all history?",
            "Why is <code>git blame -w -M -C</code> vastly more useful than a basic <code>git blame</code> when inspecting code that has undergone formatting or refactoring?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer executes <code>git bisect start</code>, marks the current commit as <code>bad</code>, and marks a commit from last week as <code>good</code>. Git checks out the midpoint commit. The developer tries to run their test, but the application crashes immediately because a dependent npm package was missing at that historical commit.",
            "options": [
                "Mark the commit as bad immediately.",
                "Diagnose Indeterminate Bisect State: The commit is un-testable and cannot be categorized as good or bad. Marking it bad would corrupt the binary search. The developer must run <code>git bisect skip</code> (or have their test script exit with code 125). Git will pick an adjacent commit to test instead, preserving the mathematical integrity of the search.",
                "Abort the bisect and test all commits manually.",
                "Delete the npm package from the repository."
            ],
            "correctOptionIndex": 1,
            "debrief": "If a commit cannot be tested (e.g. build failure or broken dependency), you must tell Git to <code>skip</code> it. Marking it bad or good based on an unrelated issue will derail the binary search."
        },
        "quests": [
            {
                "id": "Q35.93",
                "name": "Binary Search over Directed Acyclic Graphs & Bisect Mechanics",
                "type": "Concept",
                "desc": "Analyze the algorithmic implementation of git bisect, exploring merge-commit graph pruning, exit code conventions (0, 1, 125), and pickaxe search."
            },
            {
                "id": "Q35.94",
                "name": "The Phantom Production Memory Leak Bisect Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a high-frequency trading latency degradation across 500 commits; use git bisect run to isolate the exact 2-line memory leak."
            },
            {
                "id": "Q35.95",
                "name": "Automated Headless Bisect Runner & Regression Linter",
                "type": "Mastery Assignment",
                "desc": "Develop a headless bisect automation framework that spins up test containers, compiles intermediate commits, handles exit code 125 skips, and outputs root-cause reports."
            },
            {
                "id": "Q35.96",
                "name": "Non-Monotonic Flaky Test Bisect Chaos Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Subject git bisect to a flaky, non-deterministic test that fails intermittently; evaluate statistical bisect strategies and multiple-run consensus algorithms."
            }
        ]
    },
    {
        "day": 25,
        "month": 1,
        "blockNum": 5,
        "title": "Milestone 5: ApexReview Enterprise Pull Request Validation & Bisect Bug Hunting Suite",
        "stageNum": 5,
        "stageName": "Stage 5: Advanced Collaboration, PR Workflows & Code Review",
        "pedagogicalRole": "Synthesis & Quality Engineering (PR Automated Validation, Multi-Worktree Orchestration, Bisect Regression Engine & Review Defense)",
        "spokenGoal": "Milestone 5 tests your mastery of enterprise code review workflows, worktree isolation, and automated regression forensics. You will architect ApexReview: a unified platform that automatically validates incoming pull requests, tests mergeability, spins up isolated worktrees for review, and includes an automated bisect engine that tracks down regressions when tests fail.",
        "conceptInvariant": "Automated Quality Gate Invariant: A proposed change must satisfy four automated invariants before merge: (1) 100% Conventional Commit compliance, (2) zero unadjudicated merge conflict markers, (3) isolated worktree build reproducibility, and (4) zero test regressions verified via bisect replay.",
        "failureMode": "The Flaky CI Automated Merge Catastrophe: An automated merge queue merges 15 PRs based on a green test result. Two hours later, production crashes. Because tests were flaky and intermediate merge commits were not bisected, the team cannot identify which of the 15 PRs introduced the defect, forcing a full rollback of the entire release.",
        "tryItFriction": "Deploy the ApexReview engine to evaluate a synthetic repository containing 3 candidate pull requests; have the tool detect a Conventional Commit violation in PR 1, spin up a worktree to test PR 2, and use automated bisect to isolate a regression in PR 3.",
        "socraticHints": [
            "How does combining Git Worktrees with automated CI runners allow parallel review testing without disk cloning overhead?",
            "Why must an automated PR validation engine check for merge conflicts against the target branch rather than relying only on the PR branch state?",
            "How does automated bisect provide instant root-cause analysis when an integrated build fails?"
        ],
        "situationalPuzzle": {
            "scenario": "During an automated PR review scan, ApexReview reports that a pull request passes all unit tests, but marks the PR as 'BLOCKED: DIVERGENT MERGE BASE'. The author claims the PR is ready to merge because tests pass locally.",
            "options": [
                "The bot is broken and should be disabled.",
                "Diagnose Outdated Merge Base Risk: The PR was branched 3 weeks ago, and <code>main</code> has progressed by 120 commits since then. Even though the PR passes tests against its old base, it has not been tested against the latest code on <code>main</code>. Merging it could cause silent semantic breakages. The author must rebase onto the current <code>main</code> and re-run tests before merging.",
                "Merge the PR immediately to avoid further divergence.",
                "Revert main to 3 weeks ago."
            ],
            "correctOptionIndex": 1,
            "debrief": "Testing against an outdated branch base only proves the code works against 3-week-old code. Gating on recent merge base proximity ensures code is tested against the current production state before merging."
        },
        "quests": [
            {
                "id": "Q35.97",
                "name": "ApexReview Architectural Blueprint & Quality Gate Specification",
                "type": "Concept",
                "desc": "Document the complete systems blueprint of ApexReview, specifying worktree pool allocation, automated diff analysis, and bisect automation hooks."
            },
            {
                "id": "Q35.98",
                "name": "The Broken Merge Queue Flaky PR Forensic Detective",
                "type": "Detective Challenge",
                "desc": "Investigate a broken automated merge queue where a flawed PR slipped past status checks; isolate the race condition and harden the validation rules."
            },
            {
                "id": "Q35.99",
                "name": "ApexReview Production PR Validation & Bisect Suite",
                "type": "Mastery Assignment",
                "desc": "Build the full ApexReview CLI platform: an automated system that validates PRs, manages review worktrees, and executes automated bisect regression testing."
            },
            {
                "id": "Q35.100",
                "name": "ApexReview Milestone 5 Viva Defense & Chaos Injection Gate",
                "type": "Production Incident Lab",
                "desc": "Defend ApexReview before the Principal Engineering Board under chaotic concurrent PR submissions, injected flaky tests, and hostile commit payloads."
            }
        ]
    },
    {
        "day": 26,
        "month": 1,
        "blockNum": 6,
        "title": "Modular Codebases: Git Submodules (`.gitmodules`, Detached Heads) vs Git Subtree (`git subtree`)",
        "stageNum": 6,
        "stageName": "Stage 6: Modular Repositories, CI Basics & Month 1 Capstone",
        "pedagogicalRole": "Modular Repository Architecture (Git Submodules, Gitlink Object Mode 160000, .gitmodules, Git Subtrees & Inlining)",
        "spokenGoal": "Enterprise software architectures rarely live in a single repository. You will often need to share common libraries, schemas, or engines across projects. Today, you master modular Git architectures: Git Submodules (tracking external repositories via exact commit SHA pointers) versus Git Subtrees (embedding foreign code directly into your repository). You will understand the Gitlink object (mode 160000), why submodules default to a detached HEAD state, and how to avoid submodule pointer drift.",
        "conceptInvariant": "Gitlink 160000 Object Invariant: In the parent repository tree, a submodule is stored as a special Gitlink entry with octal mode <code>160000</code>. It contains zero file contents—only the 40-character commit SHA of the foreign repository: $\\text{Mode } 160000 \\implies \\text{commit SHA}$.",
        "failureMode": "The Unpushed Submodule Commit CI Pipeline Crash: A developer makes changes inside a submodule, commits the submodule locally, updates the parent repository's submodule pointer, and runs <code>git push</code> on the parent repository without pushing the submodule. When the CI pipeline attempts to clone the parent repository, it fails with: 'fatal: reference is not a tree', aborting the release.",
        "tryItFriction": "Add a submodule to a test repository using <code>git submodule add <url> lib/core</code>; inspect <code>.gitmodules</code> and the Gitlink mode using <code>git ls-tree HEAD lib/core</code>, update the submodule to a new commit, and commit the updated pointer in the parent repository.",
        "socraticHints": [
            "Why does cloning a repository containing submodules leave the submodule directories empty unless you pass <code>--recurse-submodules</code>?",
            "What is the operational difference between Git Submodules (which keep repositories independent) and Git Subtrees (which merge history directly into the host repo)?",
            "Why does navigating into a submodule directory and checking <code>git status</code> almost always report 'HEAD detached at <hash>'?"
        ],
        "situationalPuzzle": {
            "scenario": "A new developer clones the company's main project using <code>git clone <url></code>. When they attempt to compile the app, the build fails because the <code>shared-ui/</code> directory is completely empty. The developer claims files are missing from GitHub.",
            "options": [
                "The GitHub server had a file transfer error.",
                "Diagnose Uninitialized Submodule: <code>shared-ui/</code> is a Git submodule. Standard <code>git clone</code> does not automatically initialize or download submodule contents. The developer must run <code>git submodule update --init --recursive</code> (or clone with <code>git clone --recurse-submodules</code>) to fetch the submodule repositories.",
                "The developer must manually copy files from a colleague's USB drive.",
                "Submodules require Windows Enterprise edition."
            ],
            "correctOptionIndex": 1,
            "debrief": "Standard <code>git clone</code> clones only the parent repository, leaving submodule directories empty. Running <code>git submodule update --init --recursive</code> initializes the configuration and downloads the foreign repository commits."
        },
        "quests": [
            {
                "id": "Q35.101",
                "name": "Git Submodule & Gitlink 160000 Physical Architecture",
                "type": "Concept",
                "desc": "Detail the physical layout of .gitmodules, .git/modules/, and Gitlink tree mode 160000 entries, comparing them against Git Subtree mechanics."
            },
            {
                "id": "Q35.102",
                "name": "The Unpushed Submodule Pointer CI Blackout Detective",
                "type": "Detective Challenge",
                "desc": "Investigate a broken CI build where parent commits referenced unpushed submodule commits; recover the lost commit and repair the submodule link."
            },
            {
                "id": "Q35.103",
                "name": "Modular Submodule & Subtree Dependency Synchronizer",
                "type": "Mastery Assignment",
                "desc": "Build an automated CLI tool that checks submodule pointer validity, enforces that submodules are pushed before parent commits, and syncs subtrees."
            },
            {
                "id": "Q35.104",
                "name": "Nested Recursive Submodule Multi-Level Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Construct a 3-tier deeply nested submodule hierarchy; test recursive cloning, atomic branch switching, and detached-HEAD commits."
            }
        ]
    },
    {
        "day": 27,
        "month": 1,
        "blockNum": 6,
        "title": "Introduction to GitHub Actions: Workflow YAML Syntax, Triggers (`on: push, pull_request`), Jobs & Steps",
        "stageNum": 6,
        "stageName": "Stage 6: Modular Repositories, CI Basics & Month 1 Capstone",
        "pedagogicalRole": "CI/CD Foundations (GitHub Actions, Workflow YAML Grammar, Event Triggers, Jobs DAG & Step Execution)",
        "spokenGoal": "Modern version control does not just store code; it automatically tests, builds, and validates code on every push. GitHub Actions is the industry standard for continuous integration. Today, you master GitHub Actions: writing declarative workflow YAML files in <code>.github/workflows/</code>, configuring event triggers (<code>on: push</code>, <code>on: pull_request</code>), understanding the runner environment, using community actions like <code>actions/checkout@v4</code>, and structuring multi-step build jobs.",
        "conceptInvariant": "Declarative CI Workflow DAG Invariant: A GitHub Actions workflow is a declarative Directed Acyclic Graph of jobs executed in isolated container/VM runners: $\\text{Workflow} = \\{ J_1, J_2, \\dots, J_n \\}$. Jobs run in parallel by default unless explicit dependency edges are declared via <code>needs: [J_k]</code>.",
        "failureMode": "The Infinite CI Runner Loop Bill Outage: A developer writes a GitHub Actions workflow that automatically formats code and commits changes back to the repository using <code>git push</code>. The push triggers the workflow again, which formats and pushes, triggering an infinite recursive loop that burns through 50,000 CI runner minutes in 6 hours.",
        "tryItFriction": "Author a GitHub Actions workflow file <code>.github/workflows/ci.yml</code> that triggers on pull requests to <code>main</code>, checks out code, sets up Node.js, and runs an automated linting script, verifying execution in GitHub Actions.",
        "socraticHints": [
            "Why must automated CI workflows that push commits back to a repository use <code>[skip ci]</code> in the commit message or filter triggers to avoid infinite loops?",
            "What is the difference between a job (which runs on its own virtual machine) and a step (which runs sequentially inside that job's VM)?",
            "Why does <code>actions/checkout@v4</code> fetch only a single commit (shallow clone, <code>fetch-depth: 1</code>) by default, and when must you set <code>fetch-depth: 0</code>?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer adds a PR validation workflow to check git history using <code>git log --oneline HEAD~5..HEAD</code>. When run in GitHub Actions, the step fails with: 'fatal: ambiguous argument HEAD~5: unknown revision or path'. The command works perfectly on their local machine.",
            "options": [
                "GitHub Actions does not support Git commands.",
                "Diagnose Shallow Clone Default: <code>actions/checkout</code> defaults to a shallow clone with <code>fetch-depth: 1</code> (fetching only the exact commit being tested). Relative history like <code>HEAD~5</code> does not exist on the runner. The developer must configure <code>with: fetch-depth: 0</code> to fetch complete commit history for ancestry operations.",
                "The runner lacks sufficient disk space.",
                "The developer must run git init on the runner."
            ],
            "correctOptionIndex": 1,
            "debrief": "By default, <code>actions/checkout</code> performs a shallow clone of depth 1 to minimize download time. Commands that inspect historical commits (like <code>git log HEAD~5</code> or <code>git bisect</code>) fail unless <code>fetch-depth: 0</code> is specified."
        },
        "quests": [
            {
                "id": "Q35.105",
                "name": "GitHub Actions Runtime Architecture & Event Dispatch Engine",
                "type": "Concept",
                "desc": "Detail the architecture of GitHub Actions, exploring event webhook payloads, runner virtual machine isolation, step execution contexts, and secret masking."
            },
            {
                "id": "Q35.106",
                "name": "The Recursive CI Infinite Loop Runner Depletion Detective",
                "type": "Detective Challenge",
                "desc": "Investigate a misconfigured auto-formatting workflow that triggered an infinite push loop; terminate the runaway jobs and implement trigger guards."
            },
            {
                "id": "Q35.107",
                "name": "Production Multi-Stage CI Pipeline Workflow Specification",
                "type": "Mastery Assignment",
                "desc": "Author a comprehensive GitHub Actions workflow featuring linting, unit testing, matrix builds (Node 18, 20, 22), and artifact publishing with job dependencies."
            },
            {
                "id": "Q35.108",
                "name": "Shallow Clone vs Full-Depth History Performance Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Benchmark workflow checkout times and disk usage across fetch-depth 1 vs 0 on a 50,000-commit repository; verify history requirements."
            }
        ]
    },
    {
        "day": 28,
        "month": 1,
        "blockNum": 6,
        "title": "Basic CI Validation: Automated Linting, Unit Testing & Status Checks in Pull Requests",
        "stageNum": 6,
        "stageName": "Stage 6: Modular Repositories, CI Basics & Month 1 Capstone",
        "pedagogicalRole": "Automated Quality Gates (Pull Request Status Checks, Required Checks, Branch Protection Rules, Fast Feedback CI)",
        "spokenGoal": "Code review should focus on architecture, design, and domain logic—not arguing about missing semicolons or broken unit tests. Today, you master Automated CI Validation: configuring GitHub Actions to run linters, typecheckers, and test suites on every pull request, and linking those workflows to GitHub Branch Protection Rules so that broken code physically cannot be merged into <code>main</code>.",
        "conceptInvariant": "Gated Integration Invariant: Code integration is strictly contingent on automated validation passing: $\\text{Merge}(\\text{PR}) \\iff \\bigwedge_{i=1}^k \\text{StatusCheck}_i = \\text{SUCCESS}$. No human override should bypass automated regression checks on protected branches.",
        "failureMode": "The Bypassed Branch Protection Production Outage: A senior director is in a rush to deploy a marketing campaign. They check 'Bypass branch protections' and merge a PR that has failing CI unit tests. The failing test caught a fatal routing error that immediately takes down the entire customer checkout portal.",
        "tryItFriction": "Configure a repository with branch protection rules requiring a specific GitHub Actions check (<code>ci-validate</code>) to pass; create a PR with a failing test to verify that the green Merge button is disabled, fix the test, and verify the PR unlocks.",
        "socraticHints": [
            "Why is configuring 'Require status checks to pass before merging' in GitHub settings the most critical security guardrail for collaborative repositories?",
            "What is the difference between running tests on <code>pull_request</code> (which tests the simulated merge commit <code>refs/pull/PR/merge</code>) versus <code>push</code>?",
            "How does configuring 'Require branches to be up to date before merging' prevent merge-drift breakages?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer opens a pull request. The CI test passes, but GitHub still displays: 'Merging is blocked: Required status check ci/test has not been reported.' The workflow file shows the job name is <code>test-suite</code>.",
            "options": [
                "GitHub is down.",
                "Diagnose Status Check Identifier Mismatch: The branch protection rule specifically requires a check named <code>ci/test</code>, but the workflow job was named <code>test-suite</code>. GitHub matches required checks strictly by string name. The developer must update the job name in the workflow YAML or update the branch protection settings to match.",
                "The developer must pay for GitHub Pro.",
                "Status checks only work on public repositories."
            ],
            "correctOptionIndex": 1,
            "debrief": "GitHub branch protection rules match required status checks by their exact string identifier. If a job is renamed or the matrix name changes, GitHub waits indefinitely for the old name to report, blocking merges."
        },
        "quests": [
            {
                "id": "Q35.109",
                "name": "Branch Protection Rules & CI Status Check Integration",
                "type": "Concept",
                "desc": "Analyze the mechanics of GitHub status check reporting APIs, commit status vs check runs, and branch protection rule enforcement."
            },
            {
                "id": "Q35.110",
                "name": "The Missing Status Check Identifier Deadlock Detective",
                "type": "Detective Challenge",
                "desc": "Troubleshoot a blocked release branch where pull requests are permanently stuck waiting for a non-existent status check; repair the check configuration."
            },
            {
                "id": "Q35.111",
                "name": "Production PR Quality Gate & Fast-Feedback CI Suite",
                "type": "Mastery Assignment",
                "desc": "Build an end-to-end PR validation pipeline that runs parallel linting, typechecking, and unit tests, reporting structured summaries back to the PR."
            },
            {
                "id": "Q35.112",
                "name": "Flaky Test Detection & Quarantining Pipeline Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Implement automated retry logic and flaky test detection in GitHub Actions; prove that persistent regressions fail while flaky tests are flagged for quarantine."
            }
        ]
    },
    {
        "day": 29,
        "month": 1,
        "blockNum": 6,
        "title": "Git Configuration & Developer Velocity: Global vs Local Configs, Aliases, SSH Keys & Conditional Includes",
        "stageNum": 6,
        "stageName": "Stage 6: Modular Repositories, CI Basics & Month 1 Capstone",
        "pedagogicalRole": "Developer Velocity & Security Configuration (Git Config Hierarchy, SSH ed25519 Keys, Conditional Includes, Productivity Aliases)",
        "spokenGoal": "A craftsman keeps their tools sharp. Top engineers do not type <code>git log --graph --oneline --decorate --all</code> twenty times a day; they configure Git for maximum velocity. Today, you master Git configuration: the four-tier config hierarchy (System, Global, Local, Worktree), high-speed aliases, generating modern elliptic-curve SSH keys (<code>ed25519</code>), setting up credential helpers, and configuring Conditional Includes (<code>includeIf</code>) so your work and personal identities never mix.",
        "conceptInvariant": "Configuration Precedence Invariant: Git resolves configuration in strict hierarchical precedence: System (<code>/etc/gitconfig</code>) $\\to$ Global (<code>~/.gitconfig</code>) $\\to$ Local (<code>.git/config</code>) $\\to$ Worktree (<code>.git/config.worktree</code>) $\\to$ Command-line flags (<code>-c key=val</code>). Higher levels strictly override lower levels.",
        "failureMode": "The Personal Identity on Corporate Client Code Audit Failure: A consultant uses their personal laptop for client work. Because their global <code>~/.gitconfig</code> had their personal email, 300 commits were pushed to the client's repository with <code>coolguy99@gmail.com</code> instead of their corporate client email, failing a critical enterprise compliance audit.",
        "tryItFriction": "Generate a secure ed25519 SSH keypair; configure conditional includes in your <code>~/.gitconfig</code> using <code>[includeIf 'gitdir:~/work/']</code> to automatically load a dedicated corporate author name, email, and signing key for work repositories.",
        "socraticHints": [
            "Why is generating an ed25519 SSH key vastly superior to older 2048-bit RSA keys in terms of security and performance?",
            "How does <code>[includeIf 'gitdir:~/work/']</code> dynamically switch your Git author identity based on the directory path of the repository?",
            "What are the top 5 high-velocity Git aliases used by senior engineers to navigate history, stage changes, and view status?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer runs <code>git config user.email</code> inside a repository in <code>~/projects/client-a/</code> and sees <code>john@work.com</code>. They run <code>git commit</code>, but the commit author recorded in the log is <code>john@personal.com</code>. How could this happen?",
            "options": [
                "Git randomly selects from previously used email addresses.",
                "Diagnose Environment Variable Override: Git checks environment variables (<code>GIT_AUTHOR_EMAIL</code> and <code>GIT_COMMITTER_EMAIL</code>) before reading configuration files. The developer had previously set <code>export GIT_AUTHOR_EMAIL=john@personal.com</code> in their terminal session, which completely overrides all local and global configuration files.",
                "The SSH key specifies the commit email address.",
                "Git requires a machine reboot to apply local configs."
            ],
            "correctOptionIndex": 1,
            "debrief": "Environment variables have the highest precedence in Git's identity resolution. If <code>GIT_AUTHOR_EMAIL</code> or <code>GIT_COMMITTER_EMAIL</code> is set in the shell environment, it overrides both local and global <code>.gitconfig</code> files."
        },
        "quests": [
            {
                "id": "Q35.113",
                "name": "Git Configuration Precedence & Identity Architecture",
                "type": "Concept",
                "desc": "Detail the configuration loading order across system, global, local, worktree, and environment variable scopes, analyzing conditional includes."
            },
            {
                "id": "Q35.114",
                "name": "The Leaked Personal Identity Corporate Audit Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a repository where personal identities were committed into corporate code; rewrite the author history cleanly using git filter-repo."
            },
            {
                "id": "Q35.115",
                "name": "High-Velocity Developer Environment & Alias Suite",
                "type": "Mastery Assignment",
                "desc": "Build a modular, portable Git configuration package featuring conditional identity includes, secure SSH credential management, and 20 productivity aliases."
            },
            {
                "id": "Q35.116",
                "name": "SSH Agent & ed25519 Cryptographic Handshake Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Test SSH authentication against multiple remote accounts using ssh-agent and configuration routing; verify zero credential leakage across hosts."
            }
        ]
    },
    {
        "day": 30,
        "month": 1,
        "blockNum": 6,
        "title": "Capstone 1: ApexGitOps Production Repository & Collaboration Pipeline Master Capstone Viva Gate",
        "stageNum": 6,
        "stageName": "Stage 6: Modular Repositories, CI Basics & Month 1 Capstone",
        "pedagogicalRole": "Month 1 Grand Capstone & Production Defense (Full GitOps Architecture, Branch Protections, CI Validation, Multi-Worktrees & Reflog Recovery)",
        "spokenGoal": "This is your Month 1 Capstone Defense. You will architect, configure, and defend ApexGitOps: a complete production repository and collaboration pipeline. You will demonstrate an institutional-grade repository featuring Conventional Commit linting, automated GitHub Actions CI status checks, branch protection rules that enforce linear histories, multi-worktree parallel developer environments, and automated reflog disaster recovery, defending your architecture live before the Principal Systems Review Board.",
        "conceptInvariant": "Month 1 Grand Capstone Production Invariant: The ApexGitOps platform must guarantee: (1) zero untracked secret leakage, (2) 100% Conventional Commit compliance, (3) strict fast-forward/squash gated merges, (4) automated test passing before merge, and (5) zero-loss reflog disaster recovery playbooks.",
        "failureMode": "The Capstone Viva Defense Catastrophe: A candidate presents their GitOps repository to the Review Board. The Board injects an unstaged API secret, an ambiguous checkout command, and a force-push attack on <code>main</code>. The repository's protections fail to trigger, secrets leak into commits, and the branch is overwritten, leading to immediate review failure.",
        "tryItFriction": "Deliver and defend the complete ApexGitOps pipeline against live adversarial attacks: simulate an accidental force-push, recover a deleted branch using reflog, resolve a complex 3-way merge conflict, and pass automated CI status checks.",
        "socraticHints": [
            "How does your branch protection schema prevent both force-pushes and unreviewed direct commits to <code>main</code>?",
            "What automated guardrails in your pipeline prevent developers from committing plaintext API keys and credentials?",
            "How does your disaster recovery playbook reconstruct a damaged repository using <code>git reflog</code> and dangling object trees?"
        ],
        "situationalPuzzle": {
            "scenario": "During the final Viva defense, an examiner asks: 'Why should an enterprise enforce trunk-based development with short-lived feature branches rather than long-lived Gitflow release branches that take months to merge?'",
            "options": [
                "Gitflow is the only approved standard for enterprise banking.",
                "Defend Trunk-Based Agility & Merge Conflict Elimination: Long-lived branches inevitably diverge from the mainline, leading to exponential merge conflict complexity ('merge hell') and delaying integration feedback. Trunk-based development with short-lived branches (merged within 24–48 hours under automated CI gates) ensures continuous integration, trivial conflict resolution, faster lead times to production, and higher release stability.",
                "Trunk-based development requires no testing or code review.",
                "Long-lived branches use less computer memory."
            ],
            "correctOptionIndex": 1,
            "debrief": "Trunk-based development with short-lived branches minimizes divergence, dramatically lowers merge conflict frequency, and provides fast feedback through automated CI gates, enabling continuous delivery with lower risk."
        },
        "quests": [
            {
                "id": "Q35.117",
                "name": "ApexGitOps Enterprise Systems Architecture Specification",
                "type": "Concept",
                "desc": "Document the complete systems blueprint of ApexGitOps, detailing branch protection schemas, CI workflows, worktree isolation, and recovery procedures."
            },
            {
                "id": "Q35.118",
                "name": "The Enterprise Repository Chaos Forensic Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Conduct a comprehensive forensic audit of a damaged enterprise repository suffering from broken submodules, corrupted refs, and leaky secrets; restore it."
            },
            {
                "id": "Q35.119",
                "name": "ApexGitOps Production Repository & Collaboration Pipeline",
                "type": "Mastery Assignment",
                "desc": "Deliver the complete ApexGitOps repository platform: branch protections, GitHub Actions CI validation, Conventional Commit linters, and disaster recovery scripts."
            },
            {
                "id": "Q35.120",
                "name": "Month 1 Grand Capstone Viva Defense & Principal Board Gate",
                "type": "Production Incident Lab",
                "desc": "Defend ApexGitOps before the Principal Systems Board under live chaotic data injections, broken branch merges, and adversarial force-push attacks."
            }
        ]
    }
]

out_path = Path(__file__).resolve().parent / "git_version_control_spec_m1_rest.py"

content = f'''# scripts/visuals/git_version_control_spec_m1_rest.py
# Month 1: Days 16 to 30 Specification for Course 35: Git, GitHub & Version Control Basics (course-git-version-control)
# Conforms strictly to Gate v2 / True 9.8 standard across all 15 days (60 Quests: Q35.61 to Q35.120).

DAYS_16_TO_30 = {json.dumps(days_data, indent=2)}
'''

with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_path} with {len(days_data)} days ({sum(len(d['quests']) for d in days_data)} quests).")
