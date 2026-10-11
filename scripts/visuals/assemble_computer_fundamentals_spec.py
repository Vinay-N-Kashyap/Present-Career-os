# scripts/visuals/assemble_computer_fundamentals_spec.py
import json
import sys
from pathlib import Path

repo_root = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(repo_root))

from scripts.visuals.computer_fundamentals_spec_m1 import DAYS_1_TO_15
from scripts.visuals.computer_fundamentals_spec_m1_rest import DAYS_16_TO_30
from scripts.visuals.computer_fundamentals_spec_m2_part1 import DAYS_31_TO_45
from scripts.visuals.computer_fundamentals_spec_m2_part2 import DAYS_46_TO_60

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
            q["id"] = f"Q{d['day']}.{idx + 1}"
        if "title" not in q and "name" in q:
            q["title"] = q["name"]
        if "name" not in q and "title" in q:
            q["name"] = q["title"]
        if "description" not in q and "desc" in q:
            q["description"] = q["desc"]
        if "desc" not in q and "description" in q:
            q["desc"] = q["description"]

out_path = Path(__file__).resolve().parent / "computer-fundamentals-masterclass-spec.ts"

content = f"""// scripts/visuals/computer-fundamentals-masterclass-spec.ts
// Complete 60-Day Masterclass Specification for Computer Literacy, Digital Productivity & OS Fundamentals (course-computer-fundamentals)
// Conforming strictly to Gate v2 semantic standard across all 60 days (240 quests total).
// Generated automatically from Python specifications.
// Month 1: Von Neumann Architecture & Instruction Cycle, Binary Arithmetic & IEEE 754 Floating-Point, CPU Caches (L1/L2/L3) & MESI Protocol, Assembly Language (x86-64 vs ARM64) & Calling Conventions, Milestone 1: ApexHardware CPU Instruction Cycle & Cache Emulator Suite, Kernel vs User Space & System Call Mechanics, Virtual Memory & Multi-Level Paging, Process Scheduling & CFS Red-Black Trees, Threads, Mutexes & Coffman Deadlocks, Milestone 2: ApexOS Multi-Threaded Process Scheduler & Virtual Memory Simulator Suite, Storage Physics (HDDs vs SSDs, NAND Flash & NVMe), Unix Inode Architecture & VFS, File System Consistency & WAL Journaling, Asynchronous I/O Multiplexing (epoll/kqueue), Milestone 3: ApexStorage Inode-Based File System & Async I/O Engine Suite, Unix Shell Philosophy & Standard Streams, POSIX Text Processing Mastery (grep, sed, awk), Linux Process Management & Signals (SIGTERM vs SIGKILL), Defensive Bash Scripting (set -euo pipefail), Milestone 4: ApexShell POSIX Telemetry Harvester & Incident Automation Suite, OSI/TCP-IP Stack & ARP Resolution, CIDR Subnetting & IP Forwarding Routing, Transport Layer Physics (TCP Handshake & Flow Control vs UDP), DNS Resolution & HTTP/3 QUIC / TLS 1.3, Milestone 5: ApexNet Raw Packet Sniffer & Subnet Routing Engine Suite, Permissions & DAC / POSIX ACLs, Cryptographic Primitives (AES, RSA/ECC, SHA-256 & Argon2id), Digital Hygiene & Authentication (SSH Ed25519, PKI, MFA), Systems Attack Vectors & Sandboxing (Buffer Overflows & seccomp), and Capstone 1: ApexSystem Core Operating Systems & Systems Architecture Master Capstone Viva Gate (Days 1–30 / 120 Quests).
// Month 2: Hardware Virtualization (Type 1 vs Type 2 Hypervisors, Intel VT-x & EPT), Linux Containers Internals (Namespaces & cgroups v2), Container Storage & OverlayFS Union Filesystems, Container Networking (veth pairs, Linux Bridges & iptables NAT), Milestone 6: ApexContainer Rootless Container Engine & cgroups Virtualization Suite, Modern Linux Tracing (eBPF, kprobes, uprobes & bpftrace), Brendan Gregg's USE Method & RED Method Bottleneck Calculus, Systems Profiling (Linux perf, CPU Flame Graphs & PMU Counters), Production Core Dump Forensics (GDB, DWARF Symbols & Stack Unwinding), Milestone 7: ApexTrace eBPF Kernel Observability & Performance Profiling Suite, Terminal Multiplexing & Productivity (tmux & Dotfiles), High-Performance Modal Text Editing (Neovim & LSP), Build Automation & Secret Hygiene (Make, Just, 12-Factor App & direnv), Modern CLI Productivity (fzf, ripgrep, bat, jq & zoxide), Milestone 8: ApexProductivity Sovereign Developer Environment & Workspace Orchestrator Suite, High Availability & Clustering (Heartbeats, Split-Brain & STONITH), Enterprise Storage (iSCSI SAN, NFSv4 NAS, RAID Arrays & Erasure Coding), Infrastructure as Code (IaC) & Immutable Golden Images (Packer), Enterprise Disaster Recovery (RTO/RPO, 3-2-1 Backups & Site Failovers), Milestone 9: ApexResilience Enterprise High-Availability & Disaster Recovery Suite, Historic Systems Catastrophe 1 (Knight Capital $440M Meltdown), Historic Systems Catastrophe 2 (CrowdStrike Falcon Global BSoD Crash), Historic Systems Catastrophe 3 (Cloudflare Global ReDoS Outage), Operating Systems Convergence (Linux vs Windows NT vs macOS Darwin), Modern Distributed OS & Cloud-Native Platforms (Kubernetes, Firecracker MicroVMs & Unikernels), The Principal Systems Architect RFC ($50M Infrastructure Modernization Blueprint), Enterprise Zero Trust Systems Hardening (CIS Benchmarks, Kernel sysctl & SELinux), Chaos Engineering & Failure Injection (Chaos Mesh & Self-Healing Loops), Sustainable Systems Engineering (Carbon-Aware Computing & Green Datacenters), and Capstone 2: ApexEnterpriseOS Full-Scale Systems Architecture & Infrastructure Engine Master Capstone Viva Gate (Days 31–60 / 120 Quests).
// Capstone 1: ApexSystem Core Operating Systems & Systems Architecture Master Capstone Viva Gate.
// Capstone 2: ApexEnterpriseOS Full-Scale Systems Architecture & Infrastructure Engine Master Capstone Viva Gate.

import {{ MasterclassDaySpec }} from './java-masterclass-spec';

export const COMPUTER_FUNDAMENTALS_MONTH_1_SPECS: MasterclassDaySpec[] = {json.dumps(m1_days, indent=2)};

export const COMPUTER_FUNDAMENTALS_MONTH_2_SPECS: MasterclassDaySpec[] = {json.dumps(m2_days, indent=2)};
"""

with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_path} ({len(m1_days)} M1 days, {len(m2_days)} M2 days, {m1_quests + m2_quests} total quests)")
