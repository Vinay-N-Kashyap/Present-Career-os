with open('scripts/branch_a/day60_content.py', 'r', encoding='utf-8') as f:
    text = f.read()

import sys, os
sys.path.append(os.path.abspath('scripts/branch_a'))
import day60_content

day60 = day60_content.DAY_60
parts = day60['parts']

additions = {
    1: [
        "To understand the technical wizardry behind Karpenter's rapid instance provisioning, examine how it interfaces with the Linux kernel and cloud hypervisor layers during a spike. In legacy systems, spinning up a node requires the cloud provider to provision an instance, attach network interfaces, format local disks, install packages via user-data, start the kubelet, and pull gigabytes of container images over the public internet. Karpenter eliminates this latency through pre-baked, container-optimized Bottlerocket or Amazon Linux AMIs with container image caching and fast-start snapshotting.",
        "When Karpenter launches a c6g.4xlarge Graviton node, the node boots into a minimal Linux microkernel in fifteen seconds. The kubelet connects to the Kubernetes API server via pre-authenticated TLS bootstraps. Because the node uses containerd with lazy image pulling (via stargz-snapshotter or eStargz), the checkout container begins executing user space instructions in under three seconds without waiting to download the entire multi-gigabyte container image layer. The entire end-to-end launch latency drops from the legacy seven minutes down to thirty-five seconds, allowing our platform to effortlessly ride the crest of massive consumer traffic surges."
    ],
    2: [
        "To appreciate the security depth of this cryptographic gatekeeper, consider the concept of an unbroken software chain of custody. In forensic crime investigations, physical evidence (such as DNA samples or fingerprints) must have a meticulously documented chain of custody: every officer who touched the evidence, the exact timestamp it was transferred, and the tamper-evident sealed evidence bag must be legally documented. If an unauthorized person touched the bag, the evidence is thrown out of court. Sigstore, SLSA, and Kyverno provide that exact legal chain of custody for digital software.",
        "Every single step in our software pipeline produces a cryptographically sealed receipt. When the developer authors code, their Git commit is signed with their hardware YubiKey. When GitHub Actions compiles the binary, the hermetic runner generates an in-toto provenance attestation signed by Fulcio. When Syft generates the CycloneDX SBOM, the SBOM is signed and attached as an OCI artifact. When Grype verifies zero Critical CVEs, that scan report is attested. When Kyverno evaluates the pod at admission time, it validates all four cryptographic seals against the Rekor transparency log before admitting the pod. If any single seal is missing, broken, or expired, the pod is rejected. Tampering with code in this pipeline is as mathematically impossible as forging a block on a public blockchain."
    ],
    3: [
        "To understand how the platform maintains data integrity throughout this multi-region chaos ordeal, examine PostgreSQL Write-Ahead Log (WAL) mechanics during the Patroni failover. When the primary database master in us-east-1 is terminated, client transactions that were committed prior to the crash had already been physically written to disk and acknowledged over the network. The standby replica in GCP us-central1 had been continuously applying incoming WAL records via asynchronous streaming replication with a replication lag of less than one hundred kilobytes.",
        "When Patroni detects the leader vacancy, it queries the local PostgreSQL engine for pg_last_wal_replay_lsn(). Because the standby maintains active quorum with the witness node, it safely verifies that no other node in the cluster possesses a more advanced LSN position. When it promotes itself, PostgreSQL executes crash recovery up to the exact last replayed LSN, transitions out of standby mode, and opens the database for read-write transactions. Upstream PgBouncer connection poolers pause incoming application queries during the fourteen-second promotion window, buffering transactions in memory. When the new master is ready, PgBouncer transparently flushes the buffered queries to the new primary. From the perspective of end customers browsing the mobile app, no checkout failed, no cart was lost, and no credit card was double-charged."
    ],
    4: [
        "The Comprehensive Twelve-Pillar Enterprise Cloud Architect Certification represents the gold standard of modern engineering accreditation. Over the course of twelve rigorous blocks, you have demonstrated mastery that spans the full breadth and depth of cloud-native computing. You have proven that you can write production Kubernetes operators from scratch, tune in-kernel eBPF socket filters with Cilium, enforce zero-trust cryptographic workload identity with SPIFFE/SPIRE, architect multi-region disaster recovery with Patroni consensus, optimize compute costs by forty to seventy percent with Karpenter Graviton consolidation, defend software supply chains with SLSA Level 4 and Sigstore, and engineer autonomic self-healing loops with Robusta and KEDA.",
        "You now possess the rare, highly sought-after ability to view enterprise digital platforms holistically: balancing developer velocity against system stability, security rigor against operational agility, and cloud scale against financial efficiency. You have transformed from an engineer who uses cloud tools into a master architect who designs autonomous cloud operating systems. Be proud of this monumental achievement. You have graduated Course 15, and the entire world of enterprise technology is ready for your leadership."
    ]
}

for part_idx, extra_paras in additions.items():
    parts[part_idx]['say'].extend(extra_paras)

code_out = "# Day 60 Content Generator: Course 15 Grand Master Capstone: The Autonomous Enterprise Cloud-Native Operating System\n\nDAY_60 = " + repr(day60) + "\n"

with open('scripts/branch_a/day60_content.py', 'w', encoding='utf-8') as f:
    f.write(code_out)

print("Expanded day60_content.py successfully!")
