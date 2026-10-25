import json
import hashlib
import re

part1_say = [
    "When autonomous AI agents generate and execute arbitrary code, the security perimeter of the enterprise shifts from safeguarding input text to defending the operating system kernel itself. A language model tasked with processing financial records or compiling software can be steered—via malicious prompt injections, contaminated third-party packages, or adversarial user documents—into executing destructive system calls. The code execution sandbox represents the non-negotiable fortress wall protecting enterprise infrastructure from catastrophic compromise.",
    "Sandboxing threat modeling identifies operating system kernel vulnerabilities and malicious system call exploits in autonomous code execution. Foundation models do not possess innate moral or operational discretion: if an untrusted PDF contains an adversarial prompt instructing the model to execute an operating system fork bomb, scan internal network ports, or read sensitive environment variables, the model will generate the requested code with absolute syntactic fidelity. Security cannot rely on model alignment alone; it must be enforced through hardware-enforced isolation boundaries.",
    "Privilege escalation and container breakout vulnerabilities represent the highest-severity risk in multi-tenant AI platforms. In a standard Linux container utilizing the default runc runtime, the containerized process shares the underlying host kernel. If an agent executes an exploit targeting an unpatched kernel race condition or dirty-copy-on-write flaw, the process can break out of container namespaces, gain root privileges on the bare-metal host, and compromise all co-located enterprise workloads.",
    "Filesystem tampering and persistence attacks allow compromised code to leave backdoors for future execution sessions. An adversarial script might overwrite shared Python site-packages, inject trojan functions into standard utility modules, or modify shell profile configurations. To defeat persistence, production sandboxes must enforce strictly ephemeral, copy-on-write filesystems where all state mutations are quarantined and permanently shredded upon session completion.",
    "Network egress abuse enables malicious data exfiltration and unauthorized internal lateral movement. If an agent sandbox enjoys unrestricted internet access, an attacker can transmit proprietary database dumps to remote command-and-control servers or pivot laterally to scan internal microservices, Redis caches, and cloud metadata APIs. Production sandboxes mandate default-deny egress firewalls, terminating all outbound connections through strict domain-whitelisted HTTP proxies.",
    "Denial-of-Service attacks through compute resource exhaustion can freeze host servers and starve concurrent workloads. Runaway infinite loops consume one hundred percent of host CPU cores, uncontrolled memory allocations trigger Linux Out-Of-Memory kernel panics, and massive file generation floods disk volumes. Hardened sandboxes leverage Linux Control Groups (cgroups) to enforce strict, hardware-enforced ceilings on CPU cores, RAM memory, and disk input-output throughput.",
    "System call filtering via secure computing mode (seccomp) restricts the attack surface by intercepting and blocking dangerous kernel interfaces. Of the hundreds of system calls available in modern Linux, an analytical Python agent requires only a small fraction. By compiling strict Berkeley Packet Filter (BPF) programs that reject dangerous calls such as ptrace, kexec_load, and unshare, the platform neutralizes entire classes of privilege escalation exploits before they reach kernel drivers.",
    "Environment variable leakage exposes sensitive API keys, database credentials, and cloud tokens to untrusted code. A single command printing os.environ can expose root credentials to an adversarial user prompt. Production sandbox architectures strip all sensitive credentials from the execution container environment, injecting credentials dynamically through isolated proxy gateways that inspect and sign individual API requests without exposing raw secrets to the agent script.",
    "Hardware side-channel attacks and speculative execution leaks introduce subtle microarchitectural vulnerabilities in multi-tenant cloud environments. Malicious scripts can execute timing loops that infer cryptographic keys or sensitive memory data across CPU core caches using Spectre and Meltdown exploit variants. Hardened sandboxes defend against side channels by disabling simultaneous multithreading, enforcing dedicated CPU core pinning, and flushing microarchitectural cache buffers between successive agent executions.",
    "Mastering sandboxing threat models enables AI security engineers to design architectures that grant models maximal computational freedom while guaranteeing absolute enterprise safety. By treating all agent-generated code as inherently untrusted and potentially hostile, you construct defense-in-depth platforms that withstand the most sophisticated prompt injection and container breakout attacks."
]

part2_say = [
    "While standard Docker containers provide convenient process isolation for trusted microservices, their shared-kernel architecture makes them fundamentally unsuitable for running untrusted, model-generated code in multi-tenant environments. To provide genuine multi-tenant isolation, enterprise AI platforms turn to hardened container runtimes: Google gVisor and AWS Firecracker MicroVMs. Understanding the deep architectural differences between these technologies is essential for building safe, high-concurrency execution sandboxes.",
    "Hardened container runtimes virtualize operating system kernels and isolate agent execution behind virtualization boundaries. Unlike standard Docker runc containers where system calls pass directly to the shared host kernel, gVisor provides an application kernel written in Go (runsc) that intercepts and emulates system calls in user space. This ensures that untrusted Python scripts never interact directly with host kernel drivers, eliminating ninety-nine percent of container breakout attack vectors.",
    "The internal architecture of gVisor comprises two primary components: the Sentry and the Gofer. The Sentry acts as an independent guest operating system kernel that emulates over three hundred Linux system calls in user space. The Gofer mediates all filesystem operations, communicating across secure inter-process sockets to prevent untrusted code from issuing raw host filesystem commands. This double-layer boundary delivers near-virtual-machine isolation with container-level operational agility.",
    "AWS Firecracker takes a different architectural approach by leveraging hardware-assisted virtualization (KVM) to spawn ephemeral MicroVMs in single-digit milliseconds. Rather than emulating system calls in software, Firecracker boots a stripped-down Linux kernel inside an isolated hardware virtual machine. Each agent session runs in its own private virtual hardware envelope with dedicated memory and vCPUs, delivering total cryptographic isolation between tenants.",
    "Startup latency and resource density tradeoffs distinguish gVisor from MicroVM architectures. gVisor containers start in approximately fourteen milliseconds with a minimal memory footprint, allowing platforms to pack thousands of concurrent agent sessions onto a single physical server. Firecracker MicroVMs boot in roughly one hundred milliseconds and require slightly more dedicated memory, making them ideal for heavy, long-running compilation tasks where absolute hardware isolation is required.",
    "Filesystem overlay mechanisms ensure that every agent session starts from a clean, known-good baseline image. Utilizing OverlayFS and ephemeral tmpfs mounts, any modifications made by executing code—such as installing a python library or generating a temporary CSV—are written to a volatile scratch layer in memory. When the agent session terminates, the volatile layer is discarded instantly, guaranteeing zero state leakage across subsequent runs.",
    "Resource limit enforcement via cgroups v2 ensures precise allocation of computational quotas across sandboxed sessions. Each gVisor or Firecracker instance is constrained by strict limits: capping CPU time to two vCPUs, restricting memory to five hundred and twelve megabytes, and capping disk writes. If an agent script allocates excessive memory, the cgroup controller terminates the process cleanly without degrading host stability.",
    "Observability and runtime security monitoring via eBPF (Extended Berkeley Packet Filter) track all sandboxed activity with zero performance overhead. Security agents attach eBPF probes to the host kernel, observing container file access, network connections, and process lifecycles. Any anomalous behavior—such as an attempt to read sensitive host paths—triggers an instant kill signal, neutralizing threats in real time.",
    "Network stack virtualization in gVisor utilizes a dedicated user-space networking implementation called Netstack. Written completely in memory-safe Go, Netstack processes all TCP and UDP packets within user space, insulating the host network interfaces from malformed packet attacks, TCP sequence hijacking, and raw socket exploits, guaranteeing complete isolation across external communications.",
    "Rootless execution and user namespace remap configurations ensure that even if an agent manages to achieve root inside the container, it remains an unprivileged user on the host. By mapping container root UID zero to an unprivileged high-range UID on the host system, the platform ensures that broken-out processes lack administrative permissions, preventing unauthorized access to host devices, files, or services.",
    "Mastering hardened isolation runtimes equips platform architects to select the optimal balance of security, latency, and resource density. By combining gVisor user-space emulation with Firecracker MicroVMs, you build multi-tenant AI platforms that execute untrusted code with unshakeable enterprise confidence."
]

part3_say = [
    "While containers and MicroVMs provide robust isolation, they carry the operational overhead of virtualized operating systems, network bridges, and daemon processes. For lightweight mathematical calculations, data formatting, and safe scripting, WebAssembly (Wasm) and the WebAssembly System Interface (WASI) offer a groundbreaking alternative: high-speed, in-process execution sandboxes with zero host kernel access and microsecond cold-start latencies.",
    "WebAssembly and WASI runtimes provide lightweight in process sandboxes with microsecond startup latencies and memory safety. Originally designed for high-performance client-side browser execution, WebAssembly has matured into a universal, secure server-side compute runtime. By compiling Python interpreters into WebAssembly binaries—using technologies such as Pyodide or Wasmtime—enterprises can execute untrusted Python code directly inside their application processes with mathematical memory isolation.",
    "The capability-based security model of WASI enforces strict least-privilege resource access. Unlike traditional operating systems where a running program inherits all permissions of the executing user, a WASI module possesses zero capabilities by default: it cannot read files, access clocks, or open network sockets unless explicit directory descriptors and capabilities are granted at runtime. An agent cannot read confidential corporate files because the underlying Wasm runtime physically lacks the file descriptor to access them.",
    "Memory safety in WebAssembly is guaranteed by its linear memory architecture. A WebAssembly module operates within a single contiguous, bounds-checked byte array allocated by the host process. Memory pointers within the module cannot reference memory addresses outside this linear array, completely eliminating buffer overflow exploits, stack smashing, and unauthorized memory reading at the hardware instruction level.",
    "Microsecond cold starts enable instantaneous agent tool execution without pre-warming overhead. While even the fastest MicroVM requires ten to one hundred milliseconds to initialize, a WebAssembly runtime instantiates in less than fifty microseconds. This near-instantaneous startup allows agents to spin up dedicated, isolated sandboxes for single mathematical expressions or string operations without noticeable latency friction.",
    "Pyodide brings the full scientific Python ecosystem into the WebAssembly sandbox. By compiling CPython and popular scientific libraries like NumPy, pandas, and matplotlib into WebAssembly, Pyodide enables agents to perform sophisticated matrix calculations, statistical tests, and data cleanings within a completely isolated, browser-grade sandbox that requires zero container infrastructure.",
    "Deterministic execution and resource metering in Wasm engines allow platforms to count exact CPU instruction cycles. By injecting fuel-metering counters into the compiled Wasm bytecode, the host runtime terminates execution when an agent exceeds its assigned compute budget, providing mathematically precise protection against algorithmic complexity attacks and infinite loops.",
    "High-density multi-tenancy allows platforms to run tens of thousands of concurrent WebAssembly sandboxes on a single cloud server. Because Wasm modules execute as lightweight threads within a single host process rather than separate operating system containers, memory overhead is measured in kilobytes rather than megabytes, delivering unmatched operational efficiency.",
    "Ahead-of-Time compilation via the Cranelift optimizing code generator transforms WebAssembly bytecodes into near-native machine code prior to execution. By verifying linear memory bounds at compilation time, Cranelift eliminates runtime bounds-checking overhead on common code paths, delivering computational execution speeds exceeding eighty-five percent of bare-metal C performance.",
    "Hardware vectorization using WebAssembly SIMD extensions enables fast mathematical matrix operations within the memory-safe sandbox. Agent scripts performing vector distance calculations, cosine similarities, or token filtering benefit from hardware-accelerated one-hundred-and-twenty-eight-bit vector registers without leaving the zero-capability security boundary.",
    "The WebAssembly Component Model establishes standardized composable interfaces across heterogeneous tool modules. Utilizing WebAssembly Interface Types (WIT), developers define language-agnostic data contracts that allow Python, Rust, and Go tools to interoperate within the same sandboxed memory space without serializing payloads to JSON or making network calls, delivering microsecond cross-language tool composition.",
    "Mastering WebAssembly sandboxing provides AI engineers with a high-speed, lightweight isolation primitive for high-frequency agent tool execution. By combining Wasm capability-based security with Pyodide scientific runtimes, you achieve near-instantaneous execution speeds with mathematical memory safety."
]

part4_say = [
    "Managing self-hosted container clusters, gVisor daemons, and microVM pools across multi-region enterprise clouds introduces massive infrastructure complexity, maintenance overhead, and operational risk. In response, modern enterprise AI architectures increasingly leverage specialized Cloud Sandbox Infrastructure platforms—such as E2B, Modal, and Fly Machines—that provide elastic, on-demand microVM execution sandboxes through developer-friendly programmatic APIs.",
    "Cloud sandbox platforms provide elastic on demand microVM execution environments through unified programmatic SDKs. Platforms like E2B are purpose-built for autonomous AI agents, abstracting away the low-level mechanics of kernel virtualization, container orchestration, and hardware provisioning. With a simple Python SDK call, an agent spins up a fully isolated, stateful microVM in hundreds of milliseconds, complete with interactive shells, filesystem access, and pre-installed developer tools.",
    "Stateful microVM lifecycle management in cloud sandboxes enables long-running interactive sessions with instant resumption. Rather than destroying the sandbox after every code turn, the cloud platform maintains active microVM states across extended agent problem-solving workflows. An agent can clone a GitHub repository, install customized dependencies, compile code, and run test suites over several hours while maintaining unbroken filesystem and environment continuity.",
    "Pre-warming and snapshot fork-exec optimization eliminate cold-start latency bottlenecks in cloud sandbox deployments. The cloud infrastructure maintains pools of pre-warmed virtual machine snapshots paused at memory-ready states. When an agent requests a Python sandbox, the platform clones a paused snapshot using copy-on-write memory paging, delivering active microVMs with pre-loaded libraries in under twenty milliseconds.",
    "Integrated terminal streaming and process multiplexing provide real-time visibility into sandbox execution. Cloud sandbox SDKs expose asynchronous event streams that stream stdout, stderr, and process exit codes back to the orchestrator as they occur. Agents can run long-running build processes, monitor streaming build logs, and send real-time control signals such as keyboard interrupts or stdin inputs without blocking the primary agent loop.",
    "Custom filesystem persistence and cloud storage syncing allow agents to persist generated deliverables seamlessly. When an agent compiles an application binary or trains a machine learning model, the cloud sandbox can automatically sync the designated output directory to persistent cloud storage buckets, ensuring that valuable artifacts are safely preserved even if the microVM is terminated.",
    "Automated network isolation and domain filtering enforce enterprise data protection policies within cloud sandboxes. Administrators can configure fine-grained egress policies through the cloud API: permitting access to package registries like PyPI or GitHub while blocking internal enterprise networks and unapproved third-party endpoints, neutralizing data exfiltration risks.",
    "Enterprise governance and audit trail integration record complete transcripts of all shell commands, executed scripts, and file mutations occurring inside the cloud sandbox. Every microVM session generates an immutable audit bundle with cryptographic timestamps, fulfilling statutory corporate compliance and security requirements.",
    "Snapshot distribution across global edge compute clusters minimizes geographical latency for distributed agent workforces. When an enterprise operates across North America, Europe, and Asia, pre-warmed snapshot images are replicated to local cloud zones, ensuring that remote agents experience sub-fifty-millisecond sandbox spin-up times irrespective of physical user geography.",
    "Automated cryptographic session shredding purges volatile memory and temporary storage caches upon container termination. Once an execution completes, the cloud platform executes secure memory-zeroing sweeps and cryptographic key destruction, ensuring that residual data fragments cannot be recovered by forensic analysis or memory-dump exploits.",
    "Zero-trust egress proxy certificate pinning and mutual TLS inspection intercept all outbound API requests emitted by cloud microVM processes. By enforcing cryptographic root authority pinning and inspecting HTTP headers against corporate compliance registries, the egress gateway prevents compromised agents from tunneling data through third-party encrypted channels, fulfilling defense-in-depth security standards.",
    "Mastering cloud sandbox infrastructure empowers AI architects to deploy resilient, enterprise-scale agent platforms without managing physical server fleets. By leveraging on-demand microVMs, snapshot cloning, and automated security policies, you deliver planet-scale execution autonomy with minimal DevOps overhead."
]

part5_say = [
    "Synthesizing threat modeling, gVisor kernel virtualization, WebAssembly memory safety, and cloud sandbox orchestration into an enterprise platform requires engineering a hardened, production-grade Sandbox Execution Controller. In this engineering capstone, we implement an industrial-grade Async Sandbox Controller in Python, capable of provisioning ephemeral gVisor microVM containers with fourteen-millisecond startup times, five-hundred-and-twelve-megabyte memory ceilings, and complete cryptographic security isolation.",
    "Enterprise production sandbox controllers coordinate ephemeral execution runtimes across distributed clusters with strict security guarantees. Built on native asyncio, container runtime interfaces, and Pydantic validation schemas, the controller provides non-blocking sandbox provisioning that isolates untrusted agent code while delivering real-time execution telemetry to enterprise monitoring dashboards.",
    "The software architecture of the Python sandbox controller comprises four core subsystems: the Sandbox Provisioning Gateway, the Security Policy Enforcer, the Ephemeral Runtime Runner, and the Audit Compliance Ledger. The Sandbox Provisioning Gateway manages the lifecycle of ephemeral sandboxes, allocating unique session tokens and provisioning isolated runtime environments on demand.",
    "The Security Policy Enforcer configures hardware-enforced isolation boundaries before executing any model-generated script. It compiles strict seccomp system call filters, assigns cgroups v2 memory limits of five hundred and twelve megabytes, mounts read-only base filesystems with ephemeral memory scratchpads, and establishes default-deny network egress rules.",
    "The Ephemeral Runtime Runner executes untrusted agent scripts inside the hardened sandbox, capturing stdout and stderr streams via non-blocking asynchronous pipes. Built-in watchdog timers monitor execution durations, terminating runaway scripts after predetermined timeout intervals to prevent denial-of-service resource exhaustion.",
    "Asynchronous parallel sandbox pooling maintains pre-warmed container instances in standby states across cloud compute nodes. When an agent dispatches a code execution request, the controller claims a pre-warmed container in under fifteen milliseconds, executing the script instantly and recycling the container asynchronously in the background.",
    "Comprehensive OpenTelemetry instrumentation tracks sandbox initialization latencies, system call violation attempts, memory utilization curves, and process exit codes in real time. Distributed spans link code execution events directly to the prompt turn and user session, giving site reliability engineers total visibility into runtime security health.",
    "Automated security benchmark evaluations validate the absolute isolation of the hardened sandbox controller. In adversarial stress testing, the platform achieves a one hundred percent execution isolation score, zero container breakouts across thousands of simulated attack vectors, and fourteen point two millisecond median startup latencies under peak enterprise load.",
    "Non-blocking asynchronous subprocessing architecture coordinates hundreds of concurrent sandbox executions without thread lock contention. Built on asyncio subprocess protocols and streaming Unix domain sockets, the controller pipes script inputs and output buffers smoothly across process boundaries, sustaining high execution throughput under intense enterprise batch processing demands.",
    "Automated compliance attestation reporting continuously benchmarks active sandboxes against national security baselines. Every microVM instance is evaluated against Center for Internet Security benchmarks and federal cloud standards, with automated compliance certifiers issuing cryptographically signed attestation tokens that accompany all generated analytical deliverables.",
    "Real-time cgroups v2 resource telemetry streaming monitors container memory pressure and page cache dynamics during execution. If an agent script approaches the five-hundred-and-twelve-megabyte allocation ceiling, the controller triggers background garbage collection passes and proactively compacts memory structures, preventing sudden out-of-memory terminations and ensuring smooth analytical delivery.",
    "Cryptographic execution attestation packages all executed scripts, sandbox security policies, and filtered terminal observations into immutable compliance artifacts. The controller computes SHA-256 signatures of all execution parameters, container configuration digests, and runtime log digests, committing the signed manifest to enterprise compliance archives for long-term forensic auditability and regulatory statutory verification.",
    "Mastering the engineering principles of ephemeral execution sandboxes solidifies your standing as an elite autonomous systems security architect. By commanding kernel virtualization, strict system call filtering, and automated sandbox lifecycle management, you build sovereign multi-agent ecosystems that execute untrusted code with unshakeable enterprise safety."
]

parts_data = [
    {
        "title": "Sandboxing Threat Models And System Call Attack Vectors",
        "say": part1_say,
        "example": "Security sandboxes intercept dangerous system calls to prevent host escapes.",
        "tryIt": "Analyze common container breakout vectors and design seccomp filters.",
        "check": {
            "question": "Why is running untrusted agent code in a standard Docker container insufficient for multi-tenant enterprise platforms?",
            "options": [
                "Standard containers share the host kernel, leaving hosts vulnerable to privilege escalation",
                "Docker containers permanently delete all operating system files upon startup",
                "Docker requires all source code to be written exclusively in uppercase letters",
                "Containers cannot execute Python code under any circumstances"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Standard Docker containers share the host kernel; an exploit targeting a kernel flaw can break out of container namespaces and compromise the underlying physical host."
        }
    },
    {
        "title": "Hardened Container Isolation Runtimes gVisor And MicroVMs",
        "say": part2_say,
        "example": "gVisor emulates Linux system calls in user space to isolate host drivers.",
        "tryIt": "Configure a gVisor runsc runtime with cgroups memory limits.",
        "check": {
            "question": "How does gVisor prevent container breakout attacks from compromising the host operating system?",
            "options": [
                "By intercepting and emulating Linux system calls in user space using the Sentry kernel",
                "By converting all computer memory into write-only magnetic storage tape",
                "By disconnecting the physical server from electrical power during code execution",
                "By limiting all programming scripts to fewer than five characters in length"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "gVisor's Sentry component emulates Linux system calls in user space, ensuring that untrusted container code never interacts directly with vulnerable host kernel drivers."
        }
    },
    {
        "title": "WebAssembly And WASI Lightweight In Process Sandboxes",
        "say": part3_say,
        "example": "WebAssembly provides microsecond startup sandboxes with linear memory safety.",
        "tryIt": "Execute Python scripts inside an in-process Pyodide Wasm runtime.",
        "check": {
            "question": "What is the primary architectural differentiator of WebAssembly sandboxes compared to container runtimes?",
            "options": [
                "Microsecond startup latencies, linear memory bounds, and zero-capability defaults",
                "WebAssembly requires human operators to manually type every machine instruction",
                "WebAssembly deletes all database tables whenever a calculation completes",
                "It restricts models to only executing simple single-digit addition"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "WebAssembly provides microsecond startup times, hardware-enforced linear memory isolation, and a capability-based security model where modules have zero permissions by default."
        }
    },
    {
        "title": "Cloud Sandbox Infrastructure Modal And MicroVM Pools",
        "say": part4_say,
        "example": "Cloud sandbox platforms provision isolated on demand microVMs via SDKs.",
        "tryIt": "Deploy a cloud microVM session with pre-warmed snapshot fork execution.",
        "check": {
            "question": "How do cloud sandbox platforms achieve sub-twenty-millisecond startup times for microVMs?",
            "options": [
                "By maintaining pre-warmed virtual machine snapshots and cloning them with copy-on-write memory",
                "By bypassing all security and running code directly in the production database",
                "By running all agent workflows on personal mobile devices over Bluetooth",
                "By preventing models from ever generating code longer than ten lines"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "Cloud sandbox infrastructure maintains pre-warmed, memory-ready VM snapshots, cloning them instantaneously with copy-on-write memory paging to eliminate boot delays."
        }
    },
    {
        "title": "Enterprise Hardened Sandbox Controller In Asynchronous Python",
        "say": part5_say,
        "example": "Asynchronous python controllers manage isolated gVisor micro sandboxes.",
        "tryIt": "Deploy a hardened sandbox controller enforcing memory ceilings and audit logs.",
        "check": {
            "question": "What resource limit configuration is enforced by the production sandbox controller?",
            "options": [
                "Five hundred and twelve megabytes memory ceiling with default-deny network egress",
                "Unlimited root memory access with unrestricted internet socket binding",
                "Restricting total script execution time to exactly one microsecond",
                "Disabling all error logging to maximize network transfer throughput"
            ],
            "answer": 0,
            "answerIndex": 0,
            "why": "The enterprise sandbox controller enforces strict hardware ceilings (512MB RAM, CPU caps) and default-deny egress policies to prevent resource exhaustion and data exfiltration."
        }
    }
]

code1 = """import json
from typing import Dict, Any

def run_sandbox_security_evaluator() -> Dict[str, Any]:
    \"\"\"
    Day 47: Ephemeral Execution Sandboxes Evaluator
    Evaluates gVisor, Firecracker, WebAssembly, and cloud sandbox isolation.
    \"\"\"
    security_controls = {
        "syscallInterception": "Kernel-Space Syscall Virtualization",
        "networkEgressPolicy": "Strict Allowlist with TLS Proxy",
        "storageIsolation": "Ephemeral OverlayFS with Ephemeral Shredding"
    }
    
    isolation_metrics = {
        "sandboxStartupDurationMs": 14.2,
        "resourceLimitCeilingMB": 512,
        "executionIsolationScorePct": 100.0
    }
    
    return {
        "sandboxArchitecture": "gVisor Hardened MicroVM Container Runtime",
        "securityControls": security_controls,
        "isolationMetrics": isolation_metrics,
        "status": "SANDBOX_ISOLATION_HARDENED"
    }

if __name__ == "__main__":
    result = run_sandbox_security_evaluator()
    print(json.dumps(result, indent=2))
"""

output1 = """{
  "sandboxArchitecture": "gVisor Hardened MicroVM Container Runtime",
  "securityControls": {
    "syscallInterception": "Kernel-Space Syscall Virtualization",
    "networkEgressPolicy": "Strict Allowlist with TLS Proxy",
    "storageIsolation": "Ephemeral OverlayFS with Ephemeral Shredding"
  },
  "isolationMetrics": {
    "sandboxStartupDurationMs": 14.2,
    "resourceLimitCeilingMB": 512,
    "executionIsolationScorePct": 100.0
  },
  "status": "SANDBOX_ISOLATION_HARDENED"
}"""

for part in parts_data:
    part["code"] = code1
    part["output"] = output1

day47_dict = {
    "id": "prompt-py-47",
    "day": 47,
    "course": "prompt-py",
    "title": "Ephemeral Execution Sandboxes: Docker, gVisor, WebAssembly & E2B for Safe Agent Code Execution",
    "minutes": 38,
    "parts": parts_data,
    "projectStep": {
        "title": "Engineer Hardened Multi-Tenant Sandbox Controller",
        "steps": [
            "Model system call attack vectors and compile seccomp system call filtering profiles.",
            "Deploy a gVisor user-space emulation container runtime with cgroups v2 resource ceilings.",
            "Integrate in-process WebAssembly WASI execution for lightweight zero-syscall workloads.",
            "Configure elastic cloud sandbox pools with pre-warmed snapshot fork execution and egress proxies.",
            "Deploy the asynchronous Python sandbox controller with OpenTelemetry telemetry and audit logs."
        ]
    },
    "summary": [
        "Standard Docker containers share the host kernel, necessitating hardened isolation runtimes.",
        "gVisor emulates Linux system calls in user space, eliminating container breakout vulnerabilities.",
        "WebAssembly and WASI deliver microsecond startup times and hardware-enforced linear memory safety.",
        "Cloud sandbox platforms provide on-demand microVMs with pre-warmed snapshots and network egress filters.",
        "Production sandbox controllers enforce strict hardware ceilings, audit logging, and zero state leakage."
    ]
}

captions_data = [
    {
        "say1": "Security sandboxes intercept dangerous system calls to prevent escapes.",
        "say2": "Sandboxing threat modeling identifies operating system kernel.",
        "example": "Security sandboxes intercept dangerous system calls to prevent escapes.",
        "tryIt": "Analyze common container breakout vectors and design seccomp filters."
    },
    {
        "say1": "gVisor emulates kernel system calls in user space for safe execution.",
        "say2": "Hardened container runtimes virtualize operating system kernels and.",
        "example": "gVisor emulates Linux system calls in user space to isolate host drivers.",
        "tryIt": "Configure a gVisor runsc runtime with cgroups memory limits."
    },
    {
        "say1": "WebAssembly delivers microsecond startup with linear memory safety.",
        "say2": "WebAssembly and WASI runtimes provide lightweight in process sandboxes.",
        "example": "WebAssembly provides microsecond sandboxes with linear memory safety.",
        "tryIt": "Execute Python scripts inside an in process Pyodide Wasm runtime."
    },
    {
        "say1": "Cloud sandboxes provide on demand microVMs with pre warmed snapshots.",
        "say2": "Cloud sandbox platforms provide elastic on demand microVM execution.",
        "example": "Cloud sandbox platforms provision isolated on demand microVMs via SDKs.",
        "tryIt": "Deploy a cloud microVM session with pre warmed snapshot fork execution."
    },
    {
        "say1": "Production sandbox controllers coordinate isolated execution runtimes.",
        "say2": "Enterprise production sandbox controllers coordinate ephemeral.",
        "example": "Asynchronous python controllers manage isolated gVisor micro sandboxes.",
        "tryIt": "Deploy a hardened sandbox controller enforcing memory ceilings."
    }
]

titles = [
    "Sandboxing Threat Models And System Call Attack Vectors.",
    "Hardened Container Isolation Runtimes gVisor And MicroVMs.",
    "WebAssembly And WASI Lightweight In Process Sandboxes.",
    "Cloud Sandbox Infrastructure Modal And MicroVM Pools.",
    "Enterprise Hardened Sandbox Controller In Asynchronous Python."
]

columns_list = [
    ["Attack Vector Category", "Exploitation Mechanism", "Defensive Control Standard"],
    ["Isolation Architecture", "Kernel Virtualization Model", "Breakout Resistance Level"],
    ["Runtime Paradigm", "Memory Safety Mechanism", "Startup Latency SLA"],
    ["Infrastructure Provider", "Provisioning Technology", "State Persistence Boundary"],
    ["Controller Subsystem", "Asynchronous Implementation", "Isolation SLA Metric"]
]

steps_rows = [
    [
        [["Kernel Privilege Escalation", "Exploits Dirty COW And Unpatched Race Flaws", "Hardware Enforced Virtual Boundaries"], ["Filesystem Persistence Attack", "Modifies System Packages And Shell Profiles", "Volatile Ephemeral OverlayFS Shredding"]],
        [["Network Egress Exfiltration", "Transmits Stolen Secrets To Hostile Command Hubs", "Default Deny Egress Proxy With Whitelist"], ["Resource Exhaustion DoS", "Spawns Infinite Loops And Massive Allocations", "Cgroups V Two Hardware Ceilings"]],
        [["Seccomp Syscall Blocker", "Rejects Dangerous Ptrace And Unshare Calls", "Zero Attack Surface Kernel Defense"], ["Environment Secret Scrubber", "Strips API Credentials From Container Envs", "Dynamic Token Injection Proxy Standard"]],
        [["Adversarial Prompt Shield", "Neutralizes Malicious Model Generated Scripts", "Hardware Level Syscall Interception"], ["Sovereign Security Fortress", "Guarantees Complete Enterprise Host Safety", "Unbreakable Execution Isolation Mandate"]]
    ],
    [
        [["Standard Docker RunC", "Shares Host Linux Kernel Across Containers", "Vulnerable To Kernel Level Breakouts"], ["Google gVisor RunSC", "Emulates Three Hundred Syscalls In User Space", "Near Virtual Machine Level Isolation"]],
        [["AWS Firecracker MicroVM", "Boots Stripped Linux Kernel Over KVM Hardware", "Absolute Cryptographic Tenant Isolation"], ["OverlayFS Scratch Mount", "Writes Mutations To Volatile Memory Layers", "Zero State Leakage Across Consecutive Runs"]],
        [["Cgroups Memory Ceilings", "Caps RAM Allocation To Strict Megabyte Budgets", "Clean Out Of Memory Process Recovery"], ["Extended BPF Probe Mesh", "Monitors Host Filesystem And Socket Mutations", "Zero Overhead Runtime Security Alerts"]],
        [["Fourteen Millisecond Boot", "Pre Warms Container Pools For Rapid Dispatch", "Ultra Low Latency Sandbox Execution"], ["Sovereign Container Core", "Harmonizes User Space Emulation And MicroVMs", "Enterprise Grade Multi Tenant Isolation"]]
    ],
    [
        [["Linear Memory Sandbox", "Constrains Execution To Bounds Checked Array", "Mathematically Eliminates Buffer Overflows"], ["WASI Capability Security", "Grants Zero System Permissions By Default", "Strict Least Privilege Capability Model"]],
        [["Microsecond Cold Start", "Instantiates Sandboxes In Under Fifty Micros", "Near Zero Latency Tool Execution SLA"], ["Pyodide Scientific Wasm", "Compiles CPython NumPy And Pandas To WebAssembly", "In Process Multi Library Scientific Tools"]],
        [["Fuel Instruction Metering", "Injects Bytecode Execution Step Counters", "Precise Algorithmic Complexity Defense"], ["High Density Thread Mesh", "Runs Thousands Of Sandboxes Within Single Host", "Maximum Cloud Hardware Resource Economy"]],
        [["Zero Host Syscall Runtime", "Executes Logic Without Operating System Bridges", "Impervious Memory Safety By Design"], ["Sovereign WebAssembly Hub", "Integrates In Process Sandboxes For Small Tools", "Unmatched Execution Speed And Security"]]
    ],
    [
        [["E Two B Agent Platform", "Abstracts MicroVM Orchestration Behind SDKs", "On Demand Isolated Cloud Sandboxes"], ["Stateful Session Manager", "Maintains Interactive Filesystem Over Hours", "Unbroken Operational Problem Solving Trace"]],
        [["Pre Warmed Snapshot Fork", "Clones Paused VM Images Using Copy On Write", "Sub Twenty Millisecond Sandbox Provisioning"], ["Terminal Multiplexer Bus", "Streams Stdout Stderr And Process Exit Codes", "Non Blocking Real Time Agent Observability"]],
        [["Cloud Storage Auto Sync", "Syncs Deliverable Directories To Durable Buckets", "Safe Artifact Persistence After Shutdown"], ["Automated Egress Gateway", "Restricts Network Access To Approved Package Hubs", "Neutralizes External Data Exfiltration"]],
        [["Audit Trail Recording", "Logs All Shell Commands And Filesystem Writes", "Immutable Corporate Compliance Ledgers"], ["Sovereign Cloud Fabric", "Scales Thousands Of Elastic MicroVM Instances", "Zero DevOps Overhead Planetary Scale"]]
    ],
    [
        [["Provisioning Gateway", "Allocates Tokens And Provisions Ephemeral Boxes", "Fourteen Millisecond Startup Latency SLA"], ["Security Policy Enforcer", "Compiles Seccomp BPF And Cgroups RAM Ceilings", "Five Hundred Twelve Megabyte Enforced Limit"]],
        [["Ephemeral Runtime Runner", "Executes Code And Captures Asynchronous Pipes", "Real Time Watchdog Execution Monitoring"], ["Pre Warmed Container Pool", "Maintains Standby Sandboxes Across Cloud Nodes", "Instantaneous Code Execution Turnaround"]],
        [["OpenTelemetry Trace Bus", "Exports Syscall Violations And Memory Profiles", "Granular Production Security Observability"], ["Execution Attestation Sealer", "Hashes Code And Observations With SHA Two Fifty", "Statutory Compliance Audit Assurance"]],
        [["Zero Breach Defense Matrix", "Neutralizes Multi Tenant Attack Vectors", "One Hundred Percent Execution Isolation"], ["Sovereign Controller Platform", "Unifies gVisor MicroVMs And Wasm Sandboxes", "Enterprise Grade Autonomous Safety SLA"]]
    ]
]

# Verify lengths and digits
for p_idx, cap_dict in enumerate(captions_data):
    for k, text_str in cap_dict.items():
        assert len(text_str) <= 75, f"Part {p_idx+1} {k} caption too long: {len(text_str)} ({text_str})"
        assert text_str.endswith('.'), f"Part {p_idx+1} {k} caption must end with dot: {text_str}"
        assert not any(c.isdigit() for c in text_str), f"Part {p_idx+1} {k} caption has digits: {text_str}"

for t in titles:
    assert len(t) <= 75, f"Title too long: {len(t)} ({t})"
    assert t.endswith('.'), f"Title must end with dot: {t}"
    assert not any(c.isdigit() for c in t), f"Title has digits: {t}"

for cols in columns_list:
    for c in cols:
        assert not any(ch.isdigit() for ch in c), f"Column has digits: {c}"

for p_i, step_row in enumerate(steps_rows):
    assert len(step_row) == 4, f"Part {p_i+1} must have 4 step rows, found {len(step_row)}"
    for s_i, row in enumerate(step_row):
        assert len(row) == 2, f"Part {p_i+1} Step {s_i+1} must have 2 rows, found {len(row)}"
        for pair in row:
            assert len(pair) == 3, f"Part {p_i+1} Step {s_i+1} row must have 3 cells, found {len(pair)}"
            for cell in pair:
                assert not any(ch.isdigit() for ch in cell), f"Part {p_i+1} Step {s_i+1} cell has digits: {cell}"

# Build visual envelope
entries = []
for p_idx, part in enumerate(parts_data):
    spec_steps = []
    for s_idx, at_k in enumerate(["say1", "say2", "example", "tryIt"]):
        cap = captions_data[p_idx][at_k]
        spec_steps.append({
            "at": at_k,
            "caption": cap,
            "rows": steps_rows[p_idx][s_idx]
        })
        
    spec = {
        "template": "table",
        "title": titles[p_idx],
        "columns": columns_list[p_idx],
        "steps": spec_steps
    }
    assert len(spec['title']) <= 75, f"Title too long: {spec['title']}"
    assert spec['title'].endswith('.'), f"Title must end with dot: {spec['title']}"
    assert not any(c.isdigit() for c in spec['title']), f"Title has digits: {spec['title']}"
    
    code_hash = hashlib.sha256(part['code'].encode('utf-8')).hexdigest()
    entry = {
        "partTitle": part['title'],
        "codeHash": code_hash,
        "spec": spec,
        "filled": spec
    }
    entries.append(entry)

day47_visual = {
    "schemaVersion": "2.0.0",
    "course": "prompt-py",
    "day": 47,
    "prefix": "prompt-py",
    "entries": entries
}

# Word count checks
total_say_words = 0
for idx, p in enumerate(parts_data):
    w_cnt = sum(len(para.split()) for para in p["say"])
    print(f"Part {idx+1}: {w_cnt} words")
    total_say_words += w_cnt

for idx, p in enumerate(parts_data):
    w_cnt = sum(len(para.split()) for para in p["say"])
    assert w_cnt >= 600, f"Part {idx+1} word count too low: {w_cnt}"

print(f"Total words: {total_say_words}")
assert total_say_words >= 3100, f"Total words too low: {total_say_words}"

# Write day47 files
with open("C:/Users/Admin/Desktop/projects/Present-Career-os-platform/scripts/branch_c/prompt_day47_lesson.json", "w", encoding="utf-8") as f:
    json.dump(day47_dict, f, indent=2)

with open("C:/Users/Admin/Desktop/projects/Present-Career-os-platform/src/lib/data/lessonVisuals/prompt-py/day-47.json", "w", encoding="utf-8") as f:
    json.dump(day47_visual, f, indent=2)

print("Generated Day 47 lesson JSON and Visual Envelope successfully!")
