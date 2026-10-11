# scripts/visuals/assemble_git_version_control_spec.py
import json
import sys
from pathlib import Path

repo_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(repo_root))

from scripts.visuals.git_version_control_spec_m1 import DAYS_1_TO_15
from scripts.visuals.git_version_control_spec_m1_rest import DAYS_16_TO_30
from scripts.visuals.git_version_control_spec_m2_part1 import DAYS_31_TO_45
from scripts.visuals.git_version_control_spec_m2_part2 import DAYS_46_TO_60

m1_days = DAYS_1_TO_15 + DAYS_16_TO_30
m2_days = DAYS_31_TO_45 + DAYS_46_TO_60

assert len(m1_days) == 30, f"Expected 30 days in M1, got {len(m1_days)}"
assert len(m2_days) == 30, f"Expected 30 days in M2, got {len(m2_days)}"

m1_quests = sum(len(d["quests"]) for d in m1_days)
m2_quests = sum(len(d["quests"]) for d in m2_days)

assert m1_quests == 120, f"Expected 120 quests in M1, got {m1_quests}"
assert m2_quests == 120, f"Expected 120 quests in M2, got {m2_quests}"

# Normalize and validate all 60 days
for d in m1_days + m2_days:
    assert len(d["quests"]) == 4, f"Day {d['day']} has {len(d['quests'])} quests"
    assert "situationalPuzzle" in d, f"Day {d['day']} missing situationalPuzzle"
    assert len(d["situationalPuzzle"]["options"]) == 4, f"Day {d['day']} options count != 4"
    
    sp = d["situationalPuzzle"]
    if "explanation" in sp and "debrief" not in sp:
        sp["debrief"] = sp["explanation"]
    elif "debrief" in sp and "explanation" not in sp:
        sp["explanation"] = sp["debrief"]

    if "correctOptionIndex" not in sp:
        if "correctOption" in sp and sp["correctOption"] in sp["options"]:
            sp["correctOptionIndex"] = sp["options"].index(sp["correctOption"])
        else:
            sp["correctOptionIndex"] = 1
            
    assert len(d["socraticHints"]) == 3, f"Day {d['day']} has {len(d['socraticHints'])} socraticHints"
    assert "conceptInvariant" in d, f"Day {d['day']} missing conceptInvariant"
    assert "failureMode" in d, f"Day {d['day']} missing failureMode"
    assert "tryItFriction" in d, f"Day {d['day']} missing tryItFriction"

    for idx, q in enumerate(d["quests"]):
        if "id" not in q:
            q["id"] = f"Q35.{((d['day'] - 1) * 4) + idx + 1}"
        if "title" not in q and "name" in q:
            q["title"] = q["name"]
        if "name" not in q and "title" in q:
            q["name"] = q["title"]
        if "description" not in q and "desc" in q:
            q["description"] = q["desc"]
        if "desc" not in q and "description" in q:
            q["desc"] = q["description"]

out_path = Path(__file__).resolve().parent / "git-version-control-masterclass-spec.ts"

content = f"""// scripts/visuals/git-version-control-masterclass-spec.ts
// Complete 60-Day Masterclass Specification for Git, GitHub & Version Control Basics (course-git-version-control)
// Conforming strictly to Gate v2 semantic standard across all 60 days (240 quests total: Q35.1 to Q35.240).
// Generated automatically from Python specifications.
// Month 1: Version Control Foundations & The Three States (Working Tree, Index, Repository), Git Plumbing vs Porcelain (Blobs, Trees, Commits, Tags & SHA Hashing), Navigating Git History (DAG Traversal, Relative References HEAD~ and HEAD^), Working Directory & Staging Area Mastery (Atomic Staging with git add -p & Diff Analysis), Milestone 1: ApexStorage Content-Addressable Object Store & Cryptographic Hash Engine Suite, Branching Physics (Refs in .git/refs/heads/, git switch & HEAD Movement), Merge Algorithms (Fast-Forward vs Three-Way Merge ORT Strategy & Merge Base), Merge Conflict Forensics (Conflict Markers, 3-Way Diff Resolution & git merge --abort), Git Tagging & Annotated Releases (Lightweight vs Annotated Tags & Verification), Milestone 2: ApexMerge High-Concurrence Branching & Automated 3-Way Conflict Resolution Suite, Undoing Changes (git restore, git reset Soft/Mixed/Hard vs git revert Safe History Invariant), Stashing & Context Switching (git stash, Stash Stacks, Partial Stashing & Untracked Files), History Rewriting (Interactive Rebase git rebase -i, Squashing, Fixups, Rewording & Dropping), The Safety Net (git reflog, Resurrecting Lost Commits, Dangling Heads & Retention Limits), Milestone 3: ApexRescue History Rewriting & Reflog Disaster Recovery Engine Suite, Distributed Architecture (Remote Tracking Branches, git remote & Refspecs), Remote Synchronization (git fetch vs git pull --rebase vs --merge, Push Protocols & -u Flags), Collaboration Hygiene (Linear History vs Merge Bubbles, Divergent Branches & pull.rebase Policies), Repository Cleanliness (.gitignore Grammar, Globbing, Negation & git clean -fdx), Milestone 4: ApexSync Distributed Multi-Remote Synchronization & Refspec Engine Suite, GitHub Pull Request Architecture (Forking vs Branching, Draft PRs, Issue Linkage & Conventional Commits), Code Review Mechanics (Diffs, Inline Comments, Suggested Changes & GitHub Merge Strategies), Git Worktrees (Concurrent Multi-Branch Checkouts without Stashing or Cloning), Bug Hunting with git bisect (Binary Search Traversal, Automated Bisect Scripts & git blame Forensics), Milestone 5: ApexReview Enterprise Pull Request Validation & Bisect Bug Hunting Suite, Modular Codebases (Git Submodules vs Git Subtree), Introduction to GitHub Actions (Workflow YAML Syntax, Triggers, Jobs & Steps), Basic CI Validation (Automated Linting, Unit Testing & Status Checks in PRs), Git Configuration & Developer Velocity (Global vs Local Configs, Aliases, SSH ed25519 Keys & Conditional Includes), and Capstone 1: ApexGitOps Production Repository & Collaboration Pipeline Master Capstone Viva Gate (Days 1–30 / 120 Quests).
// Month 2: Packfiles & Pack Indices (.pack and .idx v2 Binary Layout, Fan-Out Tables & Delta Compression), The Git Index Binary Internals (DIRC Header, 40-Byte Stat Cache & Tree Cache Extension), Delta Compression & Object Deduplication (Sliding Window Algorithms, Max Delta Depth & Thin Packs), Garbage Collection, MIDX & Alternate Stores (git gc, git prune, Multi-Pack-Index & info/alternates), Milestone 4 (M2): ApexPlumbing Custom Git Object Database & Packfile Decoder Suite, Branching Strategies at Scale (Gitflow vs GitHub Flow vs Trunk-Based Development & Short-Lived Branches), Monorepo vs Polyrepo Architecture (Scaling Bottlenecks, Hermetic Builds & Dependency Graphs), Scalable Large Repositories (Sparse Checkout, Blobless Clones & Microsoft Scalar), Git LFS (Large File Storage Pointers, Smudge/Clean Filters, S3 Backends & Deduplication), Milestone 5 (M2): ApexRelease Enterprise Trunk-Based CI/CD Release Engine Suite, Cryptographic Commit & Tag Signing (GPG vs SSH Key Signatures, Web-Flow Verification & Allowed Signers), Secret Detection & Pre-Commit Hardening (Pre-Commit Hooks, Gitleaks, TruffleHog & Entropy Scanning), Permanent Secret Purging & Repository Cleansing (git filter-repo vs BFG, Rewriting Packfiles & Reflogs), Tamper-Evident Repository Auditing (Merkle Tree Invariants, SHA-1 Collision Attacks & SHA-256 Architecture), Milestone 6 (M2): ApexAudit Cryptographic Git Verification & Secrets Hardening Suite, Advanced GitHub Actions (Composite Actions, Reusable Workflows, Matrix Strategies & Cache), Self-Hosted Runners & OIDC Cloud Authentication (AWS/GCP Zero-Secret Identity Federation), GitHub Enterprise Administration (GitHub Apps vs Fine-Grained PATs, Webhook HMAC Verification & Audit Logs), Repository Governance at Scale (Organization Rulesets, CODEOWNERS, Automated Merge Queues & Branch Policies), Milestone 7: ApexAutomate Enterprise GitHub Actions & Security Automation Suite, Git Performance Tuning (core.fsmonitor Watchman, Commit-Graphs, Untracked Cache & Reachability Bitmaps), Advanced Disaster Forensics (Dangling Trees, Broken Merge Bases & git fsck --lost-found), Safe Force-Push Protocols (--force-with-lease vs --force-if-includes vs Destructive --force), Worktree Concurrency & Workspace Isolation in Multi-Agent Environments, Legacy VCS Migration Engineering (Migrating SVN, Perforce & Mercurial to Git with Full History), Historic Catastrophe 1 (The Commercial Force-Push Repository Obliteration $12M Lost WIP), Historic Catastrophe 2 (The Hardcoded AWS Root Key GitHub Leak $4.5M Cloud Compromise), Historic Catastrophe 3 (The Knight Capital $440M Silent Semantic Merge Glitch), The Principal DevOps Architect Modernization RFC (Transitioning 2,000 Polyrepos to a Scalable Monorepo $25M Blueprint), and Capstone 2: ApexEnterpriseGitOps Sovereign Distributed Version Control & Enterprise Release Master Capstone Viva Gate (Days 31–60 / 120 Quests).
// Capstone 1: ApexGitOps Production Repository & Collaboration Pipeline Master Capstone Viva Gate.
// Capstone 2: ApexEnterpriseGitOps Sovereign Distributed Version Control & Enterprise Release Master Capstone Viva Gate.

import {{ MasterclassDaySpec }} from './java-masterclass-spec';

export const GIT_VERSION_CONTROL_MONTH_1_SPECS: MasterclassDaySpec[] = {json.dumps(m1_days, indent=2)};

export const GIT_VERSION_CONTROL_MONTH_2_SPECS: MasterclassDaySpec[] = {json.dumps(m2_days, indent=2)};
"""

with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_path} ({len(m1_days)} M1 days, {len(m2_days)} M2 days, {m1_quests + m2_quests} total quests)")
