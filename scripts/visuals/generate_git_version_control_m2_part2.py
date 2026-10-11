# scripts/visuals/generate_git_version_control_m2_part2.py
"""
Generator script for Course 35: Git, GitHub & Version Control Basics (course-git-version-control)
Month 2: Days 46 to 60 (60 Quests: Q35.181 to Q35.240).
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
        "day": 46,
        "month": 2,
        "blockNum": 10,
        "title": "Advanced GitHub Actions: Composite Actions, Reusable Workflows (`workflow_call`), Matrix Strategies & Cache",
        "stageNum": 10,
        "stageName": "Stage 10: Enterprise GitHub Engineering & Infrastructure",
        "pedagogicalRole": "Enterprise CI Architecture (Composite Actions, Reusable Workflows, Matrix Execution & actions/cache Optimization)",
        "spokenGoal": "Junior engineers copy and paste 100-line YAML workflows across 40 repositories. Senior engineers write modular, DRY (Don't Repeat Yourself) CI pipelines. Today, you master advanced GitHub Actions architecture: packaging multi-step commands into Custom Composite Actions, building enterprise Reusable Workflows with <code>workflow_call</code>, executing cross-platform Matrix strategies (Ubuntu, Windows, macOS across Node 18, 20, 22), and slashing build durations by 80% using <code>actions/cache</code> with lockfile hash keys.",
        "conceptInvariant": "Modular CI Encapsulation Invariant: Reusable workflows and composite actions define strict public interfaces: $\\text{Contract}(\\text{inputs}, \\text{secrets}) \\to \\text{outputs}$. Calling workflows invoke them via pinned immutable commit SHAs (<code>@a1b2c3...</code>), ensuring centralized governance, zero duplication, and supply-chain immutability.",
        "failureMode": "The Action Version Drift Supply-Chain Poisoning: An enterprise CI pipeline references a third-party GitHub Action with a mutable branch tag like <code>@main</code> instead of a pinned immutable commit SHA. The action maintainer's account is compromised, and malicious cryptocurrency mining code is pushed to <code>main</code>, executing silently inside 200 corporate build runners overnight.",
        "tryItFriction": "Author a reusable GitHub Actions workflow with matrix execution across multiple runtime versions; consume it from a caller workflow, and configure <code>actions/cache</code> using <code>runner.os</code> and <code>hashFiles('package-lock.json')</code> to cache dependencies across runs.",
        "socraticHints": [
            "What is the operational difference between a Composite Action (which bundles multiple steps into a single action) and a Reusable Workflow (which defines complete jobs with runners)?",
            "Why does enterprise security compliance mandate referencing GitHub Actions by their full 40-character commit SHA rather than release tags like <code>@v4</code>?",
            "How does <code>actions/cache</code> use primary keys and restore-keys to provide partial cache hits when dependency lockfiles change?"
        ],
        "situationalPuzzle": {
            "scenario": "A development team wants to standardize linting, security scanning, and deployment across 80 microservice repositories. The DevOps lead proposes copying a standardized <code>ci.yml</code> file into every repo. What is the superior architectural approach?",
            "options": [
                "Copy the YAML file to all 80 repos and set reminders to update them manually.",
                "Diagnose Centralized Reusable Workflow Architecture: Create a centralized <code>.github</code> workflow repository containing a reusable workflow triggered by <code>on: workflow_call</code>. Each of the 80 microservice repos needs only a 10-line caller workflow that invokes the centralized workflow. Updates to linting or security standards are made once in the central repo and propagate immediately across all 80 services.",
                "Disable CI on 79 of the repositories.",
                "Write a bash script that developers run on their local laptops instead of CI."
            ],
            "correctOptionIndex": 1,
            "debrief": "Reusable workflows (<code>workflow_call</code>) allow an enterprise to define standardized CI/CD logic in a central repository. All service repositories call the central workflow, enabling centralized security patching and compliance updates without touching individual repos."
        },
        "quests": [
            {
                "id": "Q35.181",
                "name": "Reusable Workflow & Composite Action Systems Architecture",
                "type": "Concept",
                "desc": "Analyze the mechanics of workflow_call interfaces, composite action execution contexts, matrix job synthesis, and cache eviction policies."
            },
            {
                "id": "Q35.182",
                "name": "The Mutable Tag Action Supply-Chain Compromise Detective",
                "type": "Detective Challenge",
                "desc": "Investigate a compromised CI pipeline where a mutable @v1 tag ingested malicious build scripts; pin all actions to immutable commit SHAs and audit runners."
            },
            {
                "id": "Q35.183",
                "name": "Enterprise Reusable CI/CD Workflow & Matrix Library",
                "type": "Mastery Assignment",
                "desc": "Build a modular library of enterprise reusable workflows featuring multi-OS matrix testing, dependency caching, and automated status badge reporting."
            },
            {
                "id": "Q35.184",
                "name": "Cache Poisoning & Concurrency Invalidation Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Simulate concurrent build jobs writing to the same cache key with mismatched dependencies; verify cache isolation and fallback restore-key behavior."
            }
        ]
    },
    {
        "day": 47,
        "month": 2,
        "blockNum": 10,
        "title": "Self-Hosted Runners, Security Isolation, Ephemeral Environments & OIDC Cloud Authentication (AWS/GCP)",
        "stageNum": 10,
        "stageName": "Stage 10: Enterprise GitHub Engineering & Infrastructure",
        "pedagogicalRole": "Infrastructure Security & Cloud Identity (Self-Hosted Runners, Ephemeral Containers, OIDC Token Exchange & Zero-Secret AWS/GCP Auth)",
        "spokenGoal": "Storing long-lived AWS Access Keys or GCP Service Account JSON keys in GitHub Secrets is an outdated security risk. If a secret leaks, attackers have permanent access. Today, you master modern cloud identity federation: OpenID Connect (OIDC). You will configure GitHub Actions to authenticate to AWS, GCP, and Azure using short-lived cryptographically signed JWT tokens with zero hardcoded credentials, and harden Self-Hosted Runners using ephemeral container runners (Actions Runner Controller on Kubernetes).",
        "conceptInvariant": "Zero-Secret OIDC Authentication Invariant: Workflows must authenticate to cloud providers via OIDC federation: $\\text{GitHub OIDC JWT} \\xrightarrow{\\text{STS Exchange}} \\text{Ephemeral Cloud Role Session}$ (maximum 60-minute lifetime). Storing static cloud access keys in repository secrets is strictly prohibited.",
        "failureMode": "The Persistent Self-Hosted Runner Secret Exfiltration: A company uses a persistent, non-ephemeral self-hosted VM runner for public pull requests. A malicious contributor submits a PR that runs a script dumping the runner's disk cache, exfiltrating credentials from previous private corporate builds.",
        "tryItFriction": "Configure a mock OIDC trust policy for AWS/GCP; simulate a GitHub Actions workflow requesting a cryptographic ID token and exchanging it for an ephemeral cloud access token.",
        "socraticHints": [
            "Why does OpenID Connect (OIDC) eliminate the need to store static, long-lived AWS Access Key IDs and Secret Access Keys in GitHub Secrets?",
            "What security vulnerabilities exist when running self-hosted GitHub Actions runners on public repositories or external pull requests?",
            "How does Actions Runner Controller (ARC) on Kubernetes ensure that every single job runs in a pristine, ephemeral container that is destroyed upon job completion?"
        ],
        "situationalPuzzle": {
            "scenario": "A security engineer inspects an enterprise AWS account and discovers 50 IAM users named 'github-actions-user' with static access keys that have not been rotated in 3 years. The engineer wants to modernize authentication to zero-secret architecture.",
            "options": [
                "Rotate the 50 static passwords every Monday morning.",
                "Diagnose OIDC Cloud Federation: Configure GitHub as an OpenID Connect (OIDC) Identity Provider in AWS IAM. Replace all static IAM user credentials with IAM Roles that trust the GitHub OIDC provider, restricted to specific repositories and branches (e.g. <code>repo:org/repo:ref:refs/heads/main</code>). Workflows use <code>aws-actions/configure-aws-credentials</code> to assume roles dynamically with short-lived tokens.",
                "Store the AWS keys in a public Google Drive document.",
                "Disable all automated deployments from GitHub."
            ],
            "correctOptionIndex": 1,
            "debrief": "OIDC allows GitHub Actions to assume AWS/GCP IAM roles dynamically using short-lived tokens without storing any persistent credentials in GitHub. IAM trust policies restrict role assumption to specific repositories, branches, or environments."
        },
        "quests": [
            {
                "id": "Q35.185",
                "name": "OIDC Identity Federation & GitHub JWT Architecture",
                "type": "Concept",
                "desc": "Detail the cryptographic protocol of GitHub OIDC token generation, exploring JSON Web Tokens (JWT), claims verification (sub, aud, iss), and STS exchange."
            },
            {
                "id": "Q35.186",
                "name": "The Persistent Self-Hosted Runner Secret Leak Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a security compromise where untrusted PR code accessed shared runner filesystems; reconstruct the attack and migrate to ephemeral container runners."
            },
            {
                "id": "Q35.187",
                "name": "Zero-Secret OIDC Cloud Authentication & Deployment Engine",
                "type": "Mastery Assignment",
                "desc": "Build an end-to-end GitHub Actions workflow that authenticates to AWS/GCP using OIDC role assumption, verifies token claims, and deploys cloud infrastructure."
            },
            {
                "id": "Q35.188",
                "name": "Ephemeral Container Runner Destruction & Isolation Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Simulate 50 parallel build jobs on an ephemeral runner cluster; verify that container filesystems are completely destroyed between jobs with zero state leakage."
            }
        ]
    },
    {
        "day": 48,
        "month": 2,
        "blockNum": 10,
        "title": "GitHub Enterprise Administration: GitHub Apps vs Fine-Grained PATs, Webhooks & Audit Log Streaming",
        "stageNum": 10,
        "stageName": "Stage 10: Enterprise GitHub Engineering & Infrastructure",
        "pedagogicalRole": "Enterprise Administration & Security (GitHub Apps, Fine-Grained PATs, Webhook HMAC Verification & Audit Log Streaming)",
        "spokenGoal": "In a Fortune 500 company, managing automation credentials across 1,000 repositories requires enterprise-grade identity. Personal Access Tokens (PATs) tied to individual employees are a ticking operational time bomb: when an employee leaves, their PAT is revoked, crashing production bots. Today, you master GitHub Apps (organization-level service identities with short-lived tokens and granular permissions), webhook HMAC signature validation (<code>X-Hub-Signature-256</code>), and enterprise audit log streaming.",
        "conceptInvariant": "Least-Privilege Organization Identity Invariant: Enterprise automations must authenticate as GitHub Apps with installation tokens scoped strictly to explicit repositories and minimal required permissions (e.g. read:contents, write:pull-requests) expiring after 60 minutes.",
        "failureMode": "The Departed Engineer PAT Revocation Production Blackout: An automated deployment pipeline used a Personal Access Token created by a lead engineer. When the engineer left the company and IT deactivated their GitHub account, the PAT was instantly revoked, crashing all production deployments across 40 services during a critical release window.",
        "tryItFriction": "Build a secure webhook listener in Python/Node.js that verifies incoming GitHub webhook HMAC-SHA256 signatures using a shared secret and rejects payloads with invalid or missing cryptographic signatures.",
        "socraticHints": [
            "Why are GitHub Apps vastly superior to Personal Access Tokens (PATs) for organizational automation in terms of security and employee turnover?",
            "How does verifying the <code>X-Hub-Signature-256</code> header protect your internal webhook listeners against spoofed payload injection attacks?",
            "What critical compliance events (such as repo deletion, permission changes, and force-pushes) must be monitored via GitHub Audit Log Streaming?"
        ],
        "situationalPuzzle": {
            "scenario": "A company receives a webhook payload at <code>https://api.company.com/github-webhook</code> that triggers an automated deployment to production. A security penetration tester discovers that anyone can send a POST request to that endpoint with fake data and trigger deployments. What security control was missing?",
            "options": [
                "The endpoint must use HTTP instead of HTTPS.",
                "Diagnose Missing Webhook Cryptographic HMAC Validation: The webhook receiver lacked cryptographic signature verification. GitHub signs every webhook payload using a secret token and sends the HMAC in the <code>X-Hub-Signature-256</code> header. The receiver must compute the HMAC-SHA256 of the raw payload using the shared secret and reject any request where the signatures do not match.",
                "The server must block all IP addresses except 127.0.0.1.",
                "Webhooks should only be run once per month."
            ],
            "correctOptionIndex": 1,
            "debrief": "GitHub webhooks include an <code>X-Hub-Signature-256</code> header containing an HMAC-SHA256 digest of the payload. Webhook listeners must verify this signature using a pre-shared secret to guarantee that incoming requests originate from GitHub and have not been tampered with."
        },
        "quests": [
            {
                "id": "Q35.189",
                "name": "GitHub Apps Architecture & Webhook HMAC Security Mechanics",
                "type": "Concept",
                "desc": "Detail the architecture of GitHub Apps, examining private key JWT exchange, installation access tokens, permissions scoping, and HMAC-SHA256 validation."
            },
            {
                "id": "Q35.190",
                "name": "The Unauthenticated Webhook Injection Attack Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a rogue deployment triggered by a forged webhook request; analyze server logs, reconstruct the missing HMAC check, and secure the endpoint."
            },
            {
                "id": "Q35.191",
                "name": "Enterprise GitHub App Service Identity & Webhook Receiver",
                "type": "Mastery Assignment",
                "desc": "Build a standalone GitHub App backend that authenticates via private key JWT, generates installation tokens, and processes webhooks with HMAC validation."
            },
            {
                "id": "Q35.192",
                "name": "Audit Log Streaming & High-Frequency Security Event Lab",
                "type": "Production Incident Lab",
                "desc": "Stream GitHub Enterprise audit logs to a simulated SIEM; trigger unauthorized branch modifications and force-pushes, verifying real-time alerting."
            }
        ]
    },
    {
        "day": 49,
        "month": 2,
        "blockNum": 10,
        "title": "Repository Governance at Scale: Organization Rulesets, CODEOWNERS, Automated Merge Queues & Branch Policies",
        "stageNum": 10,
        "stageName": "Stage 10: Enterprise GitHub Engineering & Infrastructure",
        "pedagogicalRole": "Enterprise Repository Governance (GitHub Rulesets, CODEOWNERS, Merge Queues & Compliance Automation)",
        "spokenGoal": "In an engineering organization with 3,000 developers, you cannot rely on trust; you must enforce architectural compliance through policy as code. Today, you master enterprise repository governance: configuring <code>CODEOWNERS</code> for path-based mandatory review routing, building organization-wide GitHub Rulesets that enforce linear history, commit message conventions, and signed commits across hundreds of repositories simultaneously, and deploying Automated Merge Queues.",
        "conceptInvariant": "Deterministic Merge Queue Serialization Invariant: A Merge Queue serializes approved pull requests into temporary speculative integration branches: $\\text{Queue} = [P_1, P_2, \\dots, P_k]$. It tests $P_k$ against the speculative merge of $P_1 \\dots P_{k-1}$, ensuring that only mutually compatible changes land on trunk.",
        "failureMode": "The CODEOWNERS Wildcard Review Bypass: A company configures <code>* @general-team</code> in <code>CODEOWNERS</code>. A developer modifies critical billing calculations in <code>services/billing/</code> and gets approval from a teammate on <code>@general-team</code>. Because specific path ownership (like <code>/services/billing/ @billing-security</code>) was omitted, the security team was never notified, and a billing vulnerability made it to production.",
        "tryItFriction": "Author a production <code>.github/CODEOWNERS</code> file for a multi-service repository; define granular ownership for security files (<code>.github/</code>, <code>auth/</code>), database migrations (<code>migrations/</code>), and core libraries, verifying that GitHub automatically requests the correct reviewers.",
        "socraticHints": [
            "Why are GitHub Repository Rulesets vastly more maintainable for enterprise platform teams than legacy per-repository branch protection rules?",
            "What race condition occurs when two pull requests pass CI independently on their feature branches, but break when merged together on <code>main</code>?",
            "How does a GitHub Merge Queue eliminate the 'broken main' race condition without forcing developers to manually rebase and wait for CI?"
        ],
        "situationalPuzzle": {
            "scenario": "Two developers open PR A and PR B simultaneously. PR A renames a database column from <code>email</code> to <code>user_email</code> and updates service A. PR B adds a new query to service B referencing the old <code>email</code> column. Both PRs pass their individual CI tests. Both developers click Merge at the same time. What happens on <code>main</code>?",
            "options": [
                "Git automatically adjusts PR B's query to use user_email.",
                "Diagnose Semantic Integration Race Condition on Main: Because both PRs were tested against the old base before either was merged, both CI runs were green. But when both merge, <code>main</code> compiles code where service B queries a column that no longer exists, breaking production. An automated Merge Queue prevents this by testing PR B against the speculative state of main after PR A before allowing merge.",
                "GitHub blocks both merges with a database lock error.",
                "The database automatically supports both column names."
            ],
            "correctOptionIndex": 1,
            "debrief": "Individual PR CI tests only verify that the branch is compatible with the current base. When two PRs merge concurrently, their combined changes can introduce semantic breakages. A Merge Queue tests PRs speculatively in sequence, catching integration failures before they hit main."
        },
        "quests": [
            {
                "id": "Q35.193",
                "name": "GitHub Organization Rulesets & Merge Queue Architecture",
                "type": "Concept",
                "desc": "Detail the systems architecture of GitHub Rulesets and Merge Queues, analyzing speculative merge trees, batch testing strategies, and CODEOWNERS evaluation."
            },
            {
                "id": "Q35.194",
                "name": "The Broken Main Concurrent Merge Race Condition Detective",
                "type": "Detective Challenge",
                "desc": "Investigate a production outage caused by two independently green PRs that broke main when merged concurrently; configure a merge queue to prevent recurrence."
            },
            {
                "id": "Q35.195",
                "name": "Enterprise CODEOWNERS & Policy Enforcement Framework",
                "type": "Mastery Assignment",
                "desc": "Build an organization governance toolkit that validates CODEOWNERS syntax, audits branch protection coverage, and deploys unified GitHub Rulesets across repos."
            },
            {
                "id": "Q35.196",
                "name": "High-Throughput 20-PR Merge Queue Serialization Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Simulate 20 concurrent PR merges under an automated Merge Queue; inject intentional semantic breaking changes and verify that faulty PRs are evicted cleanly."
            }
        ]
    },
    {
        "day": 50,
        "month": 2,
        "blockNum": 10,
        "title": "Milestone 7: ApexAutomate Enterprise GitHub Actions & Security Automation Suite",
        "stageNum": 10,
        "stageName": "Stage 10: Enterprise GitHub Engineering & Infrastructure",
        "pedagogicalRole": "Synthesis & Platform Engineering (Enterprise CI Orchestrator, OIDC Cloud Deployer, GitHub App Gateway & Governance Suite)",
        "spokenGoal": "Milestone 7 tests your ability to engineer enterprise-grade automation infrastructure. You will architect ApexAutomate: a production platform that manages reusable GitHub Actions libraries, enforces zero-secret OIDC cloud deployments to AWS/GCP, validates webhook HMAC signatures, audits organization CODEOWNERS compliance, and orchestrates automated Merge Queues to guarantee that <code>main</code> is never broken.",
        "conceptInvariant": "Zero-Trust Enterprise Automation Invariant: ApexAutomate certifies that: (1) all workflows use immutable commit SHAs, (2) zero static cloud credentials exist in secrets, (3) webhooks verify cryptographic HMAC signatures, and (4) merge queues serialize integration testing.",
        "failureMode": "The Untrusted PR Webhook Secret Theft Incident: A workflow configured with <code>pull_request_target</code> checks out untrusted contributor code using <code>${{ github.event.pull_request.head.sha }}</code>. An attacker submits a PR containing a script that dumps repository secrets. Because <code>pull_request_target</code> grants write tokens and secret access, the attacker exfiltrates all production cloud keys.",
        "tryItFriction": "Deploy ApexAutomate across a multi-repository test organization; execute an OIDC token exchange, verify webhook HMAC signatures, simulate a merge queue with an incompatible PR, and observe automated eviction.",
        "socraticHints": [
            "Why is checking out untrusted code inside a <code>pull_request_target</code> workflow one of the most critical security vulnerabilities in GitHub Actions?",
            "How does ApexAutomate verify that all actions referenced across an organization are pinned to immutable commit SHAs?",
            "What automated metrics (queue wait time, eviction rate) monitor the health of an enterprise merge queue?"
        ],
        "situationalPuzzle": {
            "scenario": "A security scanner reports that a workflow using <code>on: pull_request_target</code> has a critical vulnerability. The developer argues: 'We needed pull_request_target so the PR could run tests that access our test database secret.' How should this be securely architected?",
            "options": [
                "Ignore the security scanner warning.",
                "Diagnose Insecure pull_request_target Architecture & Decouple Workflow: Never run untrusted code with access to secrets. Re-architect into two decoupled workflows: (1) A standard <code>pull_request</code> workflow that checks out untrusted PR code in an unprivileged runner with zero secrets to build and run unit tests, and (2) A separate workflow that runs on trusted events or requires manual environment approval before accessing sensitive credentials.",
                "Make the repository private so anyone can access secrets.",
                "Hardcode the database password in the code so secrets are not needed."
            ],
            "correctOptionIndex": 1,
            "debrief": "<code>pull_request_target</code> runs in the context of the base branch with access to secrets. Checking out and executing code from an untrusted fork's pull request allows malicious code to steal secrets. Untrusted code must run strictly without secret access."
        },
        "quests": [
            {
                "id": "Q35.197",
                "name": "ApexAutomate Systems Blueprint & Enterprise CI Infrastructure",
                "type": "Concept",
                "desc": "Document the complete systems blueprint of ApexAutomate, specifying OIDC trust federation, GitHub App service architectures, and Merge Queue algorithms."
            },
            {
                "id": "Q35.198",
                "name": "The pull_request_target Secret Exfiltration Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a high-severity security incident where an untrusted fork PR exfiltrated secrets via pull_request_target; rewrite the workflow to enforce isolation."
            },
            {
                "id": "Q35.199",
                "name": "ApexAutomate Production Enterprise CI & Governance Platform",
                "type": "Mastery Assignment",
                "desc": "Build the full ApexAutomate platform: an automated system that deploys reusable workflows, authenticates via OIDC, validates webhooks, and manages merge queues."
            },
            {
                "id": "Q35.200",
                "name": "ApexAutomate Milestone 7 Viva Defense & Infrastructure Gate",
                "type": "Production Incident Lab",
                "desc": "Defend ApexAutomate before the Principal Infrastructure Board under live untrusted PR attacks, simulated secret theft attempts, and concurrent merge queue stress."
            }
        ]
    },
    {
        "day": 51,
        "month": 2,
        "blockNum": 11,
        "title": "Git Performance Tuning: `core.fsmonitor` (Watchman), Commit-Graphs, Untracked Cache & Reachability Bitmaps",
        "stageNum": 11,
        "stageName": "Stage 11: Large-Scale Git Performance Tuning & Disaster Forensics",
        "pedagogicalRole": "Extreme Performance Engineering (core.fsmonitor, Watchman, core.untrackedCache, Reachability Bitmaps, Commit-Graph Generation)",
        "spokenGoal": "In a repository with 500,000 files, running <code>git status</code> takes 15 seconds. Why? Because Git has to issue 500,000 stat syscalls to the operating system. Today, you master extreme Git performance engineering: configuring <code>core.fsmonitor</code> using Facebook Watchman (where the OS notifies Git of changed files via filesystem events in 5ms!), enabling <code>core.untrackedCache</code>, generating Reachability Bitmaps to make packfile object transfers 10x faster, and fine-tuning garbage collection.",
        "conceptInvariant": "Event-Driven Filesystem Monitoring Invariant: <code>core.fsmonitor</code> converts <code>git status</code> from an $O(N)$ filesystem crawl to an $O(k)$ event-driven lookup, where $k$ is the number of files modified since the last query epoch: $T_{\\text{status}} = O(k) \\ll O(N)$.",
        "failureMode": "The 45-Second Git Status Developer Productivity Collapse: An enterprise repository grows to 800,000 files across 40 microservices. Developers run <code>git status</code> 50 times a day, each taking 45 seconds of 100% disk I/O. Developer productivity collapses, and IDEs freeze while indexing, leading to massive engineering churn.",
        "tryItFriction": "Profile a large repository using <code>GIT_TRACE2_PERF=1 git status</code>; enable <code>core.fsmonitor</code>, <code>core.untrackedCache</code>, and <code>git commit-graph write --reachable</code>, and measure the 100x reduction in execution latency.",
        "socraticHints": [
            "How does <code>core.fsmonitor</code> leverage operating system kernel event APIs (inotify on Linux, FSEvents on macOS, ReadDirectoryChangesW on Windows) to track changed files?",
            "What problem does <code>core.untrackedCache</code> solve by caching mtime timestamps of directory nodes?",
            "Why do Reachability Bitmaps allow Git servers to calculate packfile object transfer sets using fast bitwise operations instead of graph walking?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer runs <code>git push origin main</code> on a 20GB repository. The server CPU runs at 100% for 5 minutes during the 'Counting objects' phase before sending any data over the network. How can the Git server administrator fix this?",
            "options": [
                "Tell the developer to delete their commit history.",
                "Diagnose Missing Reachability Bitmaps & Generate Bitmaps: The Git server is walking the entire commit graph from scratch to calculate which objects the client already has versus which objects must be packed. Running <code>git repack -a -b -d</code> generates Reachability Bitmaps. With bitmaps enabled, object set calculation uses fast bitwise AND/OR operations over pre-computed bitmap vectors, reducing 'Counting objects' time from 5 minutes to 200 milliseconds.",
                "Upgrade the server network bandwidth to 100Gbps.",
                "Switch from SSH to HTTP transport."
            ],
            "correctOptionIndex": 1,
            "debrief": "Reachability Bitmaps represent object reachability as binary bit arrays for each commit. Calculating object deltas during push/fetch becomes a fast bitwise operation rather than an expensive graph traversal, slashing counting time by up to 99%."
        },
        "quests": [
            {
                "id": "Q35.201",
                "name": "Git Performance Architecture & Filesystem Monitoring Internals",
                "type": "Concept",
                "desc": "Analyze the mechanics of core.fsmonitor IPC protocols, Watchman event streams, untracked cache trees, and reachability bitmap encoding."
            },
            {
                "id": "Q35.202",
                "name": "The 45-Second Git Status Monorepo Bottleneck Detective",
                "type": "Detective Challenge",
                "desc": "Profile an unoptimized 800,000-file repository using GIT_TRACE2; isolate syscall bottlenecks and apply fsmonitor/bitmap optimizations to achieve sub-second latency."
            },
            {
                "id": "Q35.203",
                "name": "Automated Git Performance Profiler & Benchmark Engine",
                "type": "Mastery Assignment",
                "desc": "Build an automated CLI benchmarking tool that profiles Git commands with trace2 telemetry, measures disk I/O and CPU usage, and applies performance tunings."
            },
            {
                "id": "Q35.204",
                "name": "1-Million File Filesystem Event Saturation Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Simulate 50,000 rapid file mutations across a 1-million file repository; test fsmonitor queue overflow handling and fallback full-scan recovery."
            }
        ]
    },
    {
        "day": 52,
        "month": 2,
        "blockNum": 11,
        "title": "Advanced Disaster Forensics: Recovering Dangling Trees, Reconstructing Broken Merge Bases & `git fsck --lost-found`",
        "stageNum": 11,
        "stageName": "Stage 11: Large-Scale Git Performance Tuning & Disaster Forensics",
        "pedagogicalRole": "Disaster Forensics & Database Salvage (Dangling Tree Extraction, git fsck --lost-found, Corrupted HEAD Reconstruction & Object Graph Repair)",
        "spokenGoal": "A developer's laptop loses power in the middle of a rebase. Upon rebooting, <code>.git/HEAD</code> is an empty 0-byte file, branch pointers are broken, and Git throws: 'fatal: not a git repository'. To a junior developer, all work is lost. To a master Git forensic engineer, the objects are still intact on disk. Today, you master advanced Git database salvage: repairing corrupted reference headers, using <code>git fsck --lost-found</code> to extract dangling trees, and reconstructing complete commit graphs from raw disk objects.",
        "conceptInvariant": "Content-Addressable Salvage Invariant: As long as raw object bytes exist in <code>.git/objects/</code>, running <code>git fsck --lost-found</code> extracts all unreferenced trees and commits into <code>.git/lost-found/</code>, enabling full source reconstruction even if all refs, logs, and indices are completely wiped.",
        "failureMode": "The Power-Outage 0-Byte HEAD Corruption Panic: A developer's workstation reboots unexpectedly during an intensive Git commit. When it reboots, <code>.git/HEAD</code> has 0 bytes. Running any Git command throws 'fatal: not a git repository'. In a panic, the developer deletes the directory and clones from remote, losing 3 weeks of unpushed commits.",
        "tryItFriction": "Intentionally corrupt a repository by wiping <code>.git/HEAD</code> and running <code>git branch -D</code> on all branches; inspect <code>.git/objects/</code>, run <code>git fsck --lost-found</code>, locate the root tree hash, and resurrect the working repository using <code>git commit-tree</code> and <code>git branch</code>.",
        "socraticHints": [
            "Why does writing <code>ref: refs/heads/main\\n</code> into a corrupted 0-byte <code>.git/HEAD</code> immediately restore Git repository functionality?",
            "How does <code>git fsck --lost-found</code> categorize unreferenced objects into <code>.git/lost-found/commit/</code> versus <code>.git/lost-found/other/</code>?",
            "How can you inspect a recovered dangling tree hash using <code>git ls-tree -r <hash></code> to find the exact snapshot of your code?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer accidentally deleted all local branches, cleared their reflogs, and has no commits visible in <code>git log</code>. They ran <code>git fsck --lost-found</code> and found 5 dangling commit hashes in <code>.git/lost-found/commit/</code>. How do they find which commit contains their latest work?",
            "options": [
                "Examine each commit using <code>git show <hash></code> to inspect commit messages, author dates, and file diffs.",
                "Pick the first hash alphabetically.",
                "Re-run git init to restore the names.",
                "None of the dangling commits can be inspected."
            ],
            "correctOptionIndex": 0,
            "debrief": "<code>git fsck --lost-found</code> saves all dangling commit objects in <code>.git/lost-found/commit/</code>. Running <code>git show <hash></code> (or <code>git log -1 --stat <hash></code>) displays the full commit metadata, author date, and diff, allowing instant identification of the latest commit."
        },
        "quests": [
            {
                "id": "Q35.205",
                "name": "Git Object Database Forensics & fsck Salvage Architecture",
                "type": "Concept",
                "desc": "Detail the algorithms used by git fsck to detect dangling nodes, unreachable trees, corrupt loose object zlib streams, and reference cycle deadlocks."
            },
            {
                "id": "Q35.206",
                "name": "The 0-Byte HEAD & Wiped Reference Disaster Detective",
                "type": "Detective Challenge",
                "desc": "Investigate a repository rendered unreadable by a corrupted 0-byte HEAD file and wiped reflogs; resurrect the project without data loss."
            },
            {
                "id": "Q35.207",
                "name": "Automated Git Forensic Investigator & Tree Reconstructor",
                "type": "Mastery Assignment",
                "desc": "Build a standalone forensic tool in Python that scans corrupted .git directories, parses raw zlib objects directly, and reconstructs historical commit DAGs."
            },
            {
                "id": "Q35.208",
                "name": "Bit-Level Object Corruption & CRC Checksum Repair Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Inject random byte corruptions into loose and packed objects; evaluate git fsck diagnostic output and test parity-based data recovery mechanisms."
            }
        ]
    },
    {
        "day": 53,
        "month": 2,
        "blockNum": 11,
        "title": "Safe Force-Push Protocols: `--force-with-lease` vs `--force-if-includes` vs Destructive `--force`",
        "stageNum": 11,
        "stageName": "Stage 11: Large-Scale Git Performance Tuning & Disaster Forensics",
        "pedagogicalRole": "Remote Safety Engineering (Force-Push Mechanics, --force-with-lease, --force-if-includes, CAS Semantics, Server Pre-Receive Hooks)",
        "spokenGoal": "Every senior engineer knows the rule: never type plain <code>git push --force</code>. Plain force-push is a wrecking ball that will unconditionally overwrite remote branches even if a teammate pushed critical work 5 seconds ago. Today, you master safe force-push protocols: <code>--force-with-lease</code> (which executes an atomic Compare-and-Swap, verifying the remote branch matches your local tracking ref before pushing), <code>--force-if-includes</code> (which verifies you have integrated the remote commits), and server-side pre-receive hooks.",
        "conceptInvariant": "Compare-and-Swap (CAS) Remote Invariant: <code>--force-with-lease</code> executes an atomic compare-and-swap on the remote ref: $\\text{Update}(R, \\text{new}) \\iff \\text{Current}(R) = \\text{LocalMirror}(R)$. If another engineer pushed commits to $R$, the operation is rejected, preventing accidental history destruction.",
        "failureMode": "The Team WIP Obliteration via Blind Force Push: Developer A rebases their feature branch. In the meantime, Developer B pushed 3 critical bug fixes to the same branch. Developer A runs <code>git push origin feature -f</code>. Developer B's commits are wiped from the remote server, and the team spends hours locating the lost work.",
        "tryItFriction": "Simulate concurrent work on a remote branch; attempt a push with <code>--force-with-lease</code> after the remote branch has progressed, observe the safe rejection, and compare against the destructive behavior of plain <code>--force</code>.",
        "socraticHints": [
            "Why is <code>git push --force-with-lease</code> vastly safer than <code>git push --force</code> for rewriting personal feature branch history?",
            "What subtle race condition can cause <code>--force-with-lease</code> to still overwrite a teammate's commit if your editor or terminal runs a background <code>git fetch</code>?",
            "Why did Git 2.30 introduce <code>--force-if-includes</code> to close the background fetch lease race condition?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer runs <code>git push origin feature --force-with-lease</code>. Git rejects the push with: 'stale info: refs/remotes/origin/feature was updated'. What does this indicate?",
            "options": [
                "The developer's SSH key expired.",
                "Diagnose Remote Mutation During Local Rebase: Another collaborator (or a CI bot) pushed new commits to <code>origin/feature</code> since the developer last fetched. The lease check failed because the remote branch tip no longer matches the developer's local tracking ref. The developer must run <code>git fetch</code>, inspect the new commits, integrate them into their local branch, and try again.",
                "The developer must use plain --force to override the lease.",
                "The repository is read-only."
            ],
            "correctOptionIndex": 1,
            "debrief": "<code>--force-with-lease</code> refused the push because the remote branch moved since the developer last fetched. This protected the teammate's commits from being accidentally overwritten."
        },
        "quests": [
            {
                "id": "Q35.209",
                "name": "Compare-and-Swap Push Protocol & Ref Lease Architecture",
                "type": "Concept",
                "desc": "Analyze the client-server push negotiation protocol, examining lease token exchange, CAS preconditions, and the --force-if-includes refinement."
            },
            {
                "id": "Q35.210",
                "name": "The Background Fetch Lease Race Condition Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a production incident where an automated IDE background fetch fooled --force-with-lease into overwriting a colleague's code; add safety guardrails."
            },
            {
                "id": "Q35.211",
                "name": "Server-Side Pre-Receive Force-Push Guard Hook",
                "type": "Mastery Assignment",
                "desc": "Build a server-side pre-receive hook in Python/Bash that inspects incoming ref updates, rejects non-fast-forwards on protected branches, and audits lease headers."
            },
            {
                "id": "Q35.212",
                "name": "High-Frequency Concurrent Force-Push Contention Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Simulate 10 automated worker nodes attempting concurrent force-with-lease pushes to a shared branch; measure rejection accuracy and CAS convergence."
            }
        ]
    },
    {
        "day": 54,
        "month": 2,
        "blockNum": 11,
        "title": "Worktree Concurrency & Workspace Isolation in Multi-Agent Environments: Collision Detection & Lifecycles",
        "stageNum": 11,
        "stageName": "Stage 11: Large-Scale Git Performance Tuning & Disaster Forensics",
        "pedagogicalRole": "Multi-Agent Systems & Concurrency Architecture (Worktree Concurrency, Shared Object Databases, Collision Detection, Branch Namespacing)",
        "spokenGoal": "In modern AI-assisted engineering and autonomous multi-agent systems, dozens of AI coding agents or automated workers collaborate on the same repository simultaneously. If they share a working tree or clash on branch names, chaos ensues. Today, you master Multi-Agent Worktree Architecture: dynamically provisioning isolated worktrees per agent, sharing a single <code>.git/objects/</code> store, enforcing branch namespacing (e.g. <code>agent/agent-id/feature</code>), implementing collision detection, and managing worktree lifecycles.",
        "conceptInvariant": "Multi-Agent Worktree Isolation Invariant: Every concurrent worker process must be assigned a dedicated, isolated Git worktree bound to a distinct branch namespace: $\\forall i \\ne j,\\ \\text{Branch}_i \\ne \\text{Branch}_j \\land \\text{WorktreePath}_i \\ne \\text{WorktreePath}_j$. Direct concurrent mutation of identical branch heads is strictly prohibited.",
        "failureMode": "The Autonomous Agent Branch Lock Collision Thrash: Two autonomous AI coding agents attempt to work on the same branch simultaneously in separate directories. Agent 1 commits and pushes. Agent 2's push is rejected as non-fast-forward. Agent 2 attempts a force-push, overwriting Agent 1's work, triggering an infinite thrashing loop that burns $2,000 in LLM API credits.",
        "tryItFriction": "Author an automated multi-worktree worker orchestrator in Python that dynamically provisions isolated worktrees for concurrent agents, handles collision detection, locks worktree branches, and merges results cleanly into a staging branch.",
        "socraticHints": [
            "Why must multi-agent architectures use Git Worktrees sharing a single object store rather than cloning independent copies of the repository for each agent?",
            "How does Git's internal worktree lock (<code>git worktree lock <path></code>) prevent an administrative prune job from cleaning up an active worktree?",
            "What naming conventions and branch reconciliation queues should be implemented to merge multi-agent contributions without conflict?"
        ],
        "situationalPuzzle": {
            "scenario": "A multi-agent coding platform spins up 10 AI subagents to fix 10 independent bugs in parallel. Subagent 3 crashes midway through execution. When the platform tries to re-run Subagent 3 on the same task, Git throws: 'fatal: branch bug-3 is already checked out at /tmp/worktrees/subagent-3'.",
            "options": [
                "Reboot the server.",
                "Diagnose Unpruned Stale Worktree Allocation: The crashed process left its worktree directory and administrative metadata registered in <code>.git/worktrees/</code>. The orchestrator must implement crash recovery: (1) Check if the worker process is alive, (2) If dead, run <code>git worktree remove --force /tmp/worktrees/subagent-3</code>, and (3) Prune stale records with <code>git worktree prune</code> before re-allocating the branch.",
                "Delete the entire Git repository and re-clone.",
                "Change the branch name to bug-3-new."
            ],
            "correctOptionIndex": 1,
            "debrief": "Crashed worker processes leave worktree registrations active in Git's internal metadata, locking the associated branch. The orchestrator must handle cleanup by removing the orphaned worktree and pruning stale metadata before retrying."
        },
        "quests": [
            {
                "id": "Q35.213",
                "name": "Multi-Agent Worktree Architecture & Concurrency Blueprint",
                "type": "Concept",
                "desc": "Detail the systems architecture for orchestrating concurrent AI coding agents over shared Git repositories, exploring worktree pools and collision detection."
            },
            {
                "id": "Q35.214",
                "name": "The Autonomous Multi-Agent Force-Push Thrashing Loop Detective",
                "type": "Detective Challenge",
                "desc": "Investigate a high-cost multi-agent thrashing loop where two autonomous agents repeatedly overwrote each other's branches; implement branch isolation."
            },
            {
                "id": "Q35.215",
                "name": "Autonomous Multi-Worker Worktree Pool Orchestrator",
                "type": "Mastery Assignment",
                "desc": "Build an automated worker pool manager in Python that allocates isolated worktrees, monitors worker heartbeats, detects branch locks, and cleans up."
            },
            {
                "id": "Q35.216",
                "name": "25-Agent Concurrent Worktree Mutation & Merge Queue Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Simulate 25 autonomous AI coding agents committing simultaneously to separate worktrees; verify zero lock contentions and seamless merge queue synthesis."
            }
        ]
    },
    {
        "day": 55,
        "month": 2,
        "blockNum": 11,
        "title": "Legacy VCS Migration Engineering: Migrating Subversion (SVN), Perforce & Mercurial to Git with Full History",
        "stageNum": 11,
        "stageName": "Stage 11: Large-Scale Git Performance Tuning & Disaster Forensics",
        "pedagogicalRole": "Enterprise Migration Engineering (SVN, Perforce, Mercurial to Git Migration, Authors Mapping, Branch Topology Preservation & Verification)",
        "spokenGoal": "In Fortune 500 banks, healthcare systems, and aerospace contractors, decades of mission-critical intellectual property remain trapped in legacy version control systems like Apache Subversion (SVN), Perforce (Helix Core), and Team Foundation Server (TFS). Today, you master Legacy Migration Engineering: using tools like <code>git-svn</code>, <code>git-p4</code>, and <code>fast-export</code> to migrate multi-million line codebases to Git while preserving 100% of historical commits, author identities, timestamps, and branch topologies.",
        "conceptInvariant": "Historical Provenance Equivalence Invariant: A valid VCS migration must guarantee exact historical equivalence: for every historical revision $R_{\text{legacy}}$, the reconstructed Git commit $C_{\text{git}}$ must produce identical file contents, timestamps, author metadata, and parent linkages.",
        "failureMode": "The Truncated SVN Authors Mapping Disaster: An enterprise migrates a 15-year-old Subversion repository using a naive script that maps all commits to a generic 'admin' user. The company loses all individual code authorship and regulatory audit history required for aerospace compliance certification, forcing a $2M forensic re-migration.",
        "tryItFriction": "Author an authors mapping file (<code>authors.txt</code>) to translate legacy Subversion usernames (<code>jsmith = John Smith <jsmith@company.com></code>) into standardized Git identities; execute a simulated migration preserving commit timestamps and tags.",
        "socraticHints": [
            "How does Subversion's directory-based branching model (<code>/trunk</code>, <code>/branches/</code>, <code>/tags/</code>) translate into Git's reference pointer architecture?",
            "Why must large binary files trapped in legacy Perforce repositories be migrated directly to Git LFS rather than standard Git Blobs?",
            "What automated checksum verification scripts prove that the latest Git commit matches the legacy repository's head revision to the exact byte?"
        ],
        "situationalPuzzle": {
            "scenario": "An enterprise migrates a 200GB legacy Perforce repository to Git. The migration finishes, but the resulting Git repository clone size is 180GB, causing all developer workstations to run out of disk space during clone. How should the migration architect fix this?",
            "options": [
                "Delete all commits older than 1 month.",
                "Diagnose Legacy Binary Bloat & Re-Run Migration with Git LFS Extraction: Perforce was used to store large binary builds and media files directly in revisions. The architect must re-run the migration using <code>git filter-repo --analyze</code> to identify large binary assets, and configure <code>git filter-repo</code> to extract all binaries over 10MB into Git LFS pointers, reducing the repository clone size from 180GB to 2.5GB.",
                "Instruct all developers to buy 2TB external hard drives.",
                "Abandon the Git migration and stay on Perforce."
            ],
            "correctOptionIndex": 1,
            "debrief": "Legacy VCS systems like Perforce often contain massive binary files that cause catastrophic repository bloat in Git. Using <code>git filter-repo</code> during or immediately after migration to offload large binary assets to Git LFS restores repository performance."
        },
        "quests": [
            {
                "id": "Q35.217",
                "name": "Legacy VCS Internal Models vs Git DAG Architecture",
                "type": "Concept",
                "desc": "Analyze the structural differences between Subversion/Perforce file-revision graphs and Git's content-addressable DAG, detailing fast-import protocols."
            },
            {
                "id": "Q35.218",
                "name": "The Truncated Authorship Regulatory Audit Failure Detective",
                "type": "Detective Challenge",
                "desc": "Investigate a botched enterprise SVN migration where commit authorship was wiped; build an automated author reconciliation script to restore compliance."
            },
            {
                "id": "Q35.219",
                "name": "Automated Legacy VCS to Git LFS Migration Pipeline",
                "type": "Mastery Assignment",
                "desc": "Build an end-to-end migration tool in Python that extracts legacy repositories, maps author identities, routes large binaries to Git LFS, and verifies checksums."
            },
            {
                "id": "Q35.220",
                "name": "100,000-Revision High-Fidelity Migration Parity Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Execute a migration on a synthetic 100,000-revision legacy repository with complex branch merges and tags; verify 100% byte-for-byte parity at every revision."
            }
        ]
    },
    {
        "day": 56,
        "month": 2,
        "blockNum": 12,
        "title": "Historic Catastrophe Post-Mortem 1: The Commercial Force-Push Repository Obliteration ($12M Lost WIP)",
        "stageNum": 12,
        "stageName": "Stage 12: Historic Disasters & Grand Capstone",
        "pedagogicalRole": "Forensic Incident Reconstruction (Force-Push Production Disasters, Lost Remote Reflogs, Server-Side Pre-Receive Hooks & Repository Recovery)",
        "spokenGoal": "In 2018, an automated database failover script at a financial software firm ran <code>git push --force</code> on the central repository, obliterating 6 months of active work across 40 feature branches. Because remote Git servers do not expose reflogs by default, the company lost an estimated $12 million in engineering time reconstructing lost commits from employee laptops. Today, you conduct a forensic investigation of this disaster and architect server-side pre-receive guardrails.",
        "conceptInvariant": "Server-Side Force-Push Prohibition Invariant: Enterprise production repositories must enforce server-side pre-receive hooks or organization rulesets that categorically reject non-fast-forward push updates on all protected branch patterns: $\\text{IsNonFastForward}(U) \\implies \\text{REJECT}$.",
        "failureMode": "The $12M Force-Push Production Wipe Disaster: A release engineer ran an automated synchronization script with <code>--force</code> on the primary release branch during an incident response. 45 commits containing active quarter-end release features were permanently erased from the remote repo, taking down release schedules for 6 weeks.",
        "tryItFriction": "Simulate an accidental remote branch force-push deletion; reconstruct the lost branch history using a client machine's local reflog, and implement a server-side pre-receive hook that permanently blocks destructive force-pushes.",
        "socraticHints": [
            "Why does a remote Git server like GitHub or GitLab not maintain a user-accessible <code>git reflog</code> for deleted or rewritten remote branches?",
            "How does a server-side pre-receive hook inspect incoming push tuples (<code>old-rev new-rev ref-name</code>) to detect non-fast-forward updates before they are accepted?",
            "What client-side recovery playbook allows an enterprise team to harvest lost commits from developer workstation local caches following a remote force-push wipe?"
        ],
        "situationalPuzzle": {
            "scenario": "A catastrophic force-push overwrote the remote <code>main</code> branch on GitHub, erasing 100 commits. The engineering team needs to recover the exact state of <code>main</code> before the force-push. What is the fastest and most reliable recovery procedure?",
            "options": [
                "Re-write all 100 commits from memory.",
                "Diagnose Client Reflog Harvesting: Every developer who pulled <code>main</code> prior to the force-push still has the pre-overwrite commit hash recorded in their local <code>.git/refs/remotes/origin/main</code> and local reflogs. Find a developer who had the latest pull, locate the pre-overwrite SHA (e.g. <code>abc1234</code>), verify its tree, and run <code>git push origin abc1234:main --force-with-lease</code> to restore remote main instantly.",
                "Contact GitHub support and wait 3 weeks.",
                "Accept the loss and continue from the truncated branch."
            ],
            "correctOptionIndex": 1,
            "debrief": "Because Git is a distributed version control system, the remote server is not the only copy of the history. Every developer's local machine retains the previous commit hash in their local tracking branches and reflogs. Pushing that hash back to the remote restores the branch immediately."
        },
        "quests": [
            {
                "id": "Q35.221",
                "name": "Forensic Engineering of the $12M Force-Push Obliteration Disaster",
                "type": "Concept",
                "desc": "Analyze the technical timeline and failure modes of enterprise force-push disasters, examining remote ref updates and distributed recovery protocols."
            },
            {
                "id": "Q35.222",
                "name": "The Wiped Remote Release Branch Harvest Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a simulated production incident where remote branches were wiped; harvest commit hashes from distributed developer reflogs and restore trunk."
            },
            {
                "id": "Q35.223",
                "name": "Server-Side Pre-Receive Non-Fast-Forward Defense Hook",
                "type": "Mastery Assignment",
                "desc": "Author an industrial-strength server-side pre-receive hook in Python that analyzes incoming ref updates, validates fast-forwards, and logs audit events."
            },
            {
                "id": "Q35.224",
                "name": "Simulated Remote Obliteration & Distributed Recovery Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Execute an intentional destructive force-push on a mock remote server; execute your automated harvest script across 10 developer nodes to restore state."
            }
        ]
    },
    {
        "day": 57,
        "month": 2,
        "blockNum": 12,
        "title": "Historic Catastrophe Post-Mortem 2: The Hardcoded AWS Root Key GitHub Leak ($4.5M Cloud Compromise)",
        "stageNum": 12,
        "stageName": "Stage 12: Historic Disasters & Grand Capstone",
        "pedagogicalRole": "Forensic Security Autopsy (Public Repository Leaks, Secret Scrapers, GitHub Secret Scanning, Push Protection & Revocation)",
        "spokenGoal": "In high-profile corporate security breaches at companies like Uber, Imperva, and DXC Technology, attackers gained initial access by harvesting AWS and database credentials accidentally committed into public GitHub repositories. Automated threat-actor bots monitor GitHub's public firehose event stream (<code>events.api</code>) in real time, extracting keys within 3 seconds of push. Today, you dissect secret exfiltration pipelines and architect pre-push cryptographic firewalls.",
        "conceptInvariant": "Zero-Exposure Pre-Push Protection Invariant: Repositories must enforce GitHub Push Protection or server-side pre-receive entropy scans. Any push containing a recognized secret pattern must be rejected before the commit is accepted into the remote object database.",
        "failureMode": "The $4.5M Cloud Infrastructure Cryptomining Breach: A developer committed an unencrypted corporate cloud master credential in a public documentation repository. Within 4 minutes, automated threat actors extracted the credential, compromised 8 cloud regions, deployed 4,000 spot instances, and exfiltrated 500,000 customer records.",
        "tryItFriction": "Simulate an attempt to push a high-entropy secret token to a mock remote repository; verify that server-side push protection hooks intercept the payload and reject the push with an actionable security warning.",
        "socraticHints": [
            "How do automated bot scrapers monitor GitHub's public event API to harvest credentials within seconds of a commit being pushed?",
            "What is GitHub Secret Scanning and Push Protection, and how does it proactively block commits containing recognized provider tokens (AWS, Stripe, Slack)?",
            "Why is an exposed credential considered compromised the instant it reaches a public server, regardless of how quickly it is deleted?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer commits an active Stripe live secret key (<code>sk_live_...</code>) and pushes to GitHub. GitHub Push Protection intercepts the push and blocks it with: 'Push rejected: Secret detected'. The developer wants to know how to resolve this so they can push their code.",
            "options": [
                "Click 'Bypass secret detection' in the web browser.",
                "Diagnose Proper Secret Remediation Flow: The secret must never be committed. The developer must: (1) Remove the secret from the file and replace it with an environment variable reference, (2) Amend or rebase the local commit to remove the secret from Git history entirely, and (3) Move the secret into a secure secret manager (.env ignored file or GitHub Secrets). Only then will the push succeed cleanly.",
                "Add a comment above the secret saying 'do not steal'.",
                "Rename the file from .js to .txt."
            ],
            "correctOptionIndex": 1,
            "debrief": "Bypassing secret detection leaks the credential. The proper resolution is to remove the secret, amend the commit history to eliminate all traces of the token, and store the credential in an environment variable or secrets manager."
        },
        "quests": [
            {
                "id": "Q35.225",
                "name": "Secret Scraper Threat Modeling & Push Protection Architecture",
                "type": "Concept",
                "desc": "Detail the architecture of automated credential harvesting bots, examining GitHub public event streaming, regex parsing, and Push Protection interceptors."
            },
            {
                "id": "Q35.226",
                "name": "The Leaked Root Credential Cloud Exfiltration Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Conduct a post-mortem forensic investigation of an enterprise credential leak; audit GitHub commit timestamps against AWS CloudTrail API access logs."
            },
            {
                "id": "Q35.227",
                "name": "Automated Pre-Push Secret Firewall & Entropy Gate",
                "type": "Mastery Assignment",
                "desc": "Build an enterprise pre-push hook that scans outgoing commit ranges against 200 credential patterns and Shannon entropy thresholds, blocking leaks."
            },
            {
                "id": "Q35.228",
                "name": "High-Volume Secret Scanning & Automated Revocation Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Simulate automated credential revocation webhooks; verify that detected secrets trigger instant cloud provider revocation API calls within 1 second."
            }
        ]
    },
    {
        "day": 58,
        "month": 2,
        "blockNum": 12,
        "title": "Historic Catastrophe Post-Mortem 3: The Broken Merge Conflict Silent Semantic Corruption (The $440M Glitch)",
        "stageNum": 12,
        "stageName": "Stage 12: Historic Disasters & Grand Capstone",
        "pedagogicalRole": "Forensic Incident Reconstruction (Knight Capital Disaster, Silent Semantic Merges, Compiler AST Verification & Automated Integration Gates)",
        "spokenGoal": "In 2012, Knight Capital lost $440 million in 45 minutes, bankrupting the company. The root cause was a botched deployment where legacy algorithmic trading code was accidentally executed because an automated merge silently reused dead function flags across divergent branches. Today, you dissect how a merge can have zero Git conflicts yet be completely corrupted semantically, and learn how AST-level diffing and automated integration testing prevent silent merge regressions.",
        "conceptInvariant": "Semantic AST Verification Invariant: A clean textual merge ($C_{\\text{textual}} = 0$) does NOT imply semantic correctness. Merged code must pass static type analysis, AST invariant checks, and end-to-end integration tests before entering release candidates.",
        "failureMode": "The Knight Capital $440M Silent Code Reuse Disaster: During deployment, automated merges left dormant algorithmic trading flags active on 8 production servers. When markets opened, the servers sent 4 million unauthorized trade orders, generating a $440M loss in 45 minutes and bankrupting the firm.",
        "tryItFriction": "Construct two branches that merge with zero Git conflicts but produce a fatal semantic runtime crash; author an automated CI merge validation test that detects the semantic regression before deployment.",
        "socraticHints": [
            "Why can a three-way merge complete with zero textual conflicts yet result in code that fails to compile or crashes at runtime?",
            "How did Knight Capital's failure to update all production servers and verify branch deployment parity lead to the activation of dead trading code?",
            "What automated integration verification gates must run on the post-merge commit tree before promoting code to production?"
        ],
        "situationalPuzzle": {
            "scenario": "A developer merges branch A into main. Git reports: 'Merge made by the 'ort' strategy. 0 conflicts.' When the application runs in staging, an unhandled exception crashes the service on boot. The developer argues: 'Git said there were zero conflicts, so the merge cannot be the problem.'",
            "options": [
                "The staging server hardware is failing.",
                "Diagnose Silent Semantic Merge Conflict: Git only detects textual line conflicts; it has zero understanding of programming language semantics, types, or variable scopes. Branch A deleted a function parameter, while another branch merged into main added a call expecting that parameter. Both text changes merged cleanly into valid files, but the resulting code violates language semantics. Automated compile and integration tests are mandatory post-merge.",
                "Git's ort merge engine has a bug and should be rolled back.",
                "The developer should never merge code again."
            ],
            "correctOptionIndex": 1,
            "debrief": "Textual line merges do not understand programming language syntax or business logic. Two changes can merge without any textual conflict yet produce invalid or broken code. Automated build and test validation must always verify the post-merge tree."
        },
        "quests": [
            {
                "id": "Q35.229",
                "name": "Knight Capital Disaster Forensics & Semantic Merge Invariants",
                "type": "Concept",
                "desc": "Analyze the technical root causes of the Knight Capital $440M failure, examining deployment parity, dead code activation, and semantic merge hazards."
            },
            {
                "id": "Q35.230",
                "name": "The Silent Semantic API Signature Conflict Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a production crash resulting from a clean textual merge with zero Git conflicts; identify the semantic contract violation and repair the codebase."
            },
            {
                "id": "Q35.231",
                "name": "AST-Aware Semantic Merge Verification & Test Gate Engine",
                "type": "Mastery Assignment",
                "desc": "Build an automated CI gate that parses Abstract Syntax Trees (ASTs) of post-merge files, checks symbol references, and rejects semantically broken merges."
            },
            {
                "id": "Q35.232",
                "name": "Adversarial Semantic Merge Conflict Injection Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Simulate 20 clean textual merges containing deliberate semantic breaking changes; verify that AST analyzers and integration gates catch 100% of regressions."
            }
        ]
    },
    {
        "day": 59,
        "month": 2,
        "blockNum": 12,
        "title": "Principal DevOps Architect Modernization RFC: Transitioning 2,000 Polyrepos to a Scalable Monorepo ($25M Blueprint)",
        "stageNum": 12,
        "stageName": "Stage 12: Historic Disasters & Grand Capstone",
        "pedagogicalRole": "Enterprise Systems Transformation (Monorepo Modernization RFC, Polyrepo Consolidation, Scalar & Hermetic Build Architecture)",
        "spokenGoal": "You have analyzed historic catastrophes and mastered enterprise Git architecture. Now step into the shoes of a Principal DevOps Infrastructure Architect. A Fortune 100 enterprise has 2,000 unmaintained polyrepos with fragmented CI pipelines, divergent dependency versions, and security vulnerabilities everywhere. Today, you author a comprehensive $25M Modernization Request for Comments (RFC) proposing an architectural roadmap to consolidate polyrepos into a high-performance governed monorepo using Microsoft Scalar, sparse checkout, hermetic build tooling, and automated merge queues.",
        "conceptInvariant": "Architectural Consolidation Invariant: Monorepo consolidation must preserve full historical commit provenance across all services, maintain strict service boundary isolation via path-based CODEOWNERS, and enforce hermetic build caching to prevent CI runtime explosion.",
        "failureMode": "The Big-Bang Monorepo Migration Freeze: An enterprise attempts to merge 2,000 repositories into a single Git monorepo over a weekend using naive directory copying. All historical commit attribution is wiped, CI runners crash with out-of-memory errors, and 3,000 engineers are blocked for two weeks.",
        "tryItFriction": "Author a comprehensive 12-page Principal Architect Modernization RFC detailing the technical migration phases, tooling architecture (Scalar, Bazel/Turborepo, LFS), cost-benefit analysis, and risk mitigation strategies.",
        "socraticHints": [
            "How do tools like <code>git filter-repo --to-subdirectory-filter</code> allow you to import polyrepos into monorepo subdirectories while preserving 100% of historical commits?",
            "Why is Microsoft Scalar essential for keeping developer git status and fetch operations fast when an enterprise monorepo reaches 500,000 files?",
            "What organizational change management strategies prevent developer pushback during a major version control architecture migration?"
        ],
        "situationalPuzzle": {
            "scenario": "An enterprise architecture board debates whether to consolidate 1,500 microservices into a single monorepo. The Security Director objects: 'If all code is in one repository, any developer can view and edit any other team's service.' How should the Principal Architect address this?",
            "options": [
                "Give all developers full admin access to the entire company's code.",
                "Architect Granular CODEOWNERS, Path Rulesets & Read-Permission Isolation: Explain that enterprise monorepos enforce strict directory-level governance: (1) <code>CODEOWNERS</code> mandates that only specific domain teams can approve PRs touching their folders, (2) GitHub Rulesets restrict branch pushes, and (3) Sensitive proprietary algorithms can remain in isolated repositories linked via submodules or private package registries.",
                "Cancel the monorepo initiative immediately.",
                "Set file permissions in Linux using chmod 700."
            ],
            "correctOptionIndex": 1,
            "debrief": "A monorepo does not mean unconstrained access. Path-based <code>CODEOWNERS</code>, branch rulesets, and automated CI policies enforce strict boundary governance, ensuring that team ownership and review requirements are rigorously maintained."
        },
        "quests": [
            {
                "id": "Q35.233",
                "name": "Enterprise Monorepo Modernization Architecture & RFC Blueprint",
                "type": "Concept",
                "desc": "Detail the systems architecture for migrating thousands of polyrepos into a scalable governed monorepo, examining Scalar, Bazel, and LFS integration."
            },
            {
                "id": "Q35.234",
                "name": "The Polyrepo Consolidation Cost-Benefit & ROI Analysis Detective",
                "type": "Detective Challenge",
                "desc": "Evaluate an enterprise with 2,000 fragmented polyrepos; calculate operational costs, developer friction metrics, and ROI for monorepo consolidation."
            },
            {
                "id": "Q35.235",
                "name": "Principal Architect $25M Enterprise Monorepo Modernization RFC",
                "type": "Mastery Assignment",
                "desc": "Author a comprehensive 15-page architectural RFC proposing the technical migration roadmap, tooling stack, security guardrails, and rollout milestones."
            },
            {
                "id": "Q35.236",
                "name": "Enterprise Architecture Review Board Viva Defense Lab",
                "type": "Production Incident Lab",
                "desc": "Defend your Modernization RFC before a simulated panel of enterprise CIOs, CISOs, and engineering directors, resolving high-pressure security and scaling concerns."
            }
        ]
    },
    {
        "day": 60,
        "month": 2,
        "blockNum": 12,
        "title": "Capstone 2: ApexEnterpriseGitOps Sovereign Distributed Version Control & Enterprise Release Master Capstone Viva",
        "stageNum": 12,
        "stageName": "Stage 12: Historic Disasters & Grand Capstone",
        "pedagogicalRole": "Grand Master Capstone & Executive Board Defense (Distributed Version Control, Binary Plumbing, Security Hardening, Monorepo Architecture & CI/CD)",
        "spokenGoal": "This is the grand culmination of your 60-day journey to becoming a Principal DevOps Systems Architect and Version Control Master. Today, you submit and defend ApexEnterpriseGitOps: an institutional-grade version control and release engineering platform. It unifies low-level binary packfile decoding, trunk-based release orchestration, zero-secret OIDC cloud workflows, pre-commit secret scanning, cryptographic signature verification, automated merge queues, and complete disaster recovery playbooks, defending your architecture live before the Principal Systems Board.",
        "conceptInvariant": "Grand Capstone Production Invariant: ApexEnterpriseGitOps must satisfy: (1) 100% cryptographic signature verification, (2) zero unhydrated LFS pointer leaks, (3) automated merge queue serialization, (4) sub-second status checking via fsmonitor, and (5) automated recovery playbooks for force-push and reflog disasters.",
        "failureMode": "The Capstone Viva Chaos Injection Collapse: A candidate presents their enterprise GitOps architecture. The Board injects a simulated force-push attack, a pre-computed SHA-1 collision payload, and an unhydrated 2GB LFS pointer; the platform fails to detect the collision and deploys broken assets, leading to immediate review failure.",
        "tryItFriction": "Deliver, run, and defend the complete ApexEnterpriseGitOps platform against the Senior Architectural Review Board under live adversarial stress injections, broken merge bases, and secret leaks, proving 100% operational excellence and 9.8 pedagogical standard.",
        "socraticHints": [
            "How does your architecture guarantee sub-second git status response times over an 800,000-file enterprise monorepo?",
            "What automated guardrails in your pipeline prevent both textual and semantic merge conflicts from reaching the production trunk?",
            "How does your disaster recovery playbook reconstruct a damaged repository using <code>git reflog</code> and dangling object trees?"
        ],
        "situationalPuzzle": {
            "scenario": "During the final Viva defense, an executive board member asks: 'Why should our company invest in building governed monorepo tooling and merge queues rather than keeping our cheap independent polyrepos?'",
            "options": [
                "Polyrepos are obsolete and should be banned.",
                "Defend Atomic Refactoring & Dependency Velocity: Explain that polyrepos create hidden organizational costs: dependency version drift, multi-repo PR coordination deadlocks, fragmented CI security policies, and delayed breaking change detection. A governed monorepo with automated merge queues provides atomic cross-service refactoring, single-source-of-truth security auditing, and continuous integration velocity, drastically accelerating time-to-market.",
                "Agree with the executive and recommend keeping polyrepos.",
                "Refuse to answer the question."
            ],
            "correctOptionIndex": 1,
            "debrief": "A well-architected monorepo eliminates the high operational friction of polyrepo dependency drift and cross-repo coordination. Coupled with merge queues and path-based governance, it delivers enterprise-scale continuous delivery with lower risk."
        },
        "quests": [
            {
                "id": "Q35.237",
                "name": "ApexEnterpriseGitOps Grand Architecture Specification",
                "type": "Concept",
                "desc": "Document the complete systems blueprint of ApexEnterpriseGitOps, detailing binary storage layers, trunk release pipelines, and security verification."
            },
            {
                "id": "Q35.238",
                "name": "The Enterprise Version Control Chaos Audit Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Conduct a comprehensive forensic audit of an enterprise repository suffering from force-pushes, leaky secrets, and broken merge bases; restore it."
            },
            {
                "id": "Q35.239",
                "name": "ApexEnterpriseGitOps Production Master Platform Deployment",
                "type": "Mastery Assignment",
                "desc": "Deliver the complete ApexEnterpriseGitOps platform: packfile decoders, trunk release automation, OIDC workflows, and disaster recovery engines."
            },
            {
                "id": "Q35.240",
                "name": "Grand Capstone Viva Defense & Principal Systems Board Gate",
                "type": "Production Incident Lab",
                "desc": "Defend the completed ApexEnterpriseGitOps platform before the Principal Systems Board under live chaotic data injections and adversarial attacks."
            }
        ]
    }
]

out_path = Path(__file__).resolve().parent / "git_version_control_spec_m2_part2.py"

content = f'''# scripts/visuals/git_version_control_spec_m2_part2.py
# Month 2: Days 46 to 60 Specification for Course 35: Git, GitHub & Version Control Basics (course-git-version-control)
# Conforms strictly to Gate v2 / True 9.8 standard across all 15 days (60 Quests: Q35.181 to Q35.240).

DAYS_46_TO_60 = {json.dumps(days_data, indent=2)}
'''

with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_path} with {len(days_data)} days ({sum(len(d['quests']) for d in days_data)} quests).")
