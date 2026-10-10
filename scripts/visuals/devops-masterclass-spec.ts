// scripts/visuals/devops-masterclass-spec.ts
// Exhaustive 60-Day Masterclass Specification for DevOps & CI/CD Pipeline Automation (course-devops-cicd)
// Total Quests: 240 Quests (Month 1: 120 Quests, Month 2: 120 Quests)
// Conforming strictly to Gate v2 semantic standard, 3-Tier Socratic Hint Ladders, and FAANG/Staff SRE rubrics.

import { MasterclassDaySpec } from './java-masterclass-spec';

export const DEVOPS_MONTH_1_SPECS: MasterclassDaySpec[] = [
  // ─── BLOCK 1: Systems Foundations & Container Runtimes (Days 1–5) ────────────────
  {
    day: 1,
    month: 1,
    blockNum: 1,
    title: "DevOps Culture, CI/CD Feedback Loops & The 12-Factor App Architectural Invariants",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (DevOps Principles & 12-Factor Methodology)",
    spokenGoal: "Deconstruct the foundational mindset of modern DevOps: master the 12-Factor App methodology, continuous integration feedback loops, and why decoupling configuration from code is the first law of cloud-native delivery.",
    conceptInvariant: "Factor III Invariant: An application codebase must be strictly identical across all deployment environments (Dev, Staging, Prod); environment variation must be injected strictly through operating system environment variables, never hardcoded in artifacts.",
    failureMode: "Baking environment-specific database connection strings (`localhost:5432` vs `prod-db.internal`) directly into compiled container images, causing Staging tests to overwrite production databases.",
    tryItFriction: "Refactor a monolithic Node.js/Python server that reads from local JSON config files to validate and ingest configuration exclusively via strict `process.env` schema definitions.",
    socraticHints: [
      "Why must compiled container images never contain environment-specific configuration?",
      "Because the exact same immutable container artifact must be promoted from Dev to Staging to Prod!",
      "Inject configuration exclusively via environment variables or external secret mounts at runtime."
    ],
    situationalPuzzle: {
      scenario: "A startup's deployment pipeline compiles a Docker image with an embedded `.env.production` file. A junior developer runs the image locally to debug a ticket, inadvertently running database migration scripts that truncate tables on the live production database. What architectural principle was violated?",
      options: [
        "The developer should not have been hired.",
        "Factor III (Config Separation): Storing secrets and environment configs inside compiled build artifacts violates immutability and leads to catastrophic cross-environment data contamination.",
        "Docker does not support `.env` files.",
        "The production database needed more CPU cores."
      ],
      answerIdx: 1,
      debrief: "The 12-Factor App requires strict separation of configuration from code. Build artifacts must be strictly environment-agnostic; configuration must be injected dynamically by the orchestrator at container launch."
    },
    quests: [
      { id: "devops-m1-d01-q1", name: "12-Factor App Architectural Truth Matrix", type: "concept", desc: "Map the 12 factors across modern cloud-native deployment pipelines: Codebase, Dependencies, Config, Backing Services." },
      { id: "devops-m1-d01-q2", name: "Detective Lab: The Hardcoded Production Secret Breach", type: "detective", desc: "Extract hardcoded database credentials from a compiled binary and refactor to strict 12-Factor environment injection." },
      { id: "devops-m1-d01-q3", name: "Mastery Assignment: 12-Factor Strict Environment Validator Engine", type: "assignment", desc: "Build a pre-flight runtime validator in TypeScript that asserts all required environment variables with Zod schemas." },
      { id: "devops-m1-d01-q4", name: "Production Incident Lab: Accidental Staging-to-Production Contamination", type: "detective", desc: "Triage a live incident where a local developer run accidentally executed migrations against production infrastructure." }
    ]
  },
  {
    day: 2,
    month: 1,
    blockNum: 1,
    title: "Linux Systems Administration: POSIX Process Model, Signals (SIGTERM, SIGKILL) & systemd Daemons",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Operating System Mechanics & Process Lifecycle)",
    spokenGoal: "Master the Linux operating system foundations powering every container: explore the POSIX process hierarchy, PID 1 responsibility, signal handling (`SIGTERM` vs `SIGKILL`), file descriptors, and systemd service daemons.",
    conceptInvariant: "When an orchestrator stops a container, it sends `SIGTERM` (signal 15) giving the process a grace period (typically 30s) to finish active requests and close sockets. If the application ignores `SIGTERM`, the kernel forcibly executes uncatchable `SIGKILL` (signal 9), causing dropped in-flight transactions.",
    failureMode: "Running a Node.js or Python application as PID 1 without a signal handler; when Kubernetes scales down the pod, the process ignores `SIGTERM`, gets hard-killed by `SIGKILL` 30s later, and corrupts active customer payment writes.",
    tryItFriction: "Write a Linux shell script trapping `SIGTERM` that closes an open HTTP server, drains active connections, and exits with code 0 in under 3 seconds.",
    socraticHints: [
      "Can a process intercept or handle a `SIGKILL` signal?",
      "No! `SIGKILL` is handled directly by the Linux kernel and terminates the process immediately.",
      "Applications must listen for `SIGTERM` (`kill -15`), stop accepting new requests, drain active sockets, and exit cleanly."
    ],
    situationalPuzzle: {
      scenario: "During an automated rolling deployment on Kubernetes, users report intermittent HTTP 502 Bad Gateway errors. Server logs show the backend processes exited with code 137 (`128 + 9 = SIGKILL`). The application had zero signal handlers configured. Why did users receive 502 errors?",
      options: [
        "Kubernetes cannot run rolling deployments without downtime.",
        "Ungraceful Process Termination: The application ignored `SIGTERM`, continued accepting requests during pod shutdown, and was violently terminated by the kernel with `SIGKILL` after 30 seconds, severing active HTTP connections.",
        "The Linux kernel ran out of memory.",
        "The ingress controller lost its license."
      ],
      answerIdx: 1,
      debrief: "Exit code 137 indicates a process was killed by `SIGKILL` (signal 9). When an application fails to trap `SIGTERM` and drain active connections during rolling updates, the orchestrator forcibly terminates it after the termination grace period, dropping in-flight client requests."
    },
    quests: [
      { id: "devops-m1-d02-q1", name: "POSIX Process Hierarchy & Signal Dispatch Mechanics", type: "concept", desc: "Trace fork/exec system calls, PID 1 zombie process reaping, file descriptor tables, and signal numbers." },
      { id: "devops-m1-d02-q2", name: "Detective Lab: The Zombie Process Accumulation Bug", type: "detective", desc: "Diagnose an orphaned child process leak in a container running without an init process (tini/dumb-init)." },
      { id: "devops-m1-d02-q3", name: "Mastery Assignment: Graceful Shutdown Signal Handler & Connection Drainer", type: "assignment", desc: "Implement a production HTTP server signal trap handling `SIGINT` and `SIGTERM` with active socket draining." },
      { id: "devops-m1-d02-q4", name: "Production Incident Lab: Exit Code 137 Mid-Transaction Crash Triage", type: "detective", desc: "Resolve a rolling deployment outage where database transactions were aborted mid-flight by unhandled termination signals." }
    ]
  },
  {
    day: 3,
    month: 1,
    blockNum: 1,
    title: "Docker Engine Internals: Linux Namespaces, cgroups v2, Copy-on-Write (overlay2) & Layer Caching",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Container Virtualization & Storage Drivers)",
    spokenGoal: "Deconstruct what a container actually is: understand that containers are NOT virtual machines, but standard Linux processes isolated by kernel Namespaces (PID, Mount, Net, IPC, UTS, User), throttled by cgroups v2, and packaged using copy-on-write `overlay2` filesystems.",
    conceptInvariant: "Docker builds images as a series of read-only immutable layers. If a layer instruction (`COPY package.json .`) does not change, Docker reuses the cached layer. Placing frequently changing code (`COPY . .`) BEFORE dependency installation invalidates the cache, forcing full reinstalls on every build.",
    failureMode: "Placing `COPY . .` on line 2 of a Dockerfile followed by `RUN npm install`, forcing CI runners to redownload 400MB of dependencies on every single git commit, increasing build times from 15 seconds to 8 minutes.",
    tryItFriction: "Reorder a broken Dockerfile to optimize layer caching: isolate dependency manifests (`package.json`, `package-lock.json`) before application source code, verifying sub-second cache hits on code changes.",
    socraticHints: [
      "Why should you copy dependency lockfiles BEFORE copying your application source code?",
      "Because lockfiles change rarely, but source code changes on every commit!",
      "If Docker detects source code changes in an early layer, all subsequent layers must be rebuilt from scratch."
    ],
    situationalPuzzle: {
      scenario: "A developer claims that Docker containers are 'just like VMware VMs because they run their own Linux kernel'. How does a Staff DevOps Architect definitively disprove this statement using Linux kernel inspection?",
      options: [
        "Containers use slower CPUs than VMware.",
        "Shared Host Kernel: Inspecting `/proc` from inside a container reveals it shares the exact same kernel version, memory page tables, and system call interface as the host OS; isolation is provided by Namespaces and cgroups, not hardware virtualization.",
        "Docker is written in Go while VMware is written in C++.",
        "VMware requires internet access while Docker does not."
      ],
      answerIdx: 1,
      debrief: "Containers are not virtual machines; they share the host's Linux kernel directly. Isolation is enforced through kernel primitives: Namespaces partition what a process can see (processes, mounts, network interfaces), while cgroups control how much hardware resources it can consume."
    },
    quests: [
      { id: "devops-m1-d03-q1", name: "Linux Container Primitives: Namespaces, cgroups & overlay2", type: "concept", desc: "Trace Mount, PID, and Network namespaces and inspect the lowerdir, upperdir, and merged mount of overlay2." },
      { id: "devops-m1-d03-q2", name: "Detective Lab: The Layer Cache Invalidation Disaster", type: "detective", desc: "Profile an 11-minute CI build and restructure Dockerfile directives to achieve a 20-second cached build." },
      { id: "devops-m1-d03-q3", name: "Mastery Assignment: Docker Buildkit High-Performance Layer Architecture", type: "assignment", desc: "Author a Dockerfile leveraging Buildkit cache mounts (`--mount=type=cache`) to preserve package manager caches." },
      { id: "devops-m1-d03-q4", name: "Production Incident Lab: overlay2 Disk Space Exhaustion Emergency", type: "detective", desc: "Triage a host node failure where unpruned dangling container layers filled the root partition to 100%." }
    ]
  },
  {
    day: 4,
    month: 1,
    blockNum: 1,
    title: "Docker Multi-Stage Builds: Buildkit Cache Mounts, Scratch Images & Minimal Distroless Runfiles",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "High Guidance (Production Image Optimization & Attack Surface Reduction)",
    spokenGoal: "Shrink production container images from gigabytes to megabytes: master multi-stage Docker builds, separate build-time SDKs from runtime artifacts, and build tiny, hardened images using Google Distroless or `scratch` with zero package managers or shells.",
    conceptInvariant: "Build tools (compilers, npm, pip, git, gcc) belong exclusively in the builder stage. Production runtime images must contain ONLY the compiled binary and minimal runtime libraries. If a shell (`/bin/sh`) or package manager (`apt`, `apk`) exists in production, an attacker has an immediate foothold for remote code execution.",
    failureMode: "Shipping a 1.4GB Ubuntu-based container to production containing gcc, git, curl, and python; an attacker exploiting an SQL injection runs `curl` to download a reverse shell binary and gains full cluster access.",
    tryItFriction: "Transform a 1.2GB monolithic Node.js/Go Dockerfile into a 45MB multi-stage Distroless image with zero operating system vulnerabilities.",
    socraticHints: [
      "Why is a 30MB Distroless container image more secure than a 1GB Ubuntu image?",
      "No package managers, no shell (`/bin/sh`), and 95% fewer CVE vulnerabilities!",
      "Attackers cannot download tools or execute arbitrary shell scripts if no shell binary exists in the image."
    ],
    situationalPuzzle: {
      scenario: "A security scanner flags 42 Critical CVEs in a production web service container. The container was built using `FROM node:18`. The developer attempts to fix it by running `apt-get upgrade`, but the image grows to 1.8GB and still contains 12 CVEs. What is the production-grade architectural solution?",
      options: [
        "Ignore the CVE warnings since the service is behind a firewall.",
        "Multi-Stage Build with Distroless / Alpine: Build dependencies in a `builder` stage, copy only the compiled `/dist` directory and production node_modules into `gcr.io/distroless/nodejs18-debian11`, reducing image size to 65MB and CVEs to zero.",
        "Delete the Dockerfile and deploy directly to EC2.",
        "Run the container with `--privileged` flag."
      ],
      answerIdx: 1,
      debrief: "Full base images like `node:18` bundle entire Debian operating systems with hundreds of unnecessary binaries. Multi-stage builds discard the build environment and package only application artifacts into minimal Distroless runtimes, eliminating shell attack vectors."
    },
    quests: [
      { id: "devops-m1-d04-q1", name: "Multi-Stage Build Mechanics & OCI Image Footprint Analysis", type: "concept", desc: "Compare Alpine, Distroless, and scratch base images; calculate attack surface and layer reduction." },
      { id: "devops-m1-d04-q2", name: "Detective Lab: The Bloated Production Build Artifact Scrub", type: "detective", desc: "Audit a Dockerfile shipping devDependencies, compilers, and test suites to production and refactor to 2 stages." },
      { id: "devops-m1-d04-q3", name: "Mastery Assignment: Hardened Distroless Multi-Stage Microservice Spec", type: "assignment", desc: "Author an immutable multi-stage Dockerfile for a TypeScript service with non-root user execution." },
      { id: "devops-m1-d04-q4", name: "Production Incident Lab: In-Container Shell Exploit Attack Post-Mortem", type: "detective", desc: "Trace an attacker exploiting an in-container `curl` binary and enforce image immutability via scratch containers." }
    ]
  },
  {
    day: 5,
    month: 1,
    blockNum: 1,
    title: "⭐ MILESTONE 1: High-Availability Multi-Container Microservices Topology with Docker Compose",
    stageName: "Stage 1: Mental Model Grounding",
    stageNum: 1,
    pedagogicalRole: "Integrative Milestone Synthesis (Local Multi-Container Architecture)",
    spokenGoal: "Architect and prove your first local multi-container system: construct a complete microservices topology using Docker Compose featuring an Nginx reverse proxy, frontend web app, Node.js API, PostgreSQL database, and Redis cache with isolated networks and healthchecks.",
    conceptInvariant: "Container startup order must be decoupled from service readiness. Declaring `depends_on: [db]` only waits for the database container to start, NOT for PostgreSQL to be ready to accept SQL queries. Services must use healthchecks (`condition: service_healthy`) to prevent startup crashes.",
    failureMode: "An API container booting and attempting to connect to PostgreSQL before PostgreSQL has finished initializing its tables, causing the API to crash and exit immediately.",
    tryItFriction: "Configure Docker Compose `depends_on` with `condition: service_healthy` backed by `pg_isready -U postgres`, ensuring the API container only starts when the database is truly accepting queries.",
    socraticHints: [
      "Does `depends_on: [db]` in Docker Compose guarantee the database is ready for connections?",
      "No! It only waits for the container process to launch, which takes less than 1 second, while PostgreSQL initialization takes 5-10 seconds.",
      "Use `depends_on: { db: { condition: service_healthy } }` with a database healthcheck probe."
    ],
    situationalPuzzle: {
      scenario: "A developer spins up a local Docker Compose stack. The API service crashes on startup with `ECONNREFUSED 127.0.0.1:5432`. In the code, the database host is configured as `localhost`. Both the API and Postgres containers are running on the same Docker bridge network. Why did the connection fail?",
      options: [
        "Postgres cannot run in Docker.",
        "Container Network Namespace Isolation: Inside a container, `localhost` refers to the container's own isolated network loopback interface, NOT the host or other containers; the API must use the service name (`db` or `postgres`) as the hostname.",
        "Port 5432 is blocked by Docker.",
        "The developer must buy a Docker Pro license."
      ],
      answerIdx: 1,
      debrief: "Each container has its own private network namespace. Inside the API container, `localhost` (127.0.0.1) points to itself. On Docker bridge networks, containers resolve peer containers using Docker's embedded DNS server via their service names (e.g., `postgres:5432`)."
    },
    quests: [
      { id: "devops-m1-d05-q1", name: "Milestone Architecture: Multi-Tier Docker Compose Topology", type: "concept", desc: "Design network isolation: public frontend network vs private backend/database network." },
      { id: "devops-m1-d05-q2", name: "Detective Lab: The Race Condition Startup Crash Cascade", type: "detective", desc: "Fix an intermittent compose startup crash by attaching proper TCP and database healthcheck conditions." },
      { id: "devops-m1-d05-q3", name: "Mastery Assignment: Enterprise Multi-Container Production Compose Spec", type: "assignment", desc: "Author a complete docker-compose.yml with volume persistence, resource limits, and secrets isolation." },
      { id: "devops-m1-d05-q4", name: "Production Incident Lab: Unpersisted Volume Data Loss Emergency", type: "detective", desc: "Recover from an incident where `docker compose down -v` accidentally wiped local persistent storage." }
    ]
  },

  // ─── BLOCK 2: Container Security, Networking & GitHub Actions CI (Days 6–10) ─────
  {
    day: 6,
    month: 1,
    blockNum: 2,
    title: "Container Networking: Bridge vs Host Drivers, DNS Service Discovery & Port Ingress Mappings",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Core Networking Architecture (Virtual Switches & DNS Resolution)",
    spokenGoal: "Master container networking under the hood: explore Linux `veth` virtual ethernet pairs, bridge interfaces (`docker0`), iptables NAT packet forwarding, embedded Docker DNS (127.0.0.11), and host vs bridge networking performance trade-offs.",
    conceptInvariant: "In user-defined bridge networks, Docker provides automatic service discovery via embedded DNS (127.0.0.11). In the default legacy `bridge` network, automatic DNS is disabled, forcing brittle IP addressing or deprecated `--link` flags.",
    failureMode: "Running containers on the default legacy bridge network and attempting to connect via service name (`http://backend:8080`), failing with hostname resolution errors.",
    tryItFriction: "Create a custom Docker network (`docker network create app-net`) and inspect the virtual ethernet interfaces (`ip link`) created by the Linux kernel.",
    socraticHints: [
      "Why can containers communicate by name on custom networks but NOT on the default `bridge` network?",
      "Custom user-defined bridge networks enable Docker's embedded DNS server (127.0.0.11)!",
      "Always create a custom user-defined network for multi-container applications."
    ],
    situationalPuzzle: {
      scenario: "A high-frequency trading API processes 100,000 requests/sec. The team notices a 15% latency penalty when running in Docker compared to bare metal. Network profiling reveals CPU overhead in Linux `iptables` and connection tracking (`conntrack`). Which Docker networking mode eliminates this overhead for ultra-low latency workloads?",
      options: [
        "None; Docker cannot be used for trading.",
        "Host Network Mode (`--network host`): Host mode removes the virtual bridge, veth pairs, and iptables NAT entirely, allowing the container to bind directly to the host's physical network interface with zero virtualization overhead.",
        "Overlay network mode.",
        "Macvlan with default MTU."
      ],
      answerIdx: 1,
      debrief: "Standard bridge networking routes packets through virtual ethernet pairs (`veth`) and kernel iptables NAT, adding latency under extreme packet rates. Host networking binds the container process directly to the host's network namespace, eliminating NAT overhead."
    },
    quests: [
      { id: "devops-m1-d06-q1", name: "Linux veth Pairs & iptables NAT Packet Forwarding Pipeline", type: "concept", desc: "Trace packet traversal from container eth0 -> veth peer -> docker0 bridge -> host eth0 with MASQUERADE rules." },
      { id: "devops-m1-d06-q2", name: "Detective Lab: The Default Bridge DNS Resolution Failure", type: "detective", desc: "Resolve a microservice network partition caused by running containers on the legacy default bridge." },
      { id: "devops-m1-d06-q3", name: "Mastery Assignment: Isolated Multi-Network Microservice Topology", type: "assignment", desc: "Configure a dual-network Docker Compose setup isolating frontend web tier from backend payment database." },
      { id: "devops-m1-d06-q4", name: "Production Incident Lab: Linux conntrack Table Saturation Outage", type: "detective", desc: "Triage a production network drop storm caused by kernel connection tracking table exhaustion under load." }
    ]
  },
  {
    day: 7,
    month: 1,
    blockNum: 2,
    title: "Container Security Hardening: Rootless Podman/Docker, User Namespaces & Read-Only Root Filesystems",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Core Security Architecture (Container Hardening & Least Privilege)",
    spokenGoal: "Harden containers against root escape vulnerabilities: master non-root execution (`USER 10001`), rootless Docker/Podman engines, Linux User Namespaces (mapping container UID 0 to unprivileged host UID 100000), dropping capabilities (`--cap-drop=ALL`), and read-only root filesystems.",
    conceptInvariant: "By default, root inside a container is root on the host kernel (UID 0). If a container runs as root and an attacker achieves a container breakout (e.g., via runc CVE-2019-5736), the attacker gains full root control over the physical host operating system.",
    failureMode: "Running containers as the default root user with write access to `/etc`. An attacker uploads a web shell and replaces system libraries to execute arbitrary host commands.",
    tryItFriction: "Launch a container with `--read-only`, `--cap-drop=ALL`, and an explicit non-root user (`--user 10001:10001`), mounting a writable `tmpfs` volume strictly at `/tmp` for ephemeral caching.",
    socraticHints: [
      "If a process inside a container runs as UID 0 (root), what UID does it map to on the host kernel by default?",
      "UID 0 (Root)! Unless User Namespaces are enabled, container root IS host root.",
      "Always declare `USER appuser` in your Dockerfile and drop unnecessary Linux capabilities."
    ],
    situationalPuzzle: {
      scenario: "A security audit requires all production containers to run with a read-only root filesystem (`read-only: true`). When the developer enables this, the Node.js application crashes immediately on startup because it cannot write temporary lockfiles to `/tmp`. How should this be resolved without making the root filesystem writable?",
      options: [
        "Disable the read-only requirement.",
        "Mount an Ephemeral tmpfs Volume at `/tmp`: A `tmpfs` volume provides in-memory writable scratch space at `/tmp` while keeping the entire rest of the container root filesystem strictly read-only and immutable.",
        "Run the container as root.",
        "Store lockfiles in the database."
      ],
      answerIdx: 1,
      debrief: "A read-only root filesystem prevents attackers from modifying binaries or dropping malware. Applications requiring temporary storage (like `/tmp` or caches) should mount a memory-backed `tmpfs` volume specifically at those paths while leaving the root immutable."
    },
    quests: [
      { id: "devops-m1-d07-q1", name: "Linux Capabilities & User Namespace UID/GID Mapping", type: "concept", desc: "Analyze the 38 Linux capabilities (CAP_SYS_ADMIN, CAP_NET_ADMIN) and user namespace mapping files." },
      { id: "devops-m1-d07-q2", name: "Detective Lab: The Privileged Root Container Breakout Threat", type: "detective", desc: "Audit a Dockerfile running as root and refactor to strict non-root UID 10001 with dropped capabilities." },
      { id: "devops-m1-d07-q3", name: "Mastery Assignment: Read-Only Root Filesystem & tmpfs Mount Spec", type: "assignment", desc: "Author a hardened container configuration running read-only with explicit tmpfs mounts and no-new-privileges." },
      { id: "devops-m1-d07-q4", name: "Production Incident Lab: Host Device Compromise Post-Mortem", type: "detective", desc: "Triage a simulated container escape caused by mounting the host Docker socket (`/var/run/docker.sock`)." }
    ]
  },
  {
    day: 8,
    month: 1,
    blockNum: 2,
    title: "Container Resiliency: Healthchecks, OOM Killer Scores, Resource Limits & Restart Policies",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Core Resiliency Engineering (cgroups Resource Governance)",
    spokenGoal: "Prevent noisy neighbors from taking down your infrastructure: master Docker cgroups resource limits (`--memory`, `--cpus`), memory swap constraints, Linux Out-Of-Memory (OOM) killer scores (`oom_score_adj`), container healthchecks, and restart policies.",
    conceptInvariant: "If a container does not have an explicit memory limit (`--memory=512m`), a memory leak in that single container can consume 100% of physical host RAM. When host RAM exhausts, the Linux kernel OOM Killer awakens and terminates random host processes, including the Docker daemon or database.",
    failureMode: "Deploying a microservice with a memory leak without cgroups memory limits, causing the Linux kernel to kill the host SSH daemon and database server when physical memory hit 100%.",
    tryItFriction: "Run a container with a strict 256MB memory limit (`--memory=256m --memory-swap=256m`) and run an intentional memory leak script, observing the container terminate cleanly with exit code 137 without impacting the host.",
    socraticHints: [
      "What happens when a container exceeds its cgroups memory limit?",
      "The kernel OOM Killer immediately terminates the container process with exit code 137 (`128 + 9 = SIGKILL`).",
      "Because the limit was enforced at the cgroup level, the physical host and all peer containers remain completely healthy!"
    ],
    situationalPuzzle: {
      scenario: "A microservice container starts in Docker Compose with `restart: always`. Due to a missing database credential, the process crashes immediately upon startup (10ms). Docker immediately restarts it in an infinite loop, executing 100 crashes per second, consuming 100% host CPU in process fork overhead. What restart policy or mechanism stops this thrashing?",
      options: [
        "Delete Docker.",
        "Restart Policy with Backoff / `restart: on-failure:5`: Using `on-failure` with a maximum retry limit caps restart attempts, preventing tight-loop CPU starvation, or using healthchecks to gate dependency readiness.",
        "Increase host CPU.",
        "Run the container without restart policies."
      ],
      answerIdx: 1,
      debrief: "`restart: always` restarts the container unconditionally, even if it crashes in milliseconds. In misconfigured environments, this causes 'crash-loop thrashing' that consumes CPU cycles. Using `on-failure` with retry caps or orchestrator backoff limits prevents fork starvation."
    },
    quests: [
      { id: "devops-m1-d08-q1", name: "cgroups v2 Resource Accounting & Linux OOM Killer Mechanics", type: "concept", desc: "Trace `memory.max`, `memory.current`, CPU quota periods (`cpu.cfs_quota_us`), and `oom_score_adj` values." },
      { id: "devops-m1-d08-q2", name: "Detective Lab: The Unbounded Memory Leak Host Freezing Outage", type: "detective", desc: "Isolate a container consuming all host RAM and apply strict memory and swap ceilings." },
      { id: "devops-m1-d08-q3", name: "Mastery Assignment: Production Resource Budget & Healthcheck Spec", type: "assignment", desc: "Author a Docker Compose configuration establishing CPU/RAM limits, reservations, and deep health probes." },
      { id: "devops-m1-d08-q4", name: "Production Incident Lab: Crash-Loop CPU Starvation Triage", type: "detective", desc: "Resolve a server hang caused by 10 containers restarting in tight loops following a shared secrets failure." }
    ]
  },
  {
    day: 9,
    month: 1,
    blockNum: 2,
    title: "GitHub Actions CI Foundations: Workflow Syntax, Job Matrix, Runner Environments & Secrets Stores",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "CI/CD Pipeline Architecture (Automated Workflow Engineering)",
    spokenGoal: "Build world-class Continuous Integration pipelines: master GitHub Actions workflow syntax (`.github/workflows`), event triggers (`push`, `pull_request`), virtual environments (Ubuntu, macOS, Windows), dependency caching (`actions/cache`), and secure secret injection.",
    conceptInvariant: "Pull Request workflows triggered by `pull_request_target` run with repository write permissions and access to secrets. Using `pull_request_target` on untrusted fork pull requests allows attackers to modify code and exfiltrate repository secrets via workflow echo steps.",
    failureMode: "Using `pull_request_target` and checking out the PR head (`ref: ${{ github.event.pull_request.head.sha }}`), allowing an external contributor to submit a PR containing a bash script that prints all corporate API keys.",
    tryItFriction: "Write a GitHub Actions CI workflow that triggers on pull requests to `main`, executes linting and unit tests in parallel jobs, and uses `actions/cache` to cache npm dependencies by lockfile hash.",
    socraticHints: [
      "What is the security danger of using `pull_request_target` with external contributors?",
      "It grants repository secrets to code written by an external, unvetted contributor!",
      "Always use standard `on: pull_request` which runs with read-only permissions and zero access to secrets."
    ],
    situationalPuzzle: {
      scenario: "A developer builds a CI workflow that runs `npm install` on every commit. The workflow takes 6 minutes to complete, with 5 minutes spent downloading packages from npm. How should the pipeline be optimized to complete in under 45 seconds?",
      options: [
        "Skip running tests in CI.",
        "Implement `actions/cache` or `actions/setup-node` caching: Cache the `~/.npm` or `node_modules` directory using a cache key based on `hashFiles('**/package-lock.json')`, skipping downloads on cache hits.",
        "Commit `node_modules` into the git repository.",
        "Pay for GitHub Enterprise faster runners."
      ],
      answerIdx: 1,
      debrief: "Package downloads dominate CI runtimes. Using `actions/setup-node` with `cache: 'npm'` or explicit `actions/cache` keyed on `package-lock.json` hash reuses dependencies across runs, reducing install times from minutes to seconds."
    },
    quests: [
      { id: "devops-m1-d09-q1", name: "GitHub Actions Runtime Lifecycle & Runner Architecture", type: "concept", desc: "Trace workflow evaluation, job execution graphs, step environments, and runner virtual machines." },
      { id: "devops-m1-d09-q2", name: "Detective Lab: The Secret-Exfiltrating Fork Pull Request Bug", type: "detective", desc: "Audit an insecure `pull_request_target` workflow and refactor to safe least-privilege `pull_request` execution." },
      { id: "devops-m1-d09-q3", name: "Mastery Assignment: High-Speed Cached Multi-Job CI Pipeline", type: "assignment", desc: "Author a production GitHub Actions YAML workflow with parallel lint, typecheck, and test jobs with caching." },
      { id: "devops-m1-d09-q4", name: "Production Incident Lab: CI Runner Secret Masking Bypass Recovery", type: "detective", desc: "Triage a security incident where base64-encoded secrets bypassed GitHub Actions output masking." }
    ]
  },
  {
    day: 10,
    month: 1,
    blockNum: 2,
    title: "CI Test Automation: Parallel Execution, Caching Strategies & Failure Flakiness Detection",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 2,
    pedagogicalRole: "Core Test Engineering (Parallel Matrix & Flakiness Elimination)",
    spokenGoal: "Scale automated testing in CI: master job matrix strategies (`strategy.matrix`), parallel test sharding across multiple runners, automated flaky test detection, JUnit test reporting artifacts, and fail-fast controls.",
    conceptInvariant: "Flaky tests (tests that pass and fail intermittently without code changes) destroy team velocity and undermine trust in CI. A test suite must treat flakiness as a critical bug: retry loops should be monitored, and non-deterministic tests quarantined immediately.",
    failureMode: "Allowing a flaky end-to-end test to fail 15% of builds, training developers to ignore CI failures and repeatedly click 'Re-run all jobs' until broken code slips into production.",
    tryItFriction: "Configure a GitHub Actions test matrix that shards 1,000 unit tests across 4 parallel runner nodes (`shard: [1/4, 2/4, 3/4, 4/4]`), reducing total suite execution time from 16 minutes to 4 minutes.",
    socraticHints: [
      "How do you cut a 20-minute test suite down to 5 minutes without deleting any tests?",
      "Test Sharding! Distribute the test files across 4 parallel runners using `matrix.shard`.",
      "Each runner executes 25% of the test suite concurrently, slashing the wall-clock time."
    ],
    situationalPuzzle: {
      scenario: "A test job in a GitHub Actions matrix fails on Node.js 18 on Windows, but passes on Linux and macOS. By default, what happens to the remaining jobs in the matrix, and how do you prevent aborting them if you need complete diagnostic data across all environments?",
      options: [
        "GitHub Actions deletes the repository.",
        "`fail-fast: false`: By default, GitHub Actions sets `fail-fast: true`, which cancels all in-flight matrix jobs immediately upon the first failure; setting `fail-fast: false` allows all OS combinations to finish so the developer gets a full diagnostic report.",
        "Windows cannot run tests.",
        "The workflow must be split into 3 separate files."
      ],
      answerIdx: 1,
      debrief: "By default, GitHub Actions cancels all remaining matrix jobs when one fails (`fail-fast: true`). Setting `strategy.fail-fast: false` forces all matrix variants to complete, providing engineers with a comprehensive matrix report across all operating systems and versions."
    },
    quests: [
      { id: "devops-m1-d10-q1", name: "Matrix Execution Topologies & Test Sharding Algorithms", type: "concept", desc: "Calculate runner cost vs execution speed curves and optimize matrix combinations." },
      { id: "devops-m1-d10-q2", name: "Detective Lab: The Non-Deterministic Flaky Test Quarantine", type: "detective", desc: "Isolate a test failing due to timestamp race conditions and implement automated test quarantine." },
      { id: "devops-m1-d10-q3", name: "Mastery Assignment: 4-Way Parallel Test Sharding CI Workflow", type: "assignment", desc: "Write a complete GitHub Actions matrix workflow running Jest/Vitest shards with JUnit artifact collection." },
      { id: "devops-m1-d10-q4", name: "Production Incident Lab: Ignored Red CI False-Sense-of-Security Outage", type: "detective", desc: "Post-mortem an outage caused by merging code over a flaky CI check that masked a real payment regression." }
    ]
  },

  // ─── BLOCK 3: Versioning, Registry Security & Environment Promotion (Days 11–15) ─
  {
    day: 11,
    month: 1,
    blockNum: 3,
    title: "Semantic Versioning (SemVer 2.0.0), Conventional Commits & Automated Git Release Tagging",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 3,
    pedagogicalRole: "Release Engineering (Automated Versioning & Changelogs)",
    spokenGoal: "Automate software releases like an enterprise platform engineer: master Semantic Versioning (SemVer 2.0.0: `MAJOR.MINOR.PATCH`), Conventional Commits specification, automated release changelog generation, and automated Git tagging via Semantic Release.",
    conceptInvariant: "Under SemVer 2.0.0, breaking changes MUST increment the MAJOR version, backward-compatible features increment the MINOR version, and backward-compatible bug fixes increment the PATCH version. Human developers should never manually edit version numbers; versions must be derived deterministically from commit messages.",
    failureMode: "Publishing a breaking API change under a PATCH version release (`1.2.3` to `1.2.4`), causing downstream clients with caret dependencies (`^1.2.3`) to automatically install the breaking update and crash worldwide.",
    tryItFriction: "Set up Conventional Commits linting (`commitlint`) with Husky git hooks and verify that non-conventional commits (`git commit -m 'fixed bug'`) are rejected before commit creation.",
    socraticHints: [
      "Why must breaking API changes never be released as a PATCH update?",
      "Because package managers treat PATCH updates as safe bug fixes and update automatically!",
      "A breaking change must always increment the MAJOR version (e.g. 1.x.x -> 2.0.0)."
    ],
    situationalPuzzle: {
      scenario: "An open-source library publishes version `2.4.1` with a change that renames an exported function from `getUser()` to `fetchUser()`. Thousands of production applications break overnight. The developer claims: 'It was just a small cleanup, so I made it a patch'. What standard was violated?",
      options: [
        "The developer should have used Python.",
        "SemVer 2.0.0 Invariant Violation: Renaming an exported API function breaks backward compatibility; breaking changes strictly require a MAJOR version bump (`3.0.0`) so existing users are not automatically broken by dependency updates.",
        "GitHub does not support patch releases.",
        "The package manager was configured incorrectly."
      ],
      answerIdx: 1,
      debrief: "Semantic Versioning guarantees contract stability. Any change that removes, renames, or alters existing public API behavior is a breaking change and requires a MAJOR version bump. Releasing breaking changes as minor or patch updates causes widespread cascading outages."
    },
    quests: [
      { id: "devops-m1-d11-q1", name: "SemVer 2.0.0 Mathematical Specification & Dependency Resolution", type: "concept", desc: "Trace tilde (`~`), caret (`^`), and exact version pinning semantics across npm, pip, and cargo." },
      { id: "devops-m1-d11-q2", name: "Detective Lab: The Accidental Breaking Change in a Minor Release", type: "detective", desc: "Audit a git history and correct an automated release pipeline that published a breaking change as a minor bump." },
      { id: "devops-m1-d11-q3", name: "Mastery Assignment: Automated Semantic Release & Git Tagging Pipeline", type: "assignment", desc: "Construct a GitHub Actions workflow running semantic-release to generate release tags and GitHub Releases." },
      { id: "devops-m1-d11-q4", name: "Production Incident Lab: Downstream Client Breaking Dependency Cascade", type: "detective", desc: "Execute an emergency version rollback and publish a deprecation notice for a misversioned breaking library." }
    ]
  },
  {
    day: 12,
    month: 1,
    blockNum: 3,
    title: "Container Registry Security: Multi-Arch OCI Images, Vulnerability Scanning (Trivy/Clair) & Gate Policies",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 3,
    pedagogicalRole: "Supply Chain Security (Vulnerability Scanning & Quality Gates)",
    spokenGoal: "Secure the container supply chain: build multi-architecture OCI images (linux/amd64 and linux/arm64) via Docker Buildx, push to registries (GitHub Packages / Amazon ECR), and enforce automated vulnerability scanning with Trivy and Clair with blocking quality gates.",
    conceptInvariant: "Vulnerability scanning must act as an automated gate in the CI pipeline. If an image contains an unpatched CRITICAL or HIGH CVE with an available fix, the CI pipeline must exit with a non-zero code, preventing the image from being pushed to the registry.",
    failureMode: "Treating vulnerability scans as optional informational logs; an image with a remote code execution vulnerability (Log4Shell) is pushed to production because the CI job did not fail on critical findings.",
    tryItFriction: "Configure Trivy in GitHub Actions with `--exit-code 1 --severity CRITICAL,HIGH --ignore-unfixed`, verifying that an image with known critical vulnerabilities halts the pipeline immediately.",
    socraticHints: [
      "What is the difference between scanning for vulnerabilities and enforcing a quality gate?",
      "Scanning just prints a report; a quality gate FAILS the build if critical CVEs are present!",
      "Use `exit-code: 1` on critical CVEs to block insecure images from ever reaching the container registry."
    ],
    situationalPuzzle: {
      scenario: "A developer builds a Docker image on an Apple Silicon M2 laptop (ARM64) and pushes it to Amazon ECR. When the production EC2 cluster (Intel AMD64) attempts to run the container, it crashes with `exec /usr/local/bin/app: exec format error`. What went wrong in the build process?",
      options: [
        "The application code has a syntax error.",
        "CPU Architecture Mismatch: The developer built an image for `linux/arm64` instead of `linux/amd64`; the team must use Docker Buildx with `--platform linux/amd64,linux/arm64` to build multi-architecture manifest lists.",
        "Docker is incompatible with Apple hardware.",
        "Amazon ECR does not support Linux."
      ],
      answerIdx: 1,
      debrief: "`exec format error` occurs when a Linux kernel attempts to execute binary bytecode compiled for a different CPU architecture (e.g. running ARM64 instructions on an x86_64 CPU). Multi-arch builds using Docker Buildx compile binaries for both architectures under a single manifest tag."
    },
    quests: [
      { id: "devops-m1-d12-q1", name: "OCI Image Manifest Lists & Multi-Arch Buildx Architecture", type: "concept", desc: "Trace multi-architecture manifest lists, QEMU CPU emulation, and native builder fleets." },
      { id: "devops-m1-d12-q2", name: "Detective Lab: The Ignored Critical CVE Production Deployment", type: "detective", desc: "Audit an ECR registry scan, isolate a vulnerable base image, and implement an automated Trivy CI gate." },
      { id: "devops-m1-d12-q3", name: "Mastery Assignment: Multi-Arch Buildx & Trivy Security Gate Pipeline", type: "assignment", desc: "Author a GitHub Actions workflow building amd64/arm64 images, scanning with Trivy, and pushing to GHCR." },
      { id: "devops-m1-d12-q4", name: "Production Incident Lab: exec format error Deployment Blackout", type: "detective", desc: "Recover from a cluster-wide service crash caused by accidentally deploying an ARM64 image to AMD64 nodes." }
    ]
  },
  {
    day: 13,
    month: 1,
    blockNum: 3,
    title: "Continuous Delivery Pipelines: SSH Bastion Ingress, Staging Promotion & Environment Approvals",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 3,
    pedagogicalRole: "Deployment Engineering (Environment Promotion & Approval Gates)",
    spokenGoal: "Promote software across enterprise environments: master Continuous Delivery promotion patterns (Dev -> Staging -> Prod), GitHub Environments, protected branches, manual approval gates, and secure deployment execution via SSH Bastions.",
    conceptInvariant: "Artifact Promotion Invariant: Once an immutable container image is built and verified in Staging, that EXACT SAME image tag and SHA256 digest must be promoted to Production. Rebuilding the image from source for Production invalidates all previous testing.",
    failureMode: "Rebuilding a Docker image from `main` when deploying to production; during the 2 minutes between Staging test and Production build, an upstream dependency published a buggy patch, deploying unverified code to production.",
    tryItFriction: "Configure a GitHub Actions environment protection rule requiring explicit manual approval from a Senior SRE before deploying a promoted container image digest to the `production` environment.",
    socraticHints: [
      "Why must you promote the exact same container image digest to production rather than rebuilding it?",
      "Because rebuilding creates a NEW, untested artifact! Dependencies or build tools could change.",
      "Test in Staging -> Promote the verified image SHA256 digest directly to Production."
    ],
    situationalPuzzle: {
      scenario: "An enterprise requires strict segregation of duties (SOC2 compliance): developers who write code cannot deploy directly to production without a peer review approval. How is this enforced natively in a modern GitHub Actions Continuous Delivery pipeline?",
      options: [
        "By asking developers to pinky-promise not to click deploy.",
        "GitHub Environments with Required Reviewers: Gating the `production` job with a protected Environment that requires mandatory manual review approval from authorized members of the SRE team before deployment credentials unlock.",
        "Disabling GitHub Actions for the entire company.",
        "Storing the production SSH key on a shared USB drive."
      ],
      answerIdx: 1,
      debrief: "GitHub Environments provide native SOC2 compliance guardrails. Environment Protection Rules enforce manual approval gates from specific teams, prevent self-approval by PR authors, and restrict access to production deployment secrets until approvals are granted."
    },
    quests: [
      { id: "devops-m1-d13-q1", name: "Immutable Artifact Promotion vs Rebuild Risks", type: "concept", desc: "Compare immutable digest promotion across environments against rebuilding from git tags." },
      { id: "devops-m1-d13-q2", name: "Detective Lab: The Unapproved Friday Evening Production Push", type: "detective", desc: "Identify a loophole where developer commits bypassed staging and enforce GitHub Environment approvals." },
      { id: "devops-m1-d13-q3", name: "Mastery Assignment: Multi-Stage CD Environment Promotion Workflow", type: "assignment", desc: "Write an end-to-end GitHub Actions workflow promoting container digests through Dev, Staging, and Prod with gates." },
      { id: "devops-m1-d13-q4", name: "Production Incident Lab: Rebuilt Image Dependency Drift Disaster", type: "detective", desc: "Triage a production outage caused by rebuilding an image where an unpinned npm package broke production." }
    ]
  },
  {
    day: 14,
    month: 1,
    blockNum: 3,
    title: "Synthetic Health Verification: Automated Smoke Testing, HTTP Assertion Ladders & Canary Probes",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 3,
    pedagogicalRole: "Automated Verification (Post-Deployment Validation)",
    spokenGoal: "Never trust a green deployment without automated proof: master post-deployment smoke testing, synthetic health probes, HTTP assertion ladders, deep database read/write verifications, and automated deployment verification scripts.",
    conceptInvariant: "A deployment pipeline must never declare success merely because a container started (process running). It must execute an automated post-deployment smoke test suite against live ingress endpoints; if any probe fails, it must automatically trigger a rollback.",
    failureMode: "A CD pipeline marks a deployment 'Successful' because `docker run` exited 0. However, the container is throwing 500 errors on all user requests due to a database migration mismatch, leaving production broken for hours.",
    tryItFriction: "Write a post-deployment bash/TypeScript smoke test that executes 5 sequential assertion checks (`/healthz`, `/api/version`, database connectivity, cache ping) with automated rollback on non-200 responses.",
    socraticHints: [
      "Why is checking `exit code 0` on a deployment command insufficient to prove deployment success?",
      "Because a container can boot successfully and still crash on every HTTP request!",
      "Always execute automated synthetic HTTP smoke tests against the live endpoint before concluding the deployment."
    ],
    situationalPuzzle: {
      scenario: "A deployment succeeds in CI/CD, but 10 minutes later users report that the checkout button returns a 500 error. The deployment smoke test only hit `GET /healthz`, which returned 200 OK. What was missing from the post-deployment verification suite?",
      options: [
        "The smoke test was executed too fast.",
        "Deep Synthetic Transaction Probes: Shallow health checks only verify web server process responsiveness; smoke tests must execute synthetic critical-path transactions (e.g. read product, add to cart, verify checkout quote) to prove functional end-to-end readiness.",
        "The smoke test should have used UDP.",
        "Health checks are unnecessary in production."
      ],
      answerIdx: 1,
      debrief: "Shallow health checks only test whether the HTTP process is alive, missing database deadlocks, broken dependencies, or runtime exceptions on business paths. Robust CD pipelines execute synthetic end-to-end user transactions to validate real system functionality."
    },
    quests: [
      { id: "devops-m1-d14-q1", name: "Synthetic Testing Architecture: Shallow vs Deep Verification", type: "concept", desc: "Design smoke testing pyramids: connectivity -> dependency readiness -> synthetic transaction probes." },
      { id: "devops-m1-d14-q2", name: "Detective Lab: The Shallow 200 OK False-Green Blindspot", type: "detective", desc: "Audit an automated pipeline where a broken database query was masked by a static `/health` check." },
      { id: "devops-m1-d14-q3", name: "Mastery Assignment: Post-Deploy Synthetic Assertion Suite in Node.js", type: "assignment", desc: "Construct an automated test runner executing sequential API assertions with exponential backoff and timeout aborts." },
      { id: "devops-m1-d14-q4", name: "Production Incident Lab: Uncaught 500 Error Smoke Test Failure", type: "detective", desc: "Simulate a broken database schema deployment and verify the automated smoke test halts and rolls back the release." }
    ]
  },
  {
    day: 15,
    month: 1,
    blockNum: 3,
    title: "⭐ MILESTONE 2: Production GitHub Actions CI/CD Pipeline with Matrix Testing & Automated Rollbacks",
    stageName: "Stage 2: Defensive Fluency",
    stageNum: 3,
    pedagogicalRole: "Integrative Milestone Synthesis (Enterprise End-to-End Delivery Pipeline)",
    spokenGoal: "Architect and prove an enterprise-grade Continuous Delivery pipeline: construct a complete GitHub Actions CI/CD automation suite featuring linting, parallel test matrix sharding, Trivy security gates, multi-arch Docker builds, Staging deployment, smoke tests, and automated rollback upon failure.",
    conceptInvariant: "A Continuous Delivery pipeline must be fully automated, deterministic, and self-healing. If any stage fails—from unit tests to post-deployment smoke tests—the pipeline must abort cleanly and revert the environment to the previous stable artifact without human intervention.",
    failureMode: "Designing a deployment pipeline without automated rollback capabilities, forcing on-call engineers to scramble at 3 AM to find previous commit hashes and manually trigger emergency deploys while users suffer downtime.",
    tryItFriction: "Inject an intentional failure into a simulated Staging deployment and observe the GitHub Actions pipeline automatically trigger a rollback step, restoring the previous stable image in under 60 seconds.",
    socraticHints: [
      "What is the single most important automated safeguard in a Continuous Delivery pipeline?",
      "Automated Rollback! If post-deployment smoke tests fail, revert immediately.",
      "Never leave a broken deployment waiting for human intervention."
    ],
    situationalPuzzle: {
      scenario: "During an automated CD pipeline execution, Step 4 (Deploy to Staging) succeeds, but Step 5 (Synthetic Smoke Test) fails with HTTP 500. Without manual intervention, how must the workflow handle this failure?",
      options: [
        "Leave the broken version running and send a Slack message.",
        "Automated Rollback Hook: The pipeline uses `if: failure()` to trigger a rollback step that immediately deploys the previously known stable container image digest, verifies health, and alerts the team.",
        "Reboot the physical server.",
        "Delete the git commit from GitHub."
      ],
      answerIdx: 1,
      debrief: "A resilient deployment pipeline treats smoke test failures as an emergency signal. Using GitHub Actions `if: failure()` conditional steps to trigger automated rollbacks restores service availability instantly, minimizing user blast radius."
    },
    quests: [
      { id: "devops-m1-d15-q1", name: "Milestone Architecture: Enterprise CI/CD Pipeline Specification", type: "concept", desc: "Design the end-to-end pipeline: Lint -> Test Matrix -> Security Gate -> Multi-Arch Build -> Deploy -> Verify -> Rollback." },
      { id: "devops-m1-d15-q2", name: "Detective Lab: The Unhandled Smoke Test Failure Stall", type: "detective", desc: "Audit a broken deployment pipeline that stalled indefinitely on a failed smoke check and implement rollback hooks." },
      { id: "devops-m1-d15-q3", name: "Mastery Assignment: Self-Healing GitHub Actions CI/CD Pipeline Suite", type: "assignment", desc: "Author the complete enterprise workflow YAML with environment gates, Trivy scans, and automated rollback logic." },
      { id: "devops-m1-d15-q4", name: "Production Incident Lab: Live Staging Deployment Failure & Auto-Rollback Drill", type: "detective", desc: "Simulate a critical runtime crash during release and verify automated self-healing restores stable traffic." }
    ]
  },

  // ─── BLOCK 4: Kubernetes Architecture & Ingress Networking (Days 16–20) ───────────
  {
    day: 16,
    month: 1,
    blockNum: 4,
    title: "Kubernetes Core Foundations: Control Plane Architecture, Pods, ReplicaSets & Declarative Deployments",
    stageName: "Stage 3: Systems Fluency",
    stageNum: 3,
    pedagogicalRole: "Container Orchestration Foundations (Kubernetes Control Plane)",
    spokenGoal: "Transition from single-host Docker to distributed container orchestration: master the Kubernetes control plane (kube-apiserver, etcd, kube-scheduler, kube-controller-manager), worker node agents (kubelet, kube-proxy), and declarative Deployments.",
    conceptInvariant: "Kubernetes operates on a declarative reconciliation loop: you declare the desired state in YAML (`replicas: 3`); the controller manager continuously queries the current state from etcd and issues commands to drive current state toward desired state.",
    failureMode: "Managing containers imperatively by manually running `kubectl run` or editing live pods directly; when a pod crashes or a node dies, the manual configuration is permanently lost.",
    tryItFriction: "Write a declarative Kubernetes Deployment manifest (`apps/v1`) with 3 replicas, rolling update strategy (`maxSurge: 1`, `maxUnavailable: 0`), and observe zero-downtime rolling updates as pods transition.",
    socraticHints: [
      "What is the difference between an imperative command and a declarative manifest in Kubernetes?",
      "Imperative tells Kubernetes HOW to do something once (`kubectl run`); Declarative declares WHAT the system should look like forever (`kubectl apply -f deployment.yaml`).",
      "Kubernetes constantly reconciles reality against declarative YAML files stored in etcd."
    ],
    situationalPuzzle: {
      scenario: "A developer deletes a Pod managed by a Deployment using `kubectl delete pod my-app-7d8b-xyz`. Five seconds later, the developer checks `kubectl get pods` and sees a new pod running with a different name (`my-app-7d8b-abc`). Did the delete command fail?",
      options: [
        "Yes, the delete command failed because the pod was locked.",
        "Declarative State Reconciliation: The command succeeded, but the ReplicaSet controller detected that current replicas (2) was less than desired replicas (3), and immediately scheduled a new Pod to maintain the declared invariant.",
        "Kubernetes pods can never be deleted.",
        "The etcd database was corrupted."
      ],
      answerIdx: 1,
      debrief: "ReplicaSets enforce replica count invariants. Deleting a managed Pod causes the ReplicaSet controller to detect a drift between actual state (N-1) and desired state (N), immediately provisioning a replacement Pod to restore the desired state."
    },
    quests: [
      { id: "devops-m1-d16-q1", name: "Kubernetes Control Plane Reconciliation Engine & etcd Quorum", type: "concept", desc: "Trace kube-apiserver REST requests, etcd RAFT consensus, kube-scheduler filtering, and kubelet execution." },
      { id: "devops-m1-d16-q2", name: "Detective Lab: The Imperative Pod Mutation Configuration Drift", type: "detective", desc: "Audit a cluster with undocumented manual pods and reconcile them into declarative GitOps Deployments." },
      { id: "devops-m1-d16-q3", name: "Mastery Assignment: Zero-Downtime Rolling Update Deployment Spec", type: "assignment", desc: "Author a Kubernetes Deployment manifest with optimized `maxSurge` and `maxUnavailable` rolling update parameters." },
      { id: "devops-m1-d16-q4", name: "Production Incident Lab: Kubelet Node Eviction Cascade Post-Mortem", type: "detective", desc: "Triage a worker node failure where disk pressure caused the kubelet to evict critical pods simultaneously." }
    ]
  },
  {
    day: 17,
    month: 1,
    blockNum: 4,
    title: "Kubernetes Service Discovery: ClusterIP, NodePort, LoadBalancer & CoreDNS Resolution Invariants",
    stageName: "Stage 3: Systems Fluency",
    stageNum: 3,
    pedagogicalRole: "Core Kubernetes Networking (Internal Discovery & Virtual IPs)",
    spokenGoal: "Connect ephemeral pods with stable networking: master Kubernetes Services, ClusterIP virtual IPs, NodePort host allocations, LoadBalancer cloud integrations, kube-proxy iptables/IPVS routing, and CoreDNS internal service resolution.",
    conceptInvariant: "Pod IP addresses are completely ephemeral and change on every restart. A Kubernetes Service assigns a stable virtual IP (ClusterIP) and DNS entry (`service-name.namespace.svc.cluster.local`) that load-balances traffic across matching healthy pods via label selectors.",
    failureMode: "Hardcoding a specific Pod IP address (`10.244.1.45`) in microservice configuration; when the pod is rescheduled onto another node, its IP changes, breaking all inter-service communication.",
    tryItFriction: "Create a ClusterIP service targeting pods with label `app: payment-api`, exec into a client pod, and verify DNS resolution of `payment-api` to the stable ClusterIP.",
    socraticHints: [
      "Why must microservices communicate via Service names rather than Pod IPs in Kubernetes?",
      "Because Pods are ephemeral! When a pod restarts, its IP address is wiped and replaced.",
      "A Service provides an immutable virtual IP and DNS name that routes traffic to whatever pods match its label selector."
    ],
    situationalPuzzle: {
      scenario: "An engineer creates a Service and a Deployment. The Service has `selector: { app: web, tier: frontend }`. The Deployment Pod template has `labels: { app: web }`. When clients query the Service, they get connection timeouts. `kubectl get endpoints` shows an empty list (`<none>`). What is the cause?",
      options: [
        "Kubernetes requires 24 hours to configure endpoints.",
        "Label Selector Mismatch: The Service requires BOTH `app: web` AND `tier: frontend`, but the Pods only have `app: web`; because the label selector did not match, zero Pods were registered to the Service's Endpoints object.",
        "CoreDNS has crashed.",
        "The cluster needs a public IP address."
      ],
      answerIdx: 1,
      debrief: "A Kubernetes Service identifies backend pods strictly through label selectors. If a Service declares multiple selector labels, candidate Pods must match ALL declared labels. A mismatch results in an empty Endpoints/EndpointSlice list, causing connection failures."
    },
    quests: [
      { id: "devops-m1-d17-q1", name: "Kube-Proxy iptables vs IPVS Packet Routing Pipeline", type: "concept", desc: "Trace virtual ClusterIP translation to Pod IPs via Linux netfilter iptables and IPVS connection hashing." },
      { id: "devops-m1-d17-q2", name: "Detective Lab: The Empty Endpoints Service Discovery Mystery", type: "detective", desc: "Debug a microservice communication blackout and fix label selector mismatches in Kubernetes manifests." },
      { id: "devops-m1-d17-q3", name: "Mastery Assignment: Multi-Tier Internal Service Discovery Architecture", type: "assignment", desc: "Construct declarative manifests for ClusterIP, Headless Services, and CoreDNS FQDN routing across namespaces." },
      { id: "devops-m1-d17-q4", name: "Production Incident Lab: CoreDNS CPU Saturation & 5-Second DNS Delay", type: "detective", desc: "Resolve a cluster-wide DNS latency crisis caused by ndots:5 glibc DNS query multiplication." }
    ]
  },
  {
    day: 18,
    month: 1,
    blockNum: 4,
    title: "Ingress Networking: Ingress Controllers (Nginx/Traefik), Path-Based Routing & Automated ACME TLS Termination",
    stageName: "Stage 3: Systems Fluency",
    stageNum: 3,
    pedagogicalRole: "Edge Ingress Architecture (Layer 7 Routing & SSL Automation)",
    spokenGoal: "Route external web traffic into Kubernetes without paying for a cloud load balancer per service: master Kubernetes Ingress resources, Ingress Controllers (Ingress-Nginx, Traefik), host and path-based routing, and cert-manager with Let's Encrypt ACME automated TLS.",
    conceptInvariant: "An Ingress resource is merely a declarative configuration object. It does NOTHING on its own without an active Ingress Controller (a reverse proxy pod running in the cluster) that translates Ingress rules into real Nginx/Traefik routing configurations and terminates TLS.",
    failureMode: "Creating an `Ingress` YAML resource in a raw Kubernetes cluster without deploying an Ingress Controller, wondering why external DNS points to nothing and traffic never routes to the application.",
    tryItFriction: "Deploy Ingress-Nginx and cert-manager to provision an automated Let's Encrypt TLS certificate for `api.example.com`, verifying automated HTTP-01 challenge completion and TLS termination.",
    socraticHints: [
      "Why is creating an Ingress YAML resource not enough to route traffic in Kubernetes?",
      "An Ingress is just a configuration rule! You need an Ingress Controller (like Nginx) to actually execute it.",
      "The controller watches the Kubernetes API for Ingress resources and dynamically updates its reverse proxy rules."
    ],
    situationalPuzzle: {
      scenario: "A microservice deployment receives 10MB file uploads from users. When users upload files, the Ingress Controller immediately returns `HTTP 413 Request Entity Too Large`. The backend application container has a 50MB upload limit configured. Where is the request being rejected?",
      options: [
        "The browser network card is throttled.",
        "Ingress-Nginx Default Body Size Limit: By default, Ingress-Nginx enforces a 1MB `client_max_body_size`; the ingress manifest must be annotated with `nginx.ingress.kubernetes.io/proxy-body-size: '50m'` to permit larger uploads.",
        "Kubernetes pods cannot process files larger than 1MB.",
        "The hard drive of the node is full."
      ],
      answerIdx: 1,
      debrief: "Ingress-Nginx acts as a Layer 7 reverse proxy. By default, its Nginx configuration limits client request bodies to 1MB. Requests exceeding this threshold are rejected at the ingress perimeter before ever reaching the backend application. Manifest annotations override this limit."
    },
    quests: [
      { id: "devops-m1-d18-q1", name: "Ingress Controller Architecture & ACME Automated Certificate Lifecycle", type: "concept", desc: "Trace HTTP-01 and DNS-01 ACME challenges, Let's Encrypt renewal state machines, and cert-manager CRDs." },
      { id: "devops-m1-d18-q2", name: "Detective Lab: The 413 Payload Too Large Ingress Rejection", type: "detective", desc: "Diagnose an upload failure at the ingress layer and apply appropriate Nginx proxy annotations." },
      { id: "devops-m1-d18-q3", name: "Mastery Assignment: Production Multi-Host Ingress with Automated TLS", type: "assignment", desc: "Author an Ingress manifest configuring host-based routing (`api.`, `app.`), path rewrites, and cert-manager TLS." },
      { id: "devops-m1-d18-q4", name: "Production Incident Lab: Expired TLS Certificate Blackout Triage", type: "detective", desc: "Recover an e-commerce platform down due to an expired SSL certificate caused by an ACME challenge failure." }
    ]
  },
  {
    day: 19,
    month: 1,
    blockNum: 4,
    title: "Configuration & Secret Management: ConfigMaps, Kubernetes Secrets, Base64 Traps & External Secrets Operator",
    stageName: "Stage 3: Systems Fluency",
    stageNum: 3,
    pedagogicalRole: "Core Security Architecture (Secrets Governance & Environment Decoupling)",
    spokenGoal: "Manage application configuration securely in Kubernetes: master ConfigMaps, Kubernetes Secrets, understand the Base64 encoding misconception, volume mounts vs environment variables, dynamic secret rotation, and the External Secrets Operator (ESO) syncing from AWS Secrets Manager.",
    conceptInvariant: "Kubernetes Secrets are NOT encrypted by default; they are merely Base64-encoded plain text (`echo 'cGFzc3dvcmQ=' | base64 -d`). True secret security requires Encryption at Rest in etcd with KMS keys, and external secret synchronization via operators like External Secrets Operator.",
    failureMode: "Committing a Kubernetes Secret YAML file to a public GitHub repository, believing the `data.password` string is secure because it is 'encoded' in Base64.",
    tryItFriction: "Deploy the External Secrets Operator (ESO), create a `SecretStore` pointing to AWS Secrets Manager, and verify automated synchronization into native Kubernetes Secrets without hardcoded YAML values.",
    socraticHints: [
      "Is Base64 encoding a form of encryption?",
      "NO! Base64 is an encoding format, not encryption. Anyone can decode it in 1 millisecond!",
      "Never store plain Base64 secrets in Git. Use External Secrets Operator or Sealed Secrets to manage secrets."
    ],
    situationalPuzzle: {
      scenario: "An application injects database credentials as environment variables from a Secret (`envFrom: secretRef`). An administrator updates the password in the Kubernetes Secret. However, the running application pods continue using the old password and fail with authentication errors until manually restarted. Why didn't the pods receive the new password?",
      options: [
        "Kubernetes Secrets cannot be updated.",
        "Environment Variable Immutability: In Linux, a running process cannot dynamically update its existing environment variables; changes to Secrets injected as environment variables require restarting the Pods to take effect (unlike volume mounts which update automatically).",
        "The database rejected the update.",
        "The cluster must be upgraded."
      ],
      answerIdx: 1,
      debrief: "Environment variables are evaluated at process startup and cannot be changed dynamically while the process is running. When Secrets are injected as environment variables, Pods must be restarted to consume updated values. Secrets mounted as filesystem volumes update dynamically in the background."
    },
    quests: [
      { id: "devops-m1-d19-q1", name: "Kubernetes Secret Architecture & etcd Encryption at Rest", type: "concept", desc: "Compare Base64 encoding against KMS envelope encryption in etcd and Sealed Secrets asymmetric cryptography." },
      { id: "devops-m1-d19-q2", name: "Detective Lab: The Committed Base64 Secret in Git Leak", type: "detective", desc: "Detect and scrub an exposed Kubernetes Secret from git history and rotate compromised credentials." },
      { id: "devops-m1-d19-q3", name: "Mastery Assignment: External Secrets Operator (ESO) Synchronization Spec", type: "assignment", desc: "Construct SecretStore and ExternalSecret CRD manifests synchronizing credentials dynamically from cloud vaults." },
      { id: "devops-m1-d19-q4", name: "Production Incident Lab: Outdated Secret Process Crash Cascade", type: "detective", desc: "Triage a database connection failure where half the pods ran with rotated passwords and half with stale env vars." }
    ]
  },
  {
    day: 20,
    month: 1,
    blockNum: 4,
    title: "Pod Lifecycle & Health Probes: Startup, Liveness, and Readiness Probes with Cascading Failure Prevention",
    stageName: "Stage 3: Systems Fluency",
    stageNum: 3,
    pedagogicalRole: "Core Resiliency Architecture (Self-Healing & Traffic Gating)",
    spokenGoal: "Keep clusters self-healing and prevent traffic from hitting unready pods: master the Kubernetes Pod lifecycle, Startup Probes (handling slow boots), Readiness Probes (gating service traffic), and Liveness Probes (restarting deadlocked processes).",
    conceptInvariant: "Readiness Probes gate traffic; Liveness Probes kill processes. If a database is temporarily overloaded and slow, a failing Readiness Probe removes the pod from the Service load balancer (saving it). If you incorrectly configure a Liveness Probe on the database check, Kubernetes will aggressively kill and restart the healthy pod, triggering a catastrophic cascading failure.",
    failureMode: "Pointing a Liveness Probe to a slow database dependency; when the database slows down, Kubernetes restarts all 50 application pods simultaneously, completely taking down the website.",
    tryItFriction: "Configure a slow-booting Java/Node microservice with a Startup Probe (`failureThreshold: 30, periodSeconds: 2`) preventing premature Liveness restarts during warm-up.",
    socraticHints: [
      "What is the critical difference between a Liveness Probe and a Readiness Probe?",
      "Liveness Probe KILLS and restarts the pod; Readiness Probe stops sending traffic to the pod!",
      "Never check external downstream databases in a Liveness Probe, or a database hiccup will kill all your pods!"
    ],
    situationalPuzzle: {
      scenario: "During peak traffic, a downstream payment gateway experiences latency spikes. An application's Liveness Probe checks `gateway.isHealthy()`. Because the gateway is slow, the probe fails 3 consecutive times. Kubernetes immediately terminates and restarts all pods in the cluster, crashing active transactions and compounding the outage. What was the architectural design flaw?",
      options: [
        "The pods did not have enough RAM.",
        "Liveness Probe Dependency Coupling: Liveness probes must ONLY test internal process health (deadlocks, event loop stalls); testing external dependencies in a Liveness probe causes healthy application pods to restart unnecessarily, triggering cascading collapse.",
        "Kubernetes cannot run under heavy traffic.",
        "The Readiness probe should have killed the pod."
      ],
      answerIdx: 1,
      debrief: "Liveness probes must be strictly internal to the process (e.g. is the process alive and responsive). If a downstream dependency is slow or failing, that should be reflected in a Readiness probe (to pause traffic) or circuit breaker, NEVER in a Liveness probe, which blindly kills the container."
    },
    quests: [
      { id: "devops-m1-d20-q1", name: "Pod Lifecycle State Machine: Pending, Running, Terminating", type: "concept", desc: "Trace preStop hooks, termination grace periods, probe evaluation loops, and endpoint removal." },
      { id: "devops-m1-d20-q2", name: "Detective Lab: The Premature Startup Probe Restart Loop", type: "detective", desc: "Fix an application stuck in CrashLoopBackOff because it took 45s to boot while Liveness killed it at 10s." },
      { id: "devops-m1-d20-q3", name: "Mastery Assignment: Resilient Tri-Probe Health Architecture Manifest", type: "assignment", desc: "Author a Kubernetes Deployment manifest with optimized Startup, Liveness, and Readiness probes." },
      { id: "devops-m1-d20-q4", name: "Production Incident Lab: Cascading Liveness Death Spiral Post-Mortem", type: "detective", desc: "Triage a live cluster-wide restart storm and decouple external dependencies from liveness evaluation." }
    ]
  },

  // ─── BLOCK 5: Autoscaling, Helm, GitOps & Observability (Days 21–25) ──────────────
  {
    day: 21,
    month: 1,
    blockNum: 5,
    title: "⭐ MILESTONE 3: Production High-Availability Kubernetes Cluster with Ingress & Horizontal Pod Autoscaler (HPA)",
    stageName: "Stage 3: Systems Fluency",
    stageNum: 3,
    pedagogicalRole: "Integrative Milestone Synthesis (Elastic Scaling & Ingress Resilience)",
    spokenGoal: "Architect and prove an elastic, self-healing container platform: construct a production-ready Kubernetes application stack featuring Ingress-Nginx Layer 7 routing, Horizontal Pod Autoscaler (HPA) scaling on CPU and custom metrics, PodDisruptionBudgets (PDB), and anti-affinity rules across failure domains.",
    conceptInvariant: "High availability requires spreading replicas across independent failure domains. Using `podAntiAffinity` with `topologyKey: topology.kubernetes.io/zone` guarantees that Kubernetes schedules pod replicas into distinct Availability Zones, preventing single-zone outages from taking down the service.",
    failureMode: "Deploying 10 replicas of a service without anti-affinity rules; the scheduler places all 10 replicas onto the exact same worker node. When that single node suffers a hardware fault, the entire service goes down.",
    tryItFriction: "Deploy a Horizontal Pod Autoscaler (`HPA`) targeting 70% CPU utilization, execute an Apache Bench (`ab`) load test with 5,000 concurrent requests, and observe replicas scale automatically from 2 to 15 pods in under 90 seconds.",
    socraticHints: [
      "How do you guarantee Kubernetes doesn't schedule all your pods onto the same physical machine?",
      "Use `podAntiAffinity` with `topologyKey: kubernetes.io/hostname` or zone!",
      "It instructs the scheduler to reject placing multiple replicas of the same app on the same node."
    ],
    situationalPuzzle: {
      scenario: "During a cluster upgrade, a node draining operation (`kubectl drain node-1`) evicts all pods on that node. A critical microservice with 2 replicas was running both pods on `node-1`. The service experiences 45 seconds of complete downtime. What Kubernetes resource was missing to prevent draining all replicas simultaneously?",
      options: [
        "A bigger hard drive.",
        "PodDisruptionBudget (PDB): Defining a PDB with `minAvailable: 1` or `maxUnavailable: 1` forces the cluster drainer to evict pods sequentially, ensuring at least one healthy replica is running on another node before the eviction proceeds.",
        "Kubernetes cannot drain nodes without downtime.",
        "An Ingress resource."
      ],
      answerIdx: 1,
      debrief: "A PodDisruptionBudget (PDB) enforces availability guarantees during voluntary disruptions (node drains, cluster upgrades, auto-scaler scale-ins). Setting `minAvailable: 1` guarantees that Kubernetes will never evict the last remaining replica before a new replica is running and healthy."
    },
    quests: [
      { id: "devops-m1-d21-q1", name: "Milestone Architecture: High-Availability Elastic Kubernetes Topology", type: "concept", desc: "Design the complete specification: Ingress -> Service -> Deployment with PDB & PodAntiAffinity -> HPA." },
      { id: "devops-m1-d21-q2", name: "Detective Lab: The Single-Node Scheduling Co-location Vulnerability", type: "detective", desc: "Audit a cluster scheduling all replicas to one node and apply strict topology spread constraints." },
      { id: "devops-m1-d21-q3", name: "Mastery Assignment: HPA Elastic Scaling & PodDisruptionBudget Spec", type: "assignment", desc: "Author complete Kubernetes manifests configuring HPA with stabilization windows and PDB rules." },
      { id: "devops-m1-d21-q4", name: "Production Incident Lab: HPA Thrashing Flapping Oscillation Triage", type: "detective", desc: "Resolve an autoscaling thrashing incident where rapid scale-out and scale-in destabilized worker nodes." }
    ]
  },
  {
    day: 22,
    month: 1,
    blockNum: 5,
    title: "Kubernetes Package Management: Helm 3 Architecture, Chart Templating & Multi-Environment Values Files",
    stageName: "Stage 3: Systems Fluency",
    stageNum: 3,
    pedagogicalRole: "Package Management Engineering (Templated Kubernetes Releases)",
    spokenGoal: "Stop copy-pasting raw Kubernetes YAML manifests: master Helm 3, chart directory structures (`Chart.yaml`, `templates/`, `values.yaml`), Go template functions (`range`, `if`, `default`), subcharts, release lifecycle hooks, and multi-environment `values-dev.yaml` vs `values-prod.yaml` overlays.",
    conceptInvariant: "Helm charts must be strictly deterministic and DRY. Common Kubernetes resource templates must accept parameterized inputs from values files without requiring code modifications to the underlying templates when promoting across environments.",
    failureMode: "Hardcoding image tags or resource limits inside `templates/deployment.yaml`, forcing developers to fork the entire chart when deploying to staging vs production.",
    tryItFriction: "Create a reusable Helm 3 chart from scratch, render it locally with `helm template -f values-prod.yaml`, and verify that the synthesized manifests match strict enterprise security invariants.",
    socraticHints: [
      "Why is Helm 3 significantly more secure than legacy Helm 2?",
      "Helm 3 eliminated Tiller! Helm 3 communicates directly with the Kubernetes API using your own kubeconfig permissions.",
      "No centralized over-privileged daemon running in the cluster."
    ],
    situationalPuzzle: {
      scenario: "A Helm deployment fails halfway through a release due to an invalid secret format. The release enters a `FAILED` state. The developer attempts to run `helm install` again, but Helm reports: `cannot re-use a name that is still in use`. What is the proper command to roll back or fix the failed release?",
      options: [
        "Delete the Kubernetes cluster.",
        "`helm rollback <release> [revision]` or `helm upgrade --install`: Using `helm rollback` restores the last known good revision, while `helm upgrade --install` forces reconciliation of the existing release name.",
        "Reboot the client laptop.",
        "Edit the etcd database manually."
      ],
      answerIdx: 1,
      debrief: "Helm tracks release versions in Kubernetes Secrets. If an upgrade fails, Helm retains the release metadata. Running `helm rollback <release>` reverts to the previous working revision, while `helm upgrade --install` idempotently reconciles without name collision errors."
    },
    quests: [
      { id: "devops-m1-d22-q1", name: "Helm 3 Architecture: Release Secrets, Tillerless Security & Engine", type: "concept", desc: "Trace template compilation, Go sprig functions, schema validation (`values.schema.json`), and hook execution." },
      { id: "devops-m1-d22-q2", name: "Detective Lab: The Brittle Hardcoded Helm Chart Template", type: "detective", desc: "Refactor a rigid, unparameterized Helm chart into a flexible multi-environment enterprise chart." },
      { id: "devops-m1-d22-q3", name: "Mastery Assignment: Enterprise Microservice Helm 3 Chart Suite", type: "assignment", desc: "Build a production-grade Helm chart with conditional ingress, autoscaling toggles, and schema validation." },
      { id: "devops-m1-d22-q4", name: "Production Incident Lab: Helm Release Secret State Deadlock Recovery", type: "detective", desc: "Recover an enterprise Helm release stuck in `pending-upgrade` following a network timeout." }
    ]
  },
  {
    day: 23,
    month: 1,
    blockNum: 5,
    title: "Declarative Continuous Delivery with GitOps: ArgoCD Reconciliation Loops & Automated Drift Remediation",
    stageName: "Stage 3: Systems Fluency",
    stageNum: 3,
    pedagogicalRole: "Declarative Delivery Engineering (GitOps Paradigm & Self-Healing)",
    spokenGoal: "Operate Kubernetes exclusively through Git: master GitOps principles, ArgoCD architecture (API Server, Repository Server, Application Controller), Application Custom Resources, automated synchronization, drift detection, and self-healing.",
    conceptInvariant: "The GitOps Invariant: Git is the single source of truth for the entire cluster. If an unauthorized administrator makes manual changes using `kubectl edit` in production, ArgoCD detects the divergence (drift) and automatically overwrites the cluster state back to the Git commit within seconds.",
    failureMode: "Allowing engineers to have direct `write` access to production clusters; manual unreviewed hotfixes bypass version control, leaving the disaster recovery state completely broken.",
    tryItFriction: "Deploy ArgoCD, create an `Application` manifest tracking a Git repository, manually mutate a deployment's replica count via `kubectl scale`, and observe ArgoCD self-heal and revert the drift within 60 seconds.",
    socraticHints: [
      "What happens when you enable `selfHeal: true` in an ArgoCD Application?",
      "If anyone manually changes a resource in the cluster using kubectl, ArgoCD immediately overwrites it with what is in Git!",
      "Git remains the absolute single source of truth."
    ],
    situationalPuzzle: {
      scenario: "A developer updates an image tag in a Git repository to trigger a deployment. ArgoCD reports the application is `OutOfSync` and begins syncing. However, the sync hangs indefinitely with status `Progressing`. Inspection shows a pre-sync hook job failed. How does ArgoCD handle failed hook phases?",
      options: [
        "ArgoCD reboots all worker nodes.",
        "Phase-Gated Sync Halting: If a `PreSync` hook fails, ArgoCD immediately halts the deployment before mutating the live application, keeping the current production version running safely and preventing broken rollouts.",
        "ArgoCD deletes the Git repository.",
        "The cluster deletes all pods."
      ],
      answerIdx: 1,
      debrief: "ArgoCD executes hooks in distinct lifecycle phases (`PreSync`, `Sync`, `PostSync`). If a PreSync hook (e.g. database schema migration) fails, ArgoCD halts the sync pipeline immediately, preventing the application deployment from updating and shielding users from broken releases."
    },
    quests: [
      { id: "devops-m1-d23-q1", name: "GitOps Core Principles & ArgoCD Reconciliation State Machine", type: "concept", desc: "Trace Git polling intervals, webhook triggers, Diff engine calculation, and sync phase transitions." },
      { id: "devops-m1-d23-q2", name: "Detective Lab: The Stuck OutOfSync GitOps Application", type: "detective", desc: "Diagnose an ArgoCD sync deadlock caused by server-side field ownership conflicts and fix ignoreDifferences." },
      { id: "devops-m1-d23-q3", name: "Mastery Assignment: Self-Healing ArgoCD Application Manifest Suite", type: "assignment", desc: "Author complete ArgoCD Application CRDs with automated prune, self-heal, and sync wave sequencing." },
      { id: "devops-m1-d23-q4", name: "Production Incident Lab: Unapproved Cluster Hotfix Overwrite Incident", type: "detective", desc: "Post-mortem an incident where a manual emergency hotfix was reverted by GitOps self-healing, and codify proper git-first emergency runbooks." }
    ]
  },
  {
    day: 24,
    month: 1,
    blockNum: 5,
    title: "Cloud-Native Telemetry: Prometheus Pull-Based Metric Scraping, TSDB Storage & PromQL Alerting Rules",
    stageName: "Stage 3: Systems Fluency",
    stageNum: 3,
    pedagogicalRole: "Observability Engineering (Metrics Telemetry & TSDB Math)",
    spokenGoal: "Measure everything in real time: master Prometheus architecture, pull-based scraping, ServiceMonitors, Time-Series Database (TSDB) chunk compression, Prometheus metric types (Counter, Gauge, Histogram, Summary), and PromQL query language.",
    conceptInvariant: "Counters can only increase (or reset to 0 on restart). Never alert directly on raw Counter values (`http_requests_total`). Always calculate the per-second rate of increase over a time window using `rate()`: `sum(rate(http_requests_total[5m])) by (status)`.",
    failureMode: "Using `increase()` or raw counters for high-cardinality metrics inside alerts, generating massive false alarms every time a pod restarts and resets its counter to zero.",
    tryItFriction: "Write a PromQL expression that calculates the 99th percentile (p99) latency across all HTTP endpoints: `histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))`.",
    socraticHints: [
      "Why must you wrap a Prometheus Counter with `rate()` before running aggregations?",
      "Because raw counters only go up! If a pod restarts, the counter resets to 0, which would distort raw sums.",
      "`rate()` automatically handles counter resets and calculates the true per-second velocity of events."
    ],
    situationalPuzzle: {
      scenario: "An engineer adds a label to a Prometheus counter: `userId: req.user.id`. Within 2 hours, the Prometheus server runs out of memory and crashes in an OOM loop. The metric has 2,000,000 unique active users. What observability anti-pattern caused this collapse?",
      options: [
        "Prometheus does not support user metrics.",
        "High-Cardinality Metric Explosion: Prometheus stores a distinct time-series stream in RAM for every unique combination of label key-value pairs; using unbounded high-cardinality values (like user IDs or UUIDs) creates millions of series, exhausting TSDB memory.",
        "The CPU was too slow.",
        "Prometheus should have used MySQL."
      ],
      answerIdx: 1,
      debrief: "Prometheus TSDB is designed for low-cardinality dimensions (e.g. status code, method, handler). Adding high-cardinality attributes like `userId`, `email`, or `transactionId` creates a new time-series for every unique value, causing metric explosion and crashing the Prometheus server."
    },
    quests: [
      { id: "devops-m1-d24-q1", name: "Prometheus Pull-Based Scraping Engine & TSDB Storage Mechanics", type: "concept", desc: "Trace service discovery, scrape loops, head chunks, block compaction, and WAL replay." },
      { id: "devops-m1-d24-q2", name: "Detective Lab: The High-Cardinality Prometheus OOM Crash", type: "detective", desc: "Profile TSDB series memory usage, locate high-cardinality labels, and implement metric relabeling rules." },
      { id: "devops-m1-d24-q3", name: "Mastery Assignment: Production PromQL Alerting Rule Library", type: "assignment", desc: "Author PrometheusRule manifests alerting on p99 latency spikes, high error rates, and crash looping." },
      { id: "devops-m1-d24-q4", name: "Production Incident Lab: Alertmanager Notification Storm Triage", type: "detective", desc: "Triage a 5,000-email alert flood during a cluster reboot by configuring Alertmanager grouping and inhibition." }
    ]
  },
  {
    day: 25,
    month: 1,
    blockNum: 5,
    title: "Observability Dashboards: Grafana Visualizations & Distributed Tracing with OpenTelemetry Collectors",
    stageName: "Stage 3: Systems Fluency",
    stageNum: 3,
    pedagogicalRole: "Observability Engineering (Visual Dashboards & Distributed Traces)",
    spokenGoal: "Visualize production health like an SRE: master Grafana dashboard engineering, template variables, RED method (Rate, Errors, Duration), and distributed tracing with OpenTelemetry (OTel) collectors, trace contexts, and Jaeger.",
    conceptInvariant: "The RED Method is the gold standard for microservice monitoring: Rate (requests per second), Errors (number of failing requests), and Duration (time taken per request, focusing on p95/p99 percentiles). Monitoring CPU and RAM alone misses customer-impacting software bugs.",
    failureMode: "Building a dashboard with 50 CPU and memory graphs but zero application latency or error rate metrics; when an API returns 500 errors to 100% of users, the dashboard displays green because CPU utilization is low.",
    tryItFriction: "Build a Grafana dashboard JSON model implementing the RED method: 1 panel for request rate, 1 panel for HTTP 5xx error percentage, and 1 panel for p99 latency heatmaps.",
    socraticHints: [
      "What are the three components of the RED Method for microservice monitoring?",
      "Rate (req/sec), Errors (5xx failures), and Duration (latency distribution / percentiles)!",
      "It focuses on the user-facing experience rather than internal machine hardware metrics."
    ],
    situationalPuzzle: {
      scenario: "A user checkout request takes 8 seconds to complete. The request spans 6 microservices (Gateway -> Auth -> Order -> Inventory -> Payment -> Email). Logs show each service succeeded, but the user suffered an 8-second delay. How does an engineer instantly isolate which specific microservice caused the delay?",
      options: [
        "Ask developers to look at their code.",
        "Distributed Tracing with OpenTelemetry & Jaeger: Inspect the distributed trace waterfall; trace spans and `W3C TraceContext` propagation visually pinpoint the exact microservice and database query that consumed the 8 seconds.",
        "Reboot all 6 microservices.",
        "Add more memory to the Gateway."
      ],
      answerIdx: 1,
      debrief: "In distributed microservices, logs cannot correlate timing across asynchronous boundaries. Distributed tracing injects a trace ID (`traceparent` header) into HTTP calls, generating a visual waterfall timeline showing the exact execution duration of every hop."
    },
    quests: [
      { id: "devops-m1-d25-q1", name: "The RED Method & Distributed Tracing Context Propagation", type: "concept", desc: "Trace W3C TraceContext (`traceparent`, `tracestate`) across HTTP headers and OTel Collector pipelines." },
      { id: "devops-m1-d25-q2", name: "Detective Lab: The Invisible Multi-Service Latency Bottleneck", type: "detective", desc: "Use a Jaeger trace waterfall to identify a hidden 6-second synchronous database query in an internal worker." },
      { id: "devops-m1-d25-q3", name: "Mastery Assignment: Production RED Method Grafana Dashboard Spec", type: "assignment", desc: "Author a complete Grafana dashboard JSON model with dynamic namespace/service template variables." },
      { id: "devops-m1-d25-q4", name: "Production Incident Lab: OpenTelemetry Collector Queue Dropping Triage", type: "detective", desc: "Tune OTel collector batch processors and memory limiters to prevent trace dropping during a traffic surge." }
    ]
  },

  // ─── BLOCK 6: Progressive Delivery, DevSecOps & Zero-Downtime Capstone (Days 26–30)
  {
    day: 26,
    month: 1,
    blockNum: 6,
    title: "Centralized Log Aggregation: Fluent Bit DaemonSets, Elasticsearch/Loki Buffering & High-Cardinality Parsing",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Core Log Systems (DaemonSet Streaming & Structured Parsing)",
    spokenGoal: "Aggregate millions of logs per minute across hundreds of pods: master Fluent Bit DaemonSets, container log scraping (`/var/log/pods`), multiline parsing, backpressure buffering, and streaming to Grafana Loki or Elasticsearch.",
    conceptInvariant: "Applications in containers must write structured JSON logs strictly to `stdout` / `stderr`. Writing logs to local files inside a container breaks log rotation, leaks container disk space, and prevents log collectors from scraping log streams.",
    failureMode: "An application writes logs to `/var/log/app.log` inside the container. The log file grows to 40GB, exhausts the node's disk, and crashes the Kubernetes kubelet, while centralized logging receives zero logs.",
    tryItFriction: "Deploy Fluent Bit as a DaemonSet with a regex parser that extracts JSON timestamps, log levels, request paths, and trace IDs from raw container log lines.",
    socraticHints: [
      "Where should containerized applications write their logs?",
      "Exclusively to `stdout` and `stderr` (standard out and standard error)!",
      "The container runtime writes these streams to `/var/log/pods`, where Fluent Bit collects them automatically."
    ],
    situationalPuzzle: {
      scenario: "During a major production outage, applications begin emitting 100,000 error logs per second. The centralized Elasticsearch cluster becomes overwhelmed and stops accepting logs. Fluent Bit buffers logs in memory until it runs out of RAM and crashes. What Fluent Bit storage setting prevents buffer crashes?",
      options: [
        "Delete all application logs.",
        "Disk-Backed Buffering (`storage.type: filesystem`): Configuring Fluent Bit with filesystem storage buffering stores log chunks safely on host disk when the downstream receiver is slow, preventing memory exhaustion.",
        "Disable logging during outages.",
        "Increase node RAM to 1TB."
      ],
      answerIdx: 1,
      debrief: "By default, log forwarders buffer in RAM. During an outage log burst, memory buffers overflow and crash the forwarder, losing critical diagnostic data. Configuring disk-backed buffering (`storage.type: filesystem`) queues logs on disk until the downstream store recovers."
    },
    quests: [
      { id: "devops-m1-d26-q1", name: "Fluent Bit DaemonSet Architecture & CRI Log Parsing Pipeline", type: "concept", desc: "Trace input plugins (`tail`), filter plugins (`kubernetes`, `parser`), and output plugins (`loki`, `es`)." },
      { id: "devops-m1-d26-q2", name: "Detective Lab: The High-Volume Unstructured Log Disk Saturation", type: "detective", desc: "Fix an application spamming raw unformatted text and convert to structured JSON with Fluent Bit parsing." },
      { id: "devops-m1-d26-q3", name: "Mastery Assignment: Production Fluent Bit DaemonSet Configuration", type: "assignment", desc: "Author complete ConfigMap and DaemonSet manifests with disk-backed buffers and multiline parsing." },
      { id: "devops-m1-d26-q4", name: "Production Incident Lab: Log Collector CPU Saturation Cascade", type: "detective", desc: "Triage a node CPU spike caused by inefficient regex parsing in Fluent Bit and optimize with JSON parsers." }
    ]
  },
  {
    day: 27,
    month: 1,
    blockNum: 6,
    title: "Zero-Downtime Progressive Delivery: Blue-Green Switches, Weighted Canary Deployments & Flagger Automation",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Advanced Deployment Engineering (Canary Analysis & Rollback Automation)",
    spokenGoal: "Eliminate deployment risk entirely: master Progressive Delivery patterns (Blue-Green environment swapping vs Weighted Canary releases), service mesh traffic splitting, Flagger automated canary controllers, and metric-driven automated promotion.",
    conceptInvariant: "A Canary deployment routes a tiny percentage of real user traffic (e.g. 5%) to the new version while 95% remains on stable. The canary controller continuously monitors error rates and latency SLAs; if metrics degrade, traffic reverts to stable instantly with zero user impact.",
    failureMode: "Executing an 'all-at-once' rolling update with an undiscovered bug that crashes on 2% of specific mobile devices; rolling out to 100% of pods impacts all mobile users simultaneously.",
    tryItFriction: "Configure Flagger with Ingress-Nginx or Istio to execute a canary rollout: shift traffic in 10% steps every 1 minute while asserting `< 1%` error rate via Prometheus queries.",
    socraticHints: [
      "Why is a Canary deployment superior to a standard rolling update?",
      "Blast radius control! A canary only exposes 5% or 10% of users to new code while automated metrics verify health.",
      "If a bug is present, 90%+ of users never see it, and traffic rolls back automatically in seconds."
    ],
    situationalPuzzle: {
      scenario: "A fintech app executes a canary release for a new payment engine. At 10% canary traffic, the Prometheus metric `sum(rate(payment_errors_total[1m])) / sum(rate(payment_requests_total[1m]))` exceeds 2.5% (SLA threshold is 1.0%). How does an automated canary controller (like Flagger) react?",
      options: [
        "It promotes the release to 100% anyway.",
        "Automated Canary Rollback: Flagger detects the SLA metric breach, immediately shifts 100% of traffic back to the primary stable version, marks the canary failed, and fires a webhook alert.",
        "It pauses the cluster indefinitely.",
        "It reboots the database."
      ],
      answerIdx: 1,
      debrief: "Automated canary controllers eliminate human error from release decisions. When Prometheus metrics breach pre-defined threshold rules (e.g. error rate > 1%), Flagger halts the deployment, sets traffic weights back to 100% primary, and alerts the team automatically."
    },
    quests: [
      { id: "devops-m1-d27-q1", name: "Progressive Delivery Architecture: Canary Weights & Flagger Loops", type: "concept", desc: "Trace canary CRD evaluation, webhooks for synthetic integration testing, and weight step-ups." },
      { id: "devops-m1-d27-q2", name: "Detective Lab: The Unmonitored Canary Release Blindspot", type: "detective", desc: "Audit a manual canary setup and implement automated Prometheus metric analysis templates." },
      { id: "devops-m1-d27-q3", name: "Mastery Assignment: Production Flagger Canary Deployment Specification", type: "assignment", desc: "Construct a complete Flagger Canary CRD manifest with metric checks, webhooks, and rollback policies." },
      { id: "devops-m1-d27-q4", name: "Production Incident Lab: Flagger Metric Scrape Timeout Emergency", type: "detective", desc: "Resolve a stuck canary deployment caused by a Prometheus metric timeout and execute safe manual abort." }
    ]
  },
  {
    day: 28,
    month: 1,
    blockNum: 6,
    title: "DevSecOps & Supply Chain Defense: Automated SAST (Semgrep), DAST (OWASP ZAP) & Software Bill of Materials (SBOM)",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Security Engineering (Shift-Left Security & Supply Chain Attestation)",
    spokenGoal: "Shift security left into the developer workflow: master Static Application Security Testing (SAST via Semgrep), Dynamic Application Security Testing (DAST via OWASP ZAP), dependency vulnerability scanning (Snyk/Trivy), and Software Bill of Materials (SBOM) generation via Syft.",
    conceptInvariant: "Security vulnerabilities are exponentially cheaper to fix in CI than in production. SAST scanners analyze source code ASTs for injection flaws and insecure crypto on pull request creation; DAST probes test running staging applications for runtime authentication bypasses.",
    failureMode: "Relying solely on an annual manual penetration test to find security flaws, leaving zero-day SQL injection vulnerabilities active in production for 11 months between audits.",
    tryItFriction: "Integrate Semgrep into a GitHub Actions workflow to detect SQL injection and insecure JWT verification, and generate an SBOM using Syft (`syft packages:app.tar -o cyclonedx-json`).",
    socraticHints: [
      "What is the difference between SAST and DAST in DevSecOps?",
      "SAST scans source code statically (white-box); DAST probes running applications dynamically over the network (black-box)!",
      "A complete DevSecOps pipeline runs SAST on pull request, and DAST against the deployed staging environment."
    ],
    situationalPuzzle: {
      scenario: "A government executive order requires all enterprise software vendors to provide a Software Bill of Materials (SBOM) for every release to combat supply chain attacks (like SolarWinds). What information does an SBOM contain, and how is it generated automatically in CI?",
      options: [
        "A list of company employee salaries.",
        "Machine-Readable Dependency Inventory: An SBOM (generated via tools like Syft in CycloneDX or SPDX format) contains a complete, cryptographically verifiable inventory of all direct and transitive dependencies, package hashes, and licenses in the container image.",
        "The application source code printed to PDF.",
        "A list of database passwords."
      ],
      answerIdx: 1,
      debrief: "An SBOM (Software Bill of Materials) is an ingredient list for software. Tools like Syft inspect container layers and package manifests to output a standardized inventory (SPDX or CycloneDX) detailing every library, version, license, and hash embedded in the artifact."
    },
    quests: [
      { id: "devops-m1-d28-q1", name: "Shift-Left DevSecOps Pyramid: SAST, DAST & Dependency Auditing", type: "concept", desc: "Compare static AST analysis, dynamic HTTP fuzzing, and transitive dependency vulnerability matching." },
      { id: "devops-m1-d28-q2", name: "Detective Lab: The Bypassed Dependency Vulnerability Scanner", type: "detective", desc: "Identify a vulnerable transitive dependency (`CVE-2021-44228`) and apply dependency overrides." },
      { id: "devops-m1-d28-q3", name: "Mastery Assignment: Automated Semgrep SAST & Syft SBOM CI Pipeline", type: "assignment", desc: "Build a GitHub Actions workflow executing Semgrep security rulesets and publishing CycloneDX SBOMs." },
      { id: "devops-m1-d28-q4", name: "Production Incident Lab: Compromised Dependency Supply Chain Triage", type: "detective", desc: "Isolate a malicious npm package containing a crypto-stealer and quarantine the affected deployment." }
    ]
  },
  {
    day: 29,
    month: 1,
    blockNum: 6,
    title: "Database Reliability Engineering: Zero-Downtime Schema Migrations & The Expand-Contract Pattern",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Database Reliability Engineering (Zero-Downtime Data Evolution)",
    spokenGoal: "Evolve databases without breaking live applications: master the Expand-Contract (Parallel Run) migration pattern, column renames without locks, backward-compatible schema changes, and migration runners in Kubernetes (Helm Pre-Install hooks / ArgoCD Sync Waves).",
    conceptInvariant: "Database schema migrations must NEVER break the currently running version of the application. During a rolling deployment, Version 1 and Version 2 run SIMULTANEOUSLY. If a migration deletes or renames a column used by Version 1, Version 1 crashes immediately.",
    failureMode: "Running an `ALTER TABLE users RENAME COLUMN email TO user_email;` migration immediately before rolling out new code; active pods running the old code throw SQL errors on every user query during the 5-minute deployment window.",
    tryItFriction: "Execute the 3-step Expand-Contract pattern to rename a column: 1) Expand: Add new column `user_email`, mirror writes to both; 2) Migrate: Backfill existing rows; 3) Contract: Remove old column after all old pods terminate.",
    socraticHints: [
      "Why will renaming a column in a single migration script cause downtime during a rolling deployment?",
      "Because during a rolling update, the OLD code is still running and querying the OLD column name!",
      "Use the Expand-Contract pattern: add the new column first, deploy code that writes to both, then drop the old column later."
    ],
    situationalPuzzle: {
      scenario: "A backend team adds an index to a PostgreSQL table containing 50,000,000 rows (`CREATE INDEX idx_user_email ON users(email);`). The migration locks the table. All production web queries stall, connection pools exhaust, and the entire platform crashes for 45 minutes. What SQL keyword was missing?",
      options: [
        "`WITH FORCE`.",
        "`CREATE INDEX CONCURRENTLY`: In PostgreSQL, creating an index standardly locks the table against writes; using `CONCURRENTLY` builds the index without taking an exclusive write lock, allowing live traffic to continue uninterrupted.",
        "`DROP TABLE users`.",
        "`SET TIMEOUT = 0`."
      ],
      answerIdx: 1,
      debrief: "In relational databases, standard DDL operations lock tables against writes. In PostgreSQL, `CREATE INDEX CONCURRENTLY` scans the table without acquiring an exclusive write lock, ensuring live transactional operations proceed normally during index creation."
    },
    quests: [
      { id: "devops-m1-d29-q1", name: "The Expand-Contract Migration Architecture & Lock Contention", type: "concept", desc: "Trace database locking levels: AccessExclusiveLock vs ShareUpdateExclusiveLock in PostgreSQL." },
      { id: "devops-m1-d29-q2", name: "Detective Lab: The Table-Locking Migration Outage Disaster", type: "detective", desc: "Refactor a dangerous blocking `ALTER TABLE` migration into non-blocking concurrent operations." },
      { id: "devops-m1-d29-q3", name: "Mastery Assignment: 3-Phase Zero-Downtime Expand-Contract Pipeline", type: "assignment", desc: "Construct an automated migration suite executing parallel writes, backfills, and cleanup across releases." },
      { id: "devops-m1-d29-q4", name: "Production Incident Lab: Failed Migration Rollback & Data Recovery", type: "detective", desc: "Recover an inconsistent database state caused by an aborted migration job inside a Kubernetes pre-sync hook." }
    ]
  },
  {
    day: 30,
    month: 1,
    blockNum: 6,
    title: "🏆 MONTH 1 CAPSTONE: `DevOpsShield` Multi-Cluster GitOps Continuous Delivery & Zero-Downtime Platform",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Month 1 Master Capstone Viva & Production Defense",
    spokenGoal: "Defend your complete foundational DevOps engineering mastery: present and defend `DevOpsShield`—an end-to-end, enterprise-grade GitOps Continuous Delivery platform featuring multi-stage Docker builds, GitHub Actions CI matrix pipelines, Trivy security gates, ArgoCD declarative sync, Ingress-Nginx routing, HPA autoscaling, Prometheus/Grafana RED dashboards, and automated Flagger canary rollbacks.",
    conceptInvariant: "A production-grade cloud delivery platform has zero manual touchpoints, enforces immutable promotion across environments, provides automated self-healing against configuration drift, and proves zero downtime during deployments via canary analysis.",
    failureMode: "Presenting a delivery platform that requires human engineers to manually run kubectl commands or SSH into servers during a deployment, failing enterprise automation compliance.",
    tryItFriction: "Demonstrate a complete zero-touch commit-to-production deployment under simulated live user traffic, verifying that a code push progresses through CI, security scans, staging, and canary release with zero dropped requests.",
    socraticHints: [
      "How do you prove to an examination board that your deployment pipeline achieves true zero-downtime?",
      "Run an automated load test (e.g. Apache Bench / k6) continuously throughout the entire deployment!",
      "The test output must show 100% HTTP 200 OK responses with zero 502/503 errors and zero dropped TCP connections."
    ],
    situationalPuzzle: {
      scenario: "During the final Capstone Viva defense, the examination panel injects a failure: 'A developer pushes a broken commit containing a syntax error directly to the `main` branch. Describe the exact sequence of automated systems that intercept and neutralize this threat before it affects users.' What is the senior response?",
      options: [
        "The developer must be alerted via email to fix the syntax error.",
        "Automated Defense in Depth: 1) Branch protection rules reject direct pushes without PR; 2) CI lint and test jobs fail on the syntax error; 3) Docker image build is halted; 4) Even if image pushed, staging smoke tests fail; 5) Flagger canary aborts deployment, leaving production 100% unaffected.",
        "The Kubernetes cluster will crash.",
        "The company must roll back all databases."
      ],
      answerIdx: 1,
      debrief: "A world-class DevOps platform implements defense in depth. Branch protections prevent unreviewed commits, CI test suites catch syntax errors before builds, staging gates verify integration health, and canary analyzers prevent bad code from reaching users, ensuring zero blast radius."
    },
    quests: [
      { id: "devops-m1-d30-q1", name: "Capstone Blueprint: DevOpsShield Enterprise Platform Architecture", type: "concept", desc: "Deliver full architecture documentation: GitOps repository structure, CI workflows, Kubernetes manifests, and telemetry." },
      { id: "devops-m1-d30-q2", name: "Detective Lab: The Pre-Audit Pipeline Security & Reliability Scrub", type: "detective", desc: "Identify and resolve 5 critical security and reliability flaws before submitting the platform for defense." },
      { id: "devops-m1-d30-q3", name: "Mastery Assignment: Automated DevOpsShield GitOps & CI/CD Repository Suite", type: "assignment", desc: "Deliver production GitHub Actions workflows, Helm charts, and ArgoCD manifests for the complete platform." },
      { id: "devops-m1-d30-q4", name: "Capstone Viva: Staff SRE Examination Board Architectural Defense", type: "detective", desc: "Defend your architectural trade-offs, canary metrics, and disaster recovery SLA live before the evaluation panel." }
    ]
  }
];

export const DEVOPS_MONTH_2_SPECS: MasterclassDaySpec[] = [
  // ─── BLOCK 7: Advanced Kubernetes Internals & eBPF Networking (Days 31–35) ────────
  {
    day: 31,
    month: 2,
    blockNum: 7,
    title: "Kubernetes Control Plane Deep Dive: Dynamic Admission Controllers, Mutating & Validating Webhooks",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Advanced Kubernetes Engineering (Dynamic Admission Architecture)",
    spokenGoal: "Intercept and govern every single API request in Kubernetes: master Dynamic Admission Controllers, the difference between Mutating and Validating Webhook Configurations, TLS certificate generation for webhooks, and `failurePolicy` (Fail vs Ignore) disaster scenarios.",
    conceptInvariant: "The Admission Control pipeline evaluates Mutating webhooks first (to inject sidecars, defaults, or labels), followed by Object Schema Validation, followed by Validating webhooks (to accept or reject the request). A validating webhook cannot mutate an object; it can only return an admission decision.",
    failureMode: "Configuring a mission-critical ValidatingWebhookConfiguration with `failurePolicy: Fail` pointing to an internal webhook service that crashes; when developers or controllers attempt to restart pods, the kube-apiserver blocks all pod creation cluster-wide.",
    tryItFriction: "Write a high-speed Mutating Webhook in Go/Node.js that intercepts all Pod creation requests in the `production` namespace and automatically injects an ambient security sidecar and security context.",
    socraticHints: [
      "What is the danger of setting `failurePolicy: Fail` on an admission webhook?",
      "If your webhook server crashes or times out, the kube-apiserver REJECTS all matching API requests cluster-wide!",
      "Always design webhook servers for high availability, or use `failurePolicy: Ignore` for non-critical policies."
    ],
    situationalPuzzle: {
      scenario: "A cluster experiences a total freeze: no new pods can be scheduled, and autoscalers fail. Investigation shows a Mutating Webhook webhook service pod died. Because `failurePolicy: Fail` was configured for all Pods including kube-system, the apiserver cannot even schedule a replacement webhook pod! What is this circular deadlock, and how is it resolved?",
      options: [
        "Reinstall Kubernetes from scratch.",
        "Admission Webhook Circular Deadlock: Prevent it by configuring `namespaceSelector` to strictly exclude `kube-system` and the webhook's own namespace, allowing system controllers and webhook pods to boot without circular dependency.",
        "Delete the Linux kernel.",
        "Set the replica count to zero."
      ],
      answerIdx: 1,
      debrief: "A webhook that intercepts all pods with `failurePolicy: Fail` creates a circular dependency: if the webhook pod dies, the apiserver cannot schedule a new webhook pod to handle requests. Webhooks must always exclude system namespaces and their own namespace via `namespaceSelector`."
    },
    quests: [
      { id: "devops-m2-d31-q1", name: "Kube-Apiserver Admission Pipeline & Webhook Execution Graph", type: "concept", desc: "Trace Authentication -> Authorization (RBAC) -> Mutating Admission -> Schema Validation -> Validating Admission -> etcd." },
      { id: "devops-m2-d31-q2", name: "Detective Lab: The Circular Admission Webhook Deadlock", type: "detective", desc: "Recover an unresponsive cluster by deleting a broken webhook configuration via direct API server bypass." },
      { id: "devops-m2-d31-q3", name: "Mastery Assignment: Production Mutating & Validating Webhook Server in Go", type: "assignment", desc: "Construct an HTTPS webhook server generating JSONPatch mutations and enforcing strict pod resource quotas." },
      { id: "devops-m2-d31-q4", name: "Production Incident Lab: Webhook Timeout Latency Degradation", type: "detective", desc: "Triage a 10-second kubectl command delay caused by an unindexed external webhook database call." }
    ]
  },
  {
    day: 32,
    month: 2,
    blockNum: 7,
    title: "Extending Kubernetes: Custom Resource Definitions (CRDs) & Operator SDK with Reconciler Loops",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Operator Engineering (Custom Controllers & Domain-Specific Automation)",
    spokenGoal: "Build real Kubernetes Operators like a Staff Platform Engineer: master Custom Resource Definitions (CRDs), OpenAPI v3 schema validation, the Operator SDK / Kubebuilder, Controller-Runtime Informer caches, and idempotent Reconcile loops.",
    conceptInvariant: "The Operator Reconcile Loop MUST be completely idempotent. Given the same Custom Resource state, executing the Reconcile function 1 time or 1,000 times must produce the exact same external cluster state without creating duplicate resources.",
    failureMode: "Writing a non-idempotent Reconcile loop that creates a new database user every time the reconciler is invoked; on a cluster restart with 50 reconciliations, the operator creates 50 duplicate users and crashes the database.",
    tryItFriction: "Build a custom Kubernetes Operator using Kubebuilder / Operator SDK that watches a `DatabaseBackup` CRD and automatically provisions, monitors, and cleans up an ephemeral S3 backup Job.",
    socraticHints: [
      "Why must an Operator's Reconcile function be strictly idempotent?",
      "Because the Kubernetes controller-runtime invokes Reconcile repeatedly on events, periodic syncs, and errors!",
      "It must check if the child resource already exists before attempting to create it."
    ],
    situationalPuzzle: {
      scenario: "A custom Operator's reconcile loop queries the Kubernetes API server directly using client-go on every single reconciliation: `clientset.CoreV1().Pods().List(...)`. During high cluster load, the kube-apiserver CPU spikes to 100% and crashes. What component of `controller-runtime` should the operator have used instead?",
      options: [
        "A Bash script running in a loop.",
        "Informer Cache (Split Client): Operators must read state from the in-memory Informer cache (which watches events and caches state locally in RAM), and write only mutations to the API server, preventing API server starvation.",
        "Store the pods in a CSV file.",
        "Increase apiserver memory."
      ],
      answerIdx: 1,
      debrief: "Directly querying the API server on every reconciliation overwhelms etcd and apiserver bandwidth. `controller-runtime` provides Informer caches that maintain local in-memory reflections of cluster state via watch streams, reducing read load on the API server to near zero."
    },
    quests: [
      { id: "devops-m2-d32-q1", name: "Kubernetes Operator Pattern & Controller-Runtime Architecture", type: "concept", desc: "Trace Informer factory, WorkQueue, EventHandlers, Reconcile loop triggers, and Status subresources." },
      { id: "devops-m2-d32-q2", name: "Detective Lab: The Non-Idempotent Duplicate Resource Leak", type: "detective", desc: "Fix an operator that creates orphan Services on every sync by implementing proper OwnerReferences." },
      { id: "devops-m2-d32-q3", name: "Mastery Assignment: Ephemeral Database Provisioner Operator in Go", type: "assignment", desc: "Author a complete Kubebuilder operator reconciling a Custom Resource into managed StatefulSets and Secrets." },
      { id: "devops-m2-d32-q4", name: "Production Incident Lab: Custom Resource Finalizer Deadlock Emergency", type: "detective", desc: "Recover a stuck Custom Resource that cannot be deleted due to an unhandled finalizer hanging in the operator." }
    ]
  },
  {
    day: 33,
    month: 2,
    blockNum: 7,
    title: "Policy as Code: Pod Security Standards (PSS), Kyverno & OPA Gatekeeper Admission Policies",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Enterprise Governance (Declarative Policy as Code Enforcement)",
    spokenGoal: "Enforce enterprise compliance without writing Go code: master Kubernetes native Pod Security Standards (Privileged, Baseline, Restricted), Kyverno declarative policies, Open Policy Agent (OPA) Gatekeeper with Rego, and automated policy mutation/validation.",
    conceptInvariant: "The Pod Security Standards `restricted` profile enforces defense-in-depth: containers must run as non-root, drop all capabilities (except `NET_BIND_SERVICE`), disallow privilege escalation, use read-only root filesystems, and restrict host namespaces.",
    failureMode: "Relying on human code reviews to enforce container security; a developer accidentally submits a Helm chart with `privileged: true` and host PID sharing, which slips into production and gets exploited by attackers.",
    tryItFriction: "Author a Kyverno policy that automatically inspects every incoming Pod in the cluster, verifies it has memory and CPU limits, and injects `allowPrivilegeEscalation: false` if missing.",
    socraticHints: [
      "Why is Kyverno often preferred over OPA Gatekeeper for Kubernetes-native policy enforcement?",
      "Kyverno policies are written in pure Kubernetes YAML! No need to learn a specialized language like Rego.",
      "Kyverno can validate, mutate, and generate Kubernetes resources natively."
    ],
    situationalPuzzle: {
      scenario: "An enterprise mandates that under PCI-DSS, no container may ever mount the host Docker socket (`/var/run/docker.sock`) or run in privileged mode. An engineer writes an OPA Gatekeeper ConstraintTemplate in Rego. A rogue pod attempting to mount the docker socket is rejected at admission. Where was the violation intercepted?",
      options: [
        "In the Linux kernel on the worker node.",
        "At the kube-apiserver Validating Admission Phase: OPA Gatekeeper's admission webhook intercepts the Pod JSON payload before it is written to etcd or scheduled, evaluating the Rego AST and rejecting the request instantly.",
        "Inside the Docker daemon.",
        "In the client's terminal."
      ],
      answerIdx: 1,
      debrief: "Policy-as-Code engines (OPA Gatekeeper, Kyverno) integrate into the Kubernetes API server admission pipeline. Policy violations are blocked at the front door before the resource ever enters etcd or reaches a worker node, guaranteeing zero non-compliant resources in the cluster."
    },
    quests: [
      { id: "devops-m2-d33-q1", name: "Pod Security Standards (PSS) Levels: Privileged, Baseline, Restricted", type: "concept", desc: "Compare namespace-level PSS labels (`enforce`, `audit`, `warn`) against external admission controllers." },
      { id: "devops-m2-d33-q2", name: "Detective Lab: The Bypassed Privileged Container Security Audit", type: "detective", desc: "Audit a cluster for unhardened containers and apply Kyverno policies enforcing the restricted PSS profile." },
      { id: "devops-m2-d33-q3", name: "Mastery Assignment: Enterprise Kyverno & OPA Rego Security Policy Suite", type: "assignment", desc: "Construct declarative policies blocking root containers, host namespaces, and enforcing trusted registries." },
      { id: "devops-m2-d33-q4", name: "Production Incident Lab: Overly Aggressive Policy Cluster Lockout", type: "detective", desc: "Recover from an emergency where an erroneous Rego policy blocked critical kube-system ingress controllers." }
    ]
  },
  {
    day: 34,
    month: 2,
    blockNum: 7,
    title: "Kernel-Level Cloud Networking: eBPF Architecture, Cilium CNI, XDP Packet Acceleration & Hubble Observability",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Next-Gen Cloud Networking (eBPF Virtual Machine & Kernel Bypass)",
    spokenGoal: "Replace bloated iptables with kernel-level eBPF: master Extended Berkeley Packet Filter (eBPF) bytecode, the Cilium CNI, eXpress Data Path (XDP) wire-speed packet filtering, kube-proxy replacement, and Hubble network flow observability.",
    conceptInvariant: "Legacy `kube-proxy` scales with O(N) complexity: each service adds sequential iptables rules that the Linux kernel must traverse line by line, degrading throughput above 5,000 services. Cilium eBPF replaces iptables with O(1) hash table lookups executed directly inside the Linux kernel socket layer.",
    failureMode: "Running an enterprise cluster with 10,000 services on legacy iptables kube-proxy; updating a single service takes 15 seconds of CPU time across all nodes to re-sync iptables rules, causing network packet drops.",
    tryItFriction: "Deploy Cilium in `kubeProxyReplacement: strict` mode, run a packet benchmark, and observe network latency drop by 40% while tracking Layer 7 HTTP flows in Hubble UI.",
    socraticHints: [
      "Why is Cilium eBPF drastically faster than legacy kube-proxy iptables?",
      "eBPF bypasses iptables entirely! It processes packets at the socket layer and network driver (XDP) using O(1) BPF maps.",
      "No iptables chain traversal overhead, and sub-microsecond packet forwarding."
    ],
    situationalPuzzle: {
      scenario: "A fintech security engineer needs to enforce Layer 7 network security (e.g. Pod A can only execute `GET /orders` on Pod B, and all other paths like `DELETE` are blocked). Standard Kubernetes NetworkPolicies only support Layer 3/4 (IP and Port). How does Cilium achieve Layer 7 filtering without deploying heavy Envoy sidecar proxies?",
      options: [
        "Kubernetes cannot filter HTTP methods.",
        "Cilium Network Policy (CNP) with eBPF Kernel Redirection: Cilium inspects Layer 7 HTTP protocols directly at the kernel socket layer via eBPF and embedded proxies, enforcing HTTP method and path rules natively.",
        "Recompile the Linux kernel manually.",
        "Ask developers to write if-statements."
      ],
      answerIdx: 1,
      debrief: "Standard Kubernetes NetworkPolicies are limited to Layer 3 (IP CIDRs) and Layer 4 (TCP/UDP ports). Cilium extends policy capabilities to Layer 7 using eBPF, enabling fine-grained security policies that inspect and restrict specific HTTP methods, paths, and headers."
    },
    quests: [
      { id: "devops-m2-d34-q1", name: "eBPF Virtual Machine Internals: Verifier, JIT Compiler & BPF Maps", type: "concept", desc: "Trace eBPF program attachment points: kprobes, tracepoints, XDP, and cgroup socket programs." },
      { id: "devops-m2-d34-q2", name: "Detective Lab: The iptables O(N) Rule Traversal Latency Bottleneck", type: "detective", desc: "Profile a 5,000-service cluster suffering from iptables sync overhead and migrate to Cilium eBPF." },
      { id: "devops-m2-d34-q3", name: "Mastery Assignment: Cilium Layer 7 Zero-Trust Network Security Policy", type: "assignment", desc: "Author CiliumNetworkPolicy manifests enforcing granular HTTP path restrictions and mutual TLS." },
      { id: "devops-m2-d34-q4", name: "Production Incident Lab: Hubble Flow Telemetry Packet Drop Diagnosis", type: "detective", desc: "Diagnose an inter-service communication failure using Hubble CLI packet drop reason codes." }
    ]
  },
  {
    day: 35,
    month: 2,
    blockNum: 7,
    title: "⭐ MILESTONE 6: Enterprise Kubernetes Custom Controller with Mutating Webhook & Cilium eBPF Zero Trust",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Month 2 Milestone Synthesis (Advanced Platform Engineering)",
    spokenGoal: "Architect and prove advanced platform engineering mastery: build an enterprise Kubernetes platform combining a custom Go Operator reconciler, a high-availability Mutating Admission Webhook injecting ambient security contexts, and Cilium eBPF Layer 7 zero-trust network policies.",
    conceptInvariant: "Platform engineering abstracts infrastructure complexity from developers. When a developer submits a simple high-level Custom Resource, the platform operator and admission webhooks automatically synthesize production-hardened Deployments, security policies, and eBPF network rules behind the scenes.",
    failureMode: "Building platform automation that modifies objects without proper conflict resolution, causing race conditions between the admission webhook and the operator reconciler.",
    tryItFriction: "Deploy the custom Operator and Webhook into a live cluster, create a sample application, and verify automated eBPF network enforcement and sidecar injection in under 3 seconds.",
    socraticHints: [
      "How do an Operator and an Admission Webhook work together in an enterprise platform?",
      "The Webhook acts as the gatekeeper (validating/mutating API requests at admission time)!",
      "The Operator acts as the lifecycle manager (continuously reconciling child resources in the background)."
    ],
    situationalPuzzle: {
      scenario: "During an audit of the new custom platform, security tools show that pods created by the custom operator are passing all PSS restricted checks. However, an attacker attempts to send an HTTP POST to `/admin/delete` from an unapproved service. Cilium eBPF blocks the packet at the kernel level and records an alert in Hubble. What made this defense impossible with standard Kubernetes NetworkPolicies?",
      options: [
        "Kubernetes NetworkPolicies do not support TCP.",
        "Layer 7 Kernel Inspection: Standard NetworkPolicies only filter IP addresses and ports; Cilium eBPF parses the HTTP protocol in-kernel and dropped the request specifically based on the HTTP method (`POST`) and path (`/admin/delete`).",
        "The Linux firewall was turned off.",
        "Cilium requires root access on developer laptops."
      ],
      answerIdx: 1,
      debrief: "Standard Kubernetes NetworkPolicies cannot inspect application payloads. Cilium's eBPF integration operates at Layer 7, inspecting HTTP methods, paths, and headers directly in the kernel, enabling deep zero-trust microsegmentation that blocks unauthorized API operations."
    },
    quests: [
      { id: "devops-m2-d35-q1", name: "Milestone Architecture: Advanced Kubernetes Platform Blueprint", type: "concept", desc: "Design the platform architecture: Custom CRDs -> Controller-Runtime Reconciler -> Webhook -> Cilium L7." },
      { id: "devops-m2-d35-q2", name: "Detective Lab: The Webhook-Operator Infinite Mutation Reconciliation Loop", type: "detective", desc: "Resolve a CPU spike caused by an admission webhook fighting with an operator reconciler over object metadata." },
      { id: "devops-m2-d35-q3", name: "Mastery Assignment: End-to-End Go Operator & Cilium Policy Platform Suite", type: "assignment", desc: "Author the complete Go controller codebase, TLS cert generator, and CiliumNetworkPolicy manifests." },
      { id: "devops-m2-d35-q4", name: "Production Incident Lab: Kernel eBPF Map Memory Saturation Triage", type: "detective", desc: "Diagnose an eBPF BPF map overflow and safely tune Cilium connection tracking map limits." }
    ]
  },

  // ─── BLOCK 8: High-Throughput CI Farms & Multi-Cluster Federation (Days 36–40) ────
  {
    day: 36,
    month: 2,
    blockNum: 8,
    title: "High-Scale CI Compute Farms: Ephemeral Kubernetes Pod Runners & Actions Runner Controller (ARC)",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "CI Infrastructure Scaling (Self-Hosted Ephemeral Runners)",
    spokenGoal: "Eliminate CI queue bottlenecks and slash cloud costs: master self-hosted GitHub Actions runners on Kubernetes, Actions Runner Controller (ARC), ephemeral pod runner lifecycles, and auto-scaling runners based on GitHub webhook queue pressure.",
    conceptInvariant: "Self-hosted CI runners must be strictly EPHEMERAL. Every CI job must execute inside a freshly provisioned container or VM and be completely destroyed immediately upon job completion. Reusing persistent self-hosted runners across jobs allows malicious PRs to persist backdoors and poison subsequent builds.",
    failureMode: "Running a permanent persistent self-hosted runner on a bare-metal server; an untrusted PR modifies `/usr/bin/npm` to inject malware, infecting all subsequent production releases built on that runner.",
    tryItFriction: "Deploy Actions Runner Controller (ARC) on an EKS/GKE cluster with an `AutoscalingRunnerSet` that scales from 0 to 50 runners based on queued workflow runs.",
    socraticHints: [
      "Why must self-hosted CI runners be ephemeral (destroyed after every single job)?",
      "Security isolation! Persistent runners accumulate stale files, compromised dependencies, and backdoors.",
      "Ephemeral runners guarantee a fresh, sterile, isolated environment for every build."
    ],
    situationalPuzzle: {
      scenario: "An engineering team switches from GitHub-hosted runners to an on-premises Kubernetes ARC runner cluster. Build queue times drop from 10 minutes to 5 seconds. However, builds that execute `docker build` fail with `Cannot connect to the Docker daemon at unix:///var/run/docker.sock`. What container-in-container mechanism is required?",
      options: [
        "Docker cannot run inside Kubernetes.",
        "Docker-in-Docker (DinD) or Kaniko / Buildah: The runner pod requires either a DinD sidecar container with privileged security context, or a daemonless container builder (like Kaniko or Buildah) that builds OCI images in unprivileged user space.",
        "Run the runner on Windows 95.",
        "Make the GitHub repository public."
      ],
      answerIdx: 1,
      debrief: "Kubernetes pod runners do not have access to a host Docker daemon by default. To build container images inside pod runners, platform teams configure a Docker-in-Docker (DinD) sidecar or adopt unprivileged daemonless builders like Kaniko or BuildKit."
    },
    quests: [
      { id: "devops-m2-d36-q1", name: "Actions Runner Controller (ARC) Architecture & Ephemeral Autoscaling", type: "concept", desc: "Trace GitHub webhook events, ARC controller listener, runner pod provisioning, and garbage collection." },
      { id: "devops-m2-d36-q2", name: "Detective Lab: The Persistent Runner Shared State Security Breach", type: "detective", desc: "Audit a compromised self-hosted runner pool and migrate all workflows to isolated ARC ephemeral runners." },
      { id: "devops-m2-d36-q3", name: "Mastery Assignment: Production AutoscalingRunnerSet Manifest Suite", type: "assignment", desc: "Author ARC Helm configurations and runner scale sets with DinD sidecars and resource limits." },
      { id: "devops-m2-d36-q4", name: "Production Incident Lab: ARC Webhook Rate-Limit Throttling Disaster", type: "detective", desc: "Triage a CI queue freeze caused by exhausting GitHub REST API rate limits and configure webhook listeners." }
    ]
  },
  {
    day: 37,
    month: 2,
    blockNum: 8,
    title: "Advanced BuildKit Optimization: Distributed Registry Caching, Multi-Platform Emulation & Daemonless Builds",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Container Build Systems (High-Throughput Distributed Caching)",
    spokenGoal: "Build container images at extreme velocity: master Moby BuildKit architecture, daemonless builds, remote registry inline caching (`--cache-to type=registry,mode=max`), multi-platform emulation via QEMU, and native cross-compilation.",
    conceptInvariant: "In ephemeral CI environments (where the runner disk is wiped on every build), local Docker cache is completely useless. BuildKit solves this with remote registry caching: it exports cache metadata and layers directly to the container registry, allowing any runner in the world to pull cache hits instantly.",
    failureMode: "Running ephemeral CI runners with standard `docker build`, forcing every build to re-compile 45 minutes of C++ or Rust code from scratch because local cache does not persist between jobs.",
    tryItFriction: "Configure BuildKit to export full cache manifests to an OCI registry using `--cache-to type=registry,ref=myreg/app:cache,mode=max` and verify a subsequent build completes in 4 seconds.",
    socraticHints: [
      "Why does standard Docker layer caching fail completely on ephemeral CI runners?",
      "Because ephemeral runners are wiped clean after every build! There is no local disk cache to reuse.",
      "Use BuildKit remote caching: store cache layers in your container registry so any runner can fetch them."
    ],
    situationalPuzzle: {
      scenario: "A build pipeline builds multi-architecture images for both `linux/amd64` and `linux/arm64`. Building the ARM64 image takes 28 minutes because it uses QEMU software CPU emulation on an Intel runner. How can the build speed be increased by 10x without buying new hardware?",
      options: [
        "Delete the ARM64 image.",
        "Go / Rust Native Cross-Compilation: Instead of emulating the entire ARM64 OS with QEMU, use a single AMD64 builder stage and set `GOARCH=arm64` (or Rust target) to cross-compile the binary natively at full Intel CPU speed, copying the binary into an ARM64 scratch base.",
        "Run the build inside a browser.",
        "Slow down the AMD64 build to match."
      ],
      answerIdx: 1,
      debrief: "QEMU software CPU emulation emulates instructions one by one, running up to 10x slower than bare metal. Modern compiled languages (Go, Rust, C++) support native cross-compilation, compiling ARM64 binaries on AMD64 CPUs in seconds without any QEMU emulation overhead."
    },
    quests: [
      { id: "devops-m2-d37-q1", name: "BuildKit Solver DAG Architecture & OCI Cache Exporters", type: "concept", desc: "Trace low-level LLB (Low-Level Builder) graph optimization, parallel stage execution, and cache metadata formats." },
      { id: "devops-m2-d37-q2", name: "Detective Lab: The QEMU Emulation 30-Minute CI Build Crawl", type: "detective", desc: "Refactor a bloated multi-arch build from slow QEMU emulation to high-speed native Go cross-compilation." },
      { id: "devops-m2-d37-q3", name: "Mastery Assignment: Distributed BuildKit Remote Cache Pipeline", type: "assignment", desc: "Author an optimized GitHub Actions workflow leveraging Buildx with registry cache and GitHub Actions cache backends." },
      { id: "devops-m2-d37-q4", name: "Production Incident Lab: BuildKit Cache Poisoning Security Vulnerability", type: "detective", desc: "Investigate and remediate a supply chain attack where an untrusted branch poisoned the shared remote build cache." }
    ]
  },
  {
    day: 38,
    month: 2,
    blockNum: 8,
    title: "Progressive Delivery at Scale: Flagger Automated Canary Analysis with Linkerd/Istio & Latency SLAs",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Advanced Traffic Management (Canary Analytics & Mesh Integration)",
    spokenGoal: "Automate progressive releases across hundreds of microservices: integrate Flagger with service meshes (Linkerd and Istio), execute automated canary analysis using statistical metrics, configure webhooks for synthetic integration load testing, and enforce latency SLA gates.",
    conceptInvariant: "Canary analysis must evaluate both Error Rate AND Latency Percentiles. A new release that returns HTTP 200 OK for every request but suffers a 4,000ms p99 latency spike is a critical failure. Flagger must evaluate multiple PromQL metric templates concurrently.",
    failureMode: "Gating a canary release strictly on HTTP 5xx error rates; a new release with an unindexed database query causes a 5-second latency spike for all users, but canary analysis marks it 100% successful because no 5xx errors occurred.",
    tryItFriction: "Write a Flagger `MetricTemplate` calculating p99 latency (`histogram_quantile(0.99, ...)`), attaching it to a Canary resource that halts deployment if latency exceeds 500ms.",
    socraticHints: [
      "Why must canary analysis monitor latency percentiles in addition to error rates?",
      "Because slow software is broken software! An app can return 200 OK while taking 10 seconds to respond.",
      "Always configure both error rate (e.g. < 1%) and p99 latency (e.g. < 500ms) thresholds in your canary checks."
    ],
    situationalPuzzle: {
      scenario: "An enterprise deploys a canary release to an internal microservice during a low-traffic period at midnight. Only 5 requests per minute hit the service. A single transient 500 error causes the error rate metric to register 20% (1/5), immediately aborting a healthy deployment. How do you prevent false-positive canary aborts during low traffic?",
      options: [
        "Disable all canary testing at night.",
        "Flagger Webhook Load Generators & Minimum Request Thresholds: Configure Flagger `webhooks` with an automated load tester (e.g. k6 / hey) to generate synthetic baseline traffic during canary analysis, or configure metric thresholds with minimum request volume guards.",
        "Change the error threshold to 50%.",
        "Reboot the service mesh."
      ],
      answerIdx: 1,
      debrief: "Statistical canary analysis requires a statistically significant request sample size. During low-traffic periods, single transient errors skew percentage calculations. Flagger supports automated webhook load testing (using tools like k6 or hey) to generate synthetic traffic during analysis."
    },
    quests: [
      { id: "devops-m2-d38-q1", name: "Flagger MetricTemplate Architecture & Service Mesh Traffic Shifting", type: "concept", desc: "Trace Istio VirtualService weights, Linkerd traffic splitters, and Prometheus query evaluation loops." },
      { id: "devops-m2-d38-q2", name: "Detective Lab: The Low-Traffic Flagger False-Positive Rollback", type: "detective", desc: "Debug an aborted midnight deployment and attach automated synthetic traffic generation webhooks." },
      { id: "devops-m2-d38-q3", name: "Mastery Assignment: Dual-Metric Flagger Canary Specification in Istio", type: "assignment", desc: "Author a complete Canary manifest enforcing 99% success rate and 300ms p99 latency limits with k6 testing." },
      { id: "devops-m2-d38-q4", name: "Production Incident Lab: Service Mesh Envoy Proxy Routing Black Hole", type: "detective", desc: "Resolve a routing deadlock where a corrupted Istio DestinationRule caused 50% of user traffic to drop." }
    ]
  },
  {
    day: 39,
    month: 2,
    blockNum: 8,
    title: "Cross-Plane Infrastructure Orchestration: Cluster API (CAPI), Karmada Multi-Cluster Federation & Workload Placement",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Multi-Cluster Engineering (Cluster API & Multi-Cloud Federation)",
    spokenGoal: "Treat entire Kubernetes clusters as declarative resources: master Cluster API (CAPI), manage cluster lifecycles using Kubernetes CRDs, multi-cluster federation with Karmada, intelligent multi-cloud workload placement, and cross-cluster failover.",
    conceptInvariant: "In modern cloud platforms, clusters are cattle, not pets. With Cluster API (CAPI), you declare an entire EKS/GKE cluster as a YAML manifest in a management cluster; CAPI provisions the VPC, control planes, and worker nodes automatically via declarative reconciliation.",
    failureMode: "Managing 30 production Kubernetes clusters manually via individual cloud provider consoles or brittle shell scripts; when a critical Kubernetes CVE requires upgrading all clusters, engineers spend 3 weeks executing manual upgrades.",
    tryItFriction: "Write a Cluster API manifest (`Cluster`, `MachineDeployment`, `AWSCluster`) declaring a multi-AZ production Kubernetes cluster managed entirely by a CAPI controller.",
    socraticHints: [
      "What is the core philosophy of Cluster API (CAPI)?",
      "Use Kubernetes to manage Kubernetes! Declare clusters as custom resources in a management cluster.",
      "Spin up, upgrade, and delete entire Kubernetes clusters declaratively using standard kubectl workflows."
    ],
    situationalPuzzle: {
      scenario: "An enterprise operates clusters in US, Europe, and Asia. A new data privacy law requires all user-facing services in Germany to be hosted strictly within European clusters, while analytics jobs run in the US. Which multi-cluster federation tool enables declarative policy-based workload placement across clusters?",
      options: [
        "A manual bash script that runs kubectl against different contexts.",
        "Karmada / Cluster API with PropagationPolicies: Karmada evaluates declarative placement policies (e.g. `clusterAffinity: { labelSelector: { region: europe } }`) and automatically schedules workloads across the federated cluster fleet.",
        "Delete all non-European clusters.",
        "Store the clusters in an S3 bucket."
      ],
      answerIdx: 1,
      debrief: "Karmada provides multi-cluster federation. By writing `PropagationPolicy` or `OverridePolicy` manifests, architects define declarative placement rules (e.g., regional compliance, latency, or compute cost) that automatically distribute Kubernetes deployments across heterogeneous global clusters."
    },
    quests: [
      { id: "devops-m2-d39-q1", name: "Cluster API (CAPI) Control Plane Architecture & Machine Lifecycles", type: "concept", desc: "Trace Management Cluster -> Infrastructure Provider (CAPA/CAPG) -> Workload Cluster bootstrapping." },
      { id: "devops-m2-d39-q2", name: "Detective Lab: The Unmanaged Cluster Configuration Sprawl", type: "detective", desc: "Audit 12 disparate standalone clusters and unify their lifecycle management under Cluster API." },
      { id: "devops-m2-d39-q3", name: "Mastery Assignment: Karmada Multi-Cluster Federation & PropagationPolicy Spec", type: "assignment", desc: "Construct Karmada policies federating a microservice across 3 regional clusters with geo-affinity." },
      { id: "devops-m2-d39-q4", name: "Production Incident Lab: Federated Cluster Network Desync Emergency", type: "detective", desc: "Triage a cross-cluster control plane desynchronization where a failed regional cluster dropped federated status." }
    ]
  },
  {
    day: 40,
    month: 2,
    blockNum: 8,
    title: "⭐ MILESTONE 7: Enterprise Self-Hosted Autoscaling CI Runner Farm with Distributed BuildKit Cache",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Month 2 Milestone Synthesis (High-Scale CI Platform Engineering)",
    spokenGoal: "Architect and prove extreme scale developer infrastructure: deploy a production self-hosted CI runner platform using Actions Runner Controller (ARC) on Kubernetes, dynamic webhook autoscaling from 0 to 100 ephemeral runners, distributed BuildKit remote caching on Amazon ECR, and sub-45-second build times for large microservices.",
    conceptInvariant: "Developer velocity is a competitive moat. A high-scale CI farm must eliminate queue times through sub-second runner provisioning, enforce absolute container isolation between jobs, and achieve 90%+ cache hit ratios across all build layers.",
    failureMode: "Deploying self-hosted runners without cgroup resource limits, allowing a single rogue test with a runaway memory leak to consume all node RAM and kill the ARC runner controller pod.",
    tryItFriction: "Trigger 30 simultaneous GitHub Actions workflows, observing ARC scale out 30 ephemeral runner pods on Kubernetes, execute builds with shared remote BuildKit cache hits, and tear down cleanly in under 2 minutes.",
    socraticHints: [
      "How do you ensure 50 concurrent builds don't re-download the same base images and dependencies?",
      "Use distributed BuildKit remote caching with an internal container registry!",
      "Runner 1 uploads the cache layer; Runners 2 through 50 pull the pre-compiled layer instantly."
    ],
    situationalPuzzle: {
      scenario: "During an audit of the self-hosted CI farm, an engineer points out that runner pods mount host Docker sockets to run Docker-in-Docker. A malicious pull request could execute a container escape and gain root on the Kubernetes worker node. How must the platform be refactored to eliminate privileged security contexts?",
      options: [
        "Disable all container builds in CI.",
        "Rootless BuildKit / Kaniko: Migrate the CI runners to rootless BuildKit or daemonless Kaniko/Buildah, building OCI containers entirely in unprivileged user space without requiring `/var/run/docker.sock` or `privileged: true`.",
        "Allow developers to run as root.",
        "Reboot the CI runners after every build."
      ],
      answerIdx: 1,
      debrief: "Mounting the host Docker socket or using privileged DinD creates severe security vulnerabilities. Adopting rootless BuildKit or unprivileged builders like Kaniko allows CI runners to assemble OCI container images without requiring root host permissions or Docker daemon access."
    },
    quests: [
      { id: "devops-m2-d40-q1", name: "Milestone Architecture: Enterprise Autoscaling CI Runner Farm Blueprint", type: "concept", desc: "Design the complete platform: ARC Controller -> AutoscalingRunnerSets -> Rootless BuildKit -> ECR Cache." },
      { id: "devops-m2-d40-q2", name: "Detective Lab: The Privileged DinD Host Escape Vulnerability", type: "detective", desc: "Audit a CI farm for privileged container vulnerabilities and refactor to unprivileged rootless BuildKit." },
      { id: "devops-m2-d40-q3", name: "Mastery Assignment: End-to-End ARC Runner & BuildKit Cache Platform Suite", type: "assignment", desc: "Author complete Kubernetes manifests configuring ARC runner sets with remote caching and autoscaling." },
      { id: "devops-m2-d40-q4", name: "Production Incident Lab: CI Cluster Resource Exhaustion Storm", type: "detective", desc: "Triage a cluster outage caused by 100 simultaneous runner pods exhausting node IP addresses and CPU quotas." }
    ]
  },

  // ─── BLOCK 9: Supply Chain Security & Zero-Trust Governance (Days 41–45) ─────────
  {
    day: 41,
    month: 2,
    blockNum: 9,
    title: "Software Bill of Materials (SBOM): Syft, CycloneDX Spec, SPDX Standards & Dependency Vulnerability Graphs",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Supply Chain Security (Software Provenance & Vulnerability Graphs)",
    spokenGoal: "Achieve complete software transparency: master Software Bill of Materials (SBOM) standards (CycloneDX and SPDX), automated generation via Syft, dependency graph extraction, and automated vulnerability enrichment using Grype and OSV databases.",
    conceptInvariant: "An SBOM must be cryptographically attested and attached to the container image in the registry. A compiled container image without an attached, signed SBOM is an unverified black box that cannot be audited for newly discovered zero-day vulnerabilities.",
    failureMode: "When a zero-day vulnerability (like Log4j or OpenSSL) drops, an enterprise spends 4 weeks manually inspecting source code repositories because they have no centralized SBOM index to search across production images.",
    tryItFriction: "Generate a CycloneDX JSON SBOM for a production image using Syft, enrich it with Grype, and query it using `jq` to locate all packages with licenses incompatible with commercial distribution.",
    socraticHints: [
      "Why is having a searchable SBOM index critical when a major zero-day vulnerability drops?",
      "Instant queryability! Instead of re-scanning thousands of repositories, you query your SBOM database in 2 seconds.",
      "You instantly identify every container image in production running the affected library version."
    ],
    situationalPuzzle: {
      scenario: "A critical zero-day vulnerability is announced in `libssl3` version `3.0.2`. The CTO asks: 'Which of our 250 production microservices are currently running this vulnerable version in production?' The team has an SBOM catalog indexed in an OCI registry. How is this answered in under 60 seconds?",
      options: [
        "Re-deploy all 250 microservices.",
        "Automated SBOM Index Query: Query the centralized SBOM vulnerability database (or scan indexed CycloneDX documents) for package name `libssl3` and version `3.0.2`, instantly listing the 4 exact container image digests affected.",
        "Wait for customers to report an exploit.",
        "Ask developers to check their package.json."
      ],
      answerIdx: 1,
      debrief: "An indexed Software Bill of Materials (SBOM) catalog decouples vulnerability discovery from application redeployment. When a new CVE is disclosed, security engineers query existing SBOM metadata directly to pinpoint every running container image containing the vulnerable library in seconds."
    },
    quests: [
      { id: "devops-m2-d41-q1", name: "SBOM Architectural Specifications: CycloneDX vs SPDX Ontologies", type: "concept", desc: "Analyze component identification, purl (Package URL) schemes, hash algorithms, and vulnerability schemas." },
      { id: "devops-m2-d41-q2", name: "Detective Lab: The Unindexed Zero-Day Library Discovery Panic", type: "detective", desc: "Build an automated SBOM parser locating vulnerable packages across 50 container images in under 10 seconds." },
      { id: "devops-m2-d41-q3", name: "Mastery Assignment: Automated Syft SBOM Generation & Grype Scanning Pipeline", type: "assignment", desc: "Author a GitHub Actions workflow generating CycloneDX SBOMs and gating releases on Grype findings." },
      { id: "devops-m2-d41-q4", name: "Production Incident Lab: Viral License Contamination Emergency", type: "detective", desc: "Isolate a proprietary container contaminated with an unapproved GPL-3.0 copyleft dependency using SBOM audits." }
    ]
  },
  {
    day: 42,
    month: 2,
    blockNum: 9,
    title: "Cryptographic Container Signing: Cosign, Sigstore Rekor Transparency Logs & Keyless OIDC Attestation",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Supply Chain Cryptography (Keyless Signing & Transparency Logs)",
    spokenGoal: "Eliminate compromised container spoofing: master cryptographic artifact signing using Sigstore Cosign, keyless signing via OpenID Connect (OIDC) identity tokens (Fulcio CA), public transparency logs (Rekor), and automated signature verification in Kubernetes via Kyverno.",
    conceptInvariant: "Never rely on long-lived private signing keys that can be stolen or leaked. Modern supply chain security uses Keyless Signing: Cosign obtains a short-lived (10-minute) X.509 certificate from Fulcio bound to the CI/CD's OIDC identity, signs the image, and logs the cryptographic proof to the immutable Rekor transparency ledger.",
    failureMode: "Storing an unencrypted private GPG or Cosign signing key inside a GitHub repository secret; an attacker steals the secret and signs a trojanized container image using the company's official key.",
    tryItFriction: "Sign a container image in GitHub Actions using Cosign in keyless mode (`cosign sign`), verify the signature against Rekor transparency logs, and enforce verification in Kubernetes with a Kyverno admission policy.",
    socraticHints: [
      "How does 'keyless' signing work in Sigstore Cosign?",
      "Zero static private keys! Cosign uses the CI runner's short-lived OIDC token to get an ephemeral certificate from Fulcio.",
      "The signature is cryptographically bound to the exact GitHub repository and workflow run that produced it."
    ],
    situationalPuzzle: {
      scenario: "An attacker compromises a company's container registry and pushes a malicious image overwriting the `api:latest` tag. When Kubernetes attempts to pull and run the container, the admission controller blocks the pod with: `image verification failed: no valid signature found matching trusted OIDC identity`. What security architecture prevented this attack?",
      options: [
        "A strong Linux password.",
        "Sigstore Cosign with Admission Policy Enforcement: The cluster enforces that all images must have a valid cryptographic signature recorded in Rekor signed by the official GitHub Actions workflow; unsigned or tampered images are rejected at admission.",
        "Docker Desktop.",
        "Amazon S3 bucket encryption."
      ],
      answerIdx: 1,
      debrief: "Cryptographic image signing with Cosign proves artifact authenticity and integrity. Even if an attacker compromises the container registry and tampers with an image tag, the admission controller (Kyverno or Connaisseur) verifies the cryptographic signature, preventing untrusted images from executing."
    },
    quests: [
      { id: "devops-m2-d42-q1", name: "Sigstore Ecosystem Architecture: Cosign, Fulcio CA & Rekor Ledger", type: "concept", desc: "Trace OIDC token exchange, ephemeral certificate generation, cryptographic hashing, and transparency log proofs." },
      { id: "devops-m2-d42-q2", name: "Detective Lab: The Tampered Container Registry Poisoning Attempt", type: "detective", desc: "Detect an image whose SHA256 digest was altered in the registry and verify signature failure with Cosign." },
      { id: "devops-m2-d42-q3", name: "Mastery Assignment: Keyless Cosign Signing & Kyverno Admission Policy Spec", type: "assignment", desc: "Construct a complete CI/CD signing workflow and a Kyverno policy verifying GitHub OIDC certificate subjects." },
      { id: "devops-m2-d42-q4", name: "Production Incident Lab: Rekor Transparency Log Outage Fallback", type: "detective", desc: "Triage a release pipeline failure caused by public Rekor latency and configure private Sigstore instances." }
    ]
  },
  {
    day: 43,
    month: 2,
    blockNum: 9,
    title: "Supply-Chain Levels for Software Artifacts (SLSA): SLSA Level 3 Hermetic Builds, In-Toto Provenance & Attestation",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Advanced Supply Chain Governance (SLSA Level 3 & Hermetic Builds)",
    spokenGoal: "Achieve the gold standard of software security: master the SLSA (Supply-chain Levels for Software Artifacts) framework, SLSA Level 3 compliance, in-toto provenance attestations, hermetic build environments, and non-falsifiable build metadata.",
    conceptInvariant: "SLSA Level 3 requires: 1) Build running on a hardened, isolated build platform; 2) Build process is isolated (hermetic); 3) Non-falsifiable provenance generated by the platform asserting the exact source repo, commit SHA, build parameters, and materials used.",
    failureMode: "Allowing a build script to download unpinned dependencies over raw HTTP during the build step; an attacker executes a man-in-the-middle attack and injects malicious code into the compiled binary.",
    tryItFriction: "Generate an in-toto provenance attestation using the official SLSA GitHub Actions generator, attaching the predicate JSON to the container image via Cosign (`cosign attest --predicate provenance.json`).",
    socraticHints: [
      "What is 'non-falsifiable provenance' in the SLSA framework?",
      "Build metadata generated and signed by the BUILD PLATFORM itself (e.g. GitHub Actions), NOT by the user's build script!",
      "The user's code cannot lie about what commit or repository built the artifact."
    ],
    situationalPuzzle: {
      scenario: "A defense contractor requires proof that a deployed container was built directly from commit `a1b2c3d` on the official `main` branch without any human tampering or local machine builds. What cryptographic document satisfies this requirement under SLSA Level 3?",
      options: [
        "An email from the software engineer.",
        "Cryptographically Signed in-toto SLSA Provenance: A signed attestation generated by the isolated build platform asserting the exact source repository, commit SHA, builder identity, and input materials, verified via Cosign.",
        "A screenshot of the terminal.",
        "A git log printout."
      ],
      answerIdx: 1,
      debrief: "SLSA Provenance provides a cryptographically verifiable paper trail for software. Signed by the isolated build platform using in-toto specifications, it non-falsifiably proves where, when, and how an artifact was built, preventing forged or compromised builds from entering production."
    },
    quests: [
      { id: "devops-m2-d43-q1", name: "SLSA Framework Levels (1 to 3) & in-toto Attestation Taxonomy", type: "concept", desc: "Analyze build integrity requirements, hermetic builds, reproducibility, and builder isolation invariants." },
      { id: "devops-m2-d43-q2", name: "Detective Lab: The Forged Build Provenance Verification Failure", type: "detective", desc: "Inspect a tampered provenance attestation and catch forged commit claims using Cosign verification." },
      { id: "devops-m2-d43-q3", name: "Mastery Assignment: Production SLSA Level 3 Provenance Pipeline Suite", type: "assignment", desc: "Author GitHub Actions workflows utilizing the official SLSA generator to attest container artifacts." },
      { id: "devops-m2-d43-q4", name: "Production Incident Lab: Unpinned Build-Time Remote Script Injection", type: "detective", desc: "Audit a build script running `curl | bash` and harden into a hermetic, fully pinned SLSA build." }
    ]
  },
  {
    day: 44,
    month: 2,
    blockNum: 9,
    title: "Enterprise Secret Governance: HashiCorp Vault Clusters, Dynamic Ephemeral Database Credentials & Cert-Manager ACME",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Zero-Trust Secrets Architecture (Dynamic Ephemeral Secrets)",
    spokenGoal: "Eliminate static passwords across the enterprise: master HashiCorp Vault cluster architecture (Raft storage, Shamir seal/Auto-unseal), the Vault Kubernetes Agent, dynamic ephemeral database credentials (credentials that expire in 1 hour), and PKI secrets engines.",
    conceptInvariant: "Static credentials are a guaranteed future security breach. Under HashiCorp Vault dynamic database secrets, applications do not share a static password. When a pod boots, Vault generates a unique, temporary database user with a 1-hour TTL and automatically drops the user when the pod terminates.",
    failureMode: "Sharing a single database master user (`postgres:adminpassword`) across 40 microservices; when a junior developer's laptop is compromised, the attacker has permanent root access to the entire corporate database.",
    tryItFriction: "Configure HashiCorp Vault's Database Secrets Engine to generate dynamic ephemeral PostgreSQL credentials on demand, verifying automated credential revocation after TTL expiration.",
    socraticHints: [
      "Why are dynamic ephemeral database credentials infinitely safer than static passwords?",
      "Because each application gets its own unique username and password that automatically expires in 1 hour!",
      "If a credential is leaked, it is completely useless after 60 minutes, and audit logs pinpoint the exact pod that requested it."
    ],
    situationalPuzzle: {
      scenario: "A microservice running on Kubernetes needs to connect to an external PostgreSQL database. Using HashiCorp Vault Agent sidecar injection, the pod requests credentials. The database connection succeeds, but 60 minutes later the application crashes with `password authentication failed`. What did the application fail to implement regarding dynamic secrets?",
      options: [
        "PostgreSQL cannot run longer than 60 minutes.",
        "Dynamic Secret Renewal / Lease Refresh: Dynamic credentials have a time-to-live (lease TTL); the application or Vault Agent must periodically renew the lease, or re-read the credentials file before the 1-hour lease expires.",
        "The Vault cluster was deleted.",
        "The pod ran out of disk space."
      ],
      answerIdx: 1,
      debrief: "Dynamic secrets operate on leases. If an application does not renew its lease or watch the mounted credentials file for rotated secrets before the TTL expires, Vault's background reconciler automatically revokes the database user, terminating connections."
    },
    quests: [
      { id: "devops-m2-d44-q1", name: "HashiCorp Vault Architecture: Raft Storage, Shamir Secret Sharing & PKI", type: "concept", desc: "Trace Vault authentication, token issuance, lease managers, and dynamic database secrets engines." },
      { id: "devops-m2-d44-q2", name: "Detective Lab: The Unrenewed Vault Lease Connection Crash", type: "detective", desc: "Debug an application crashing every 60 minutes and implement automated Vault Agent lease renewals." },
      { id: "devops-m2-d44-q3", name: "Mastery Assignment: Vault Dynamic PostgreSQL Credentials & Kubernetes Agent Spec", type: "assignment", desc: "Construct complete Vault policy, role, and Kubernetes deployment annotations for dynamic secret injection." },
      { id: "devops-m2-d44-q4", name: "Production Incident Lab: Vault Raft Quorum Loss Emergency Recovery", type: "detective", desc: "Recover an enterprise Vault cluster that lost Raft quorum after a cloud provider network split." }
    ]
  },
  {
    day: 45,
    month: 2,
    blockNum: 9,
    title: "⭐ MILESTONE 8: Cryptographically Signed SLSA Level 3 Secure Supply Chain Pipeline with Cosign & Vault",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Month 2 Milestone Synthesis (Zero-Trust Supply Chain Architecture)",
    spokenGoal: "Architect and prove complete supply chain defense: construct an enterprise-grade secure delivery pipeline featuring Syft SBOM generation, keyless Cosign cryptographic signing with Rekor transparency logs, SLSA Level 3 provenance attestations, HashiCorp Vault dynamic secret management, and Kyverno cluster admission policy enforcement.",
    conceptInvariant: "In an enterprise Zero-Trust supply chain, an artifact is guilty until proven innocent. The Kubernetes admission controller rejects any container image that lacks a valid cryptographic Cosign signature, an attached CycloneDX SBOM, and an untampered SLSA Level 3 provenance attestation.",
    failureMode: "Building a complex security pipeline but failing to enforce it at the Kubernetes admission layer, allowing developers to manually deploy untrusted, un-scanned container images via `kubectl run`.",
    tryItFriction: "Attempt to deploy an untrusted container image into a production namespace, verifying that the Kyverno admission controller blocks the pod with cryptographic signature failure.",
    socraticHints: [
      "What is the final enforcement point of a secure software supply chain?",
      "The Kubernetes Admission Controller (Kyverno / OPA Gatekeeper)!",
      "If the image lacks a verified Cosign signature or SLSA attestation, the cluster must reject it at admission."
    ],
    situationalPuzzle: {
      scenario: "During an audit of the secure supply chain pipeline, an auditor injects a simulated supply chain attack: an attacker gains write access to the CI workflow file and modifies it to pull a pre-compiled rogue binary from an external S3 bucket before image packaging. Which component of the SLSA Level 3 pipeline detects and blocks this tamper?",
      options: [
        "The Linux firewall.",
        "SLSA Hermetic Build Verification: SLSA Level 3 requires hermetic, isolated builds where external network access during build steps is restricted, and in-toto provenance records the exact git commit and build steps, exposing the unauthorized binary injection.",
        "The developer's laptop antivirus.",
        "The Docker daemon."
      ],
      answerIdx: 1,
      debrief: "SLSA Level 3 mandates isolated, hermetic build environments and non-falsifiable provenance. External unauthorized binaries injected into build workflows diverge from declared source code dependencies, causing provenance verification and hash checks to fail at admission."
    },
    quests: [
      { id: "devops-m2-d45-q1", name: "Milestone Architecture: SLSA Level 3 Supply Chain Blueprint", type: "concept", desc: "Design the complete pipeline: Hermetic Build -> Syft SBOM -> Cosign Sign -> SLSA Attest -> Kyverno Gate." },
      { id: "devops-m2-d45-q2", name: "Detective Lab: The Unsigned Bypass Image Admission Breach", type: "detective", desc: "Audit cluster admission rules, catch an unverified deployment path, and lock down with strict Cosign policies." },
      { id: "devops-m2-d45-q3", name: "Mastery Assignment: End-to-End SLSA Level 3 & Cosign CI/CD Security Suite", type: "assignment", desc: "Author GitHub Actions workflows executing keyless signing, SBOM attestation, and Kyverno verification." },
      { id: "devops-m2-d45-q4", name: "Production Incident Lab: Revoked OIDC CA Emergency Image Quarantine", type: "detective", desc: "Manage an emergency key revocation drill and verify that unapproved images cannot run in production." }
    ]
  },

  // ─── BLOCK 10: Site Reliability Engineering, Observability & Chaos (Days 46–50) ───
  {
    day: 46,
    month: 2,
    blockNum: 10,
    title: "Site Reliability Engineering (SRE): Service Level Objectives (SLOs), Error Budgets & Multiwindow Multi-Burn-Rate Alerts",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "SRE Reliability Frameworks (SLOs & Error Budget Math)",
    spokenGoal: "Operate like a Google Site Reliability Engineer: master Service Level Indicators (SLIs), Service Level Objectives (SLOs), Service Level Agreements (SLAs), Error Budget consumption, and Google SRE multiwindow multi-burn-rate alerting rules.",
    conceptInvariant: "Never alert on instant single-minute threshold spikes. Google SRE Multi-Burn-Rate alerting calculates error budget burn velocity across short (5m/1h) and long (30m/6h) windows. Alert only when the burn rate indicates that 2% or 5% of the 30-day error budget will be completely exhausted before engineers can respond.",
    failureMode: "Alerting on raw error counts, waking up on-call engineers for a 2-second transient glitch that burned 0.001% of the error budget, leading to extreme on-call fatigue and missed real outages.",
    tryItFriction: "Calculate the exact allowable downtime for a 99.9% SLO across 30 days (43.2 minutes), and write a PromQL multi-burn-rate alert firing only when 14.4x burn rate is sustained over 1 hour.",
    socraticHints: [
      "What is the difference between an SLI, an SLO, and an SLA?",
      "SLI is what you MEASURE (e.g. 99.92% success rate); SLO is internal TARGET (99.9%); SLA is external LEGAL contract with penalties (99.5%).",
      "Error budget is the allowable unreliability (`100% - SLO`)."
    ],
    situationalPuzzle: {
      scenario: "A fintech service has a 99.9% monthly SLO. During a deployment, an outage consumes 100% of the monthly error budget in 2 hours. According to SRE principles, what operational action must the engineering team take for the remainder of the month?",
      options: [
        "Delete the SLO so they can keep shipping code.",
        "Feature Freeze & Reliability Focus: When the error budget is exhausted, all non-critical feature deployments halt; engineering capacity shifts 100% to reliability engineering, technical debt reduction, and testing until the error budget recovers.",
        "Fire the developer who deployed the code.",
        "Pay a fine to Google."
      ],
      answerIdx: 1,
      debrief: "The Error Budget is the shared contract between Product and SRE. When the error budget is positive, teams ship new features aggressively. When the error budget is exhausted, feature releases halt, and engineering focus shifts entirely to reliability, automated testing, and systemic hardening."
    },
    quests: [
      { id: "devops-m2-d46-q1", name: "Google SRE Error Budget Mathematics & Multi-Burn-Rate Theory", type: "concept", desc: "Calculate 1x, 2x, 6x, and 14.4x burn rates across 1-hour and 6-hour windows with Page vs Ticket routing." },
      { id: "devops-m2-d46-q2", name: "Detective Lab: The False-Alarm Alert Fatigue On-Call Crisis", type: "detective", desc: "Audit an on-call rotation receiving 40 pages a week and replace naive threshold alerts with SRE burn rate rules." },
      { id: "devops-m2-d46-q3", name: "Mastery Assignment: Production PrometheusRule Multiwindow Multi-Burn-Rate Spec", type: "assignment", desc: "Author Prometheus alerting rules implementing Google SRE's 1-hour/5-minute and 6-hour/30-minute burn rate algorithms." },
      { id: "devops-m2-d46-q4", name: "Production Incident Lab: Rapid 14.4x Error Budget Burn Escalation", type: "detective", desc: "Triage a live P0 incident where a database index drop burned 10% of the monthly error budget in 15 minutes." }
    ]
  },
  {
    day: 47,
    month: 2,
    blockNum: 10,
    title: "Distributed Tracing Engineering: OpenTelemetry Collector Pipelines, W3C TraceContext Propagation & Tail-Based Sampling",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Advanced Observability (Trace Engineering & High-Throughput Sampling)",
    spokenGoal: "Trace every microsecond across thousands of microservices: master OpenTelemetry (OTel) Collector pipelines (Receivers, Processors, Exporters), W3C TraceContext standards, Head-based vs Tail-based sampling, and Jaeger trace analysis.",
    conceptInvariant: "Head-based sampling decides whether to sample a trace at the start of a request (dropping 90% of requests randomly). Tail-based sampling buffers the ENTIRE trace in the OpenTelemetry Collector until completion, sampling 100% of traces with errors or high latency (> 2s), guaranteeing zero missed incident traces.",
    failureMode: "Using 1% head-based sampling in high-volume production, discovering during an outage that 99% of the traces that threw 500 errors were discarded at the head, leaving engineers with zero trace data to debug.",
    tryItFriction: "Configure an OpenTelemetry Collector with `tail_sampling` processor: sample 100% of traces with HTTP status `>= 500`, 100% of traces with latency `> 1.5s`, and only 1% of normal 200 OK traces.",
    socraticHints: [
      "Why is Tail-Based Sampling infinitely superior to Head-Based Sampling for debugging outages?",
      "Head-based sampling gambles on what to keep before the request happens!",
      "Tail-based sampling waits until the request finishes, keeping 100% of errors and slow requests while dropping boring successes."
    ],
    situationalPuzzle: {
      scenario: "A microservice cluster generates 100,000 requests per second. Exporting 100% of traces to an observability backend would cost $50,000/month in storage. Using 1% head-based sampling drops too many intermittent bugs. What OTel Collector configuration captures every single production bug without exploding storage costs?",
      options: [
        "Turn off distributed tracing.",
        "Tail-Based Sampling Processor: Buffer traces in memory at the OTel Collector layer and apply composite sampling rules: keep 100% of traces with errors (`status.code == ERROR`), keep 100% of traces exceeding latency thresholds, and keep 0.5% of successful requests.",
        "Store traces on developer laptops.",
        "Log traces to text files."
      ],
      answerIdx: 1,
      debrief: "Tail-based sampling provides the best of both worlds: extreme cost efficiency with zero loss of critical diagnostic data. By evaluating the trace only after all spans finish, the collector keeps every anomalous trace (errors, latency spikes) while discarding redundant normal traffic."
    },
    quests: [
      { id: "devops-m2-d47-q1", name: "OpenTelemetry Collector Architecture & Pipeline Execution Graph", type: "concept", desc: "Trace OTel Receiver -> Memory Limiter -> Batch Processor -> Tail Sampling -> OTLP Exporter." },
      { id: "devops-m2-d47-q2", name: "Detective Lab: The Missing Error Trace Head-Sampling Blindspot", type: "detective", desc: "Diagnose an outage where head sampling dropped critical error traces and deploy tail-based sampling." },
      { id: "devops-m2-d47-q3", name: "Mastery Assignment: Production OpenTelemetry Collector Tail-Sampling Spec", type: "assignment", desc: "Author an otel-collector-config.yaml with latency filtering, error capture, and OTLP gRPC export." },
      { id: "devops-m2-d47-q4", name: "Production Incident Lab: OTel Collector Memory Limiter Dropping Spans", type: "detective", desc: "Resolve a memory leak in the OTel collector and tune ballast memory and batch timeout parameters." }
    ]
  },
  {
    day: 48,
    month: 2,
    blockNum: 10,
    title: "High-Cardinality Telemetry Engines: VictoriaMetrics / Cortex TSDB, Grafana Loki Log Streams & Compaction",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Telemetry Scaling (Long-Term TSDB & Log Stream Engineering)",
    spokenGoal: "Scale metrics and logs to petabyte scale: master VictoriaMetrics and Mimir long-term TSDB storage, Prometheus remote write, Grafana Loki index-free log streams (LogQL), chunk compaction, and object storage retention.",
    conceptInvariant: "Unlike Elasticsearch which creates massive inverted indexes for every word in every log (exploding storage), Grafana Loki only indexes metadata labels (namespace, pod, app) and streams compressed log chunks to cheap S3 object storage, reducing logging infrastructure costs by 80%.",
    failureMode: "Indexing high-cardinality fields (like `userId` or `ipAddress`) as labels in Grafana Loki, creating millions of separate stream chunks, exhausting Loki ingester memory, and crashing the logging cluster.",
    tryItFriction: "Write a LogQL query extracting high-cardinality IP addresses dynamically using line filters and regex parsing (`{app=\"gateway\"} |= \"error\" | json | unwrap latency | quantile_over_time(0.99, [5m])`) without creating label streams.",
    socraticHints: [
      "Why should you NEVER use high-cardinality values (like user ID or IP address) as labels in Grafana Loki?",
      "Because each unique label combination creates an entirely new log stream in memory!",
      "Keep labels low-cardinality (app, env, cluster), and parse user IDs dynamically at query time using LogQL."
    ],
    situationalPuzzle: {
      scenario: "An enterprise Prometheus server retains metrics on local EBS volumes. After 15 days, the disk fills to 100% and crashes. The team requires 2 years of metric retention for capacity planning and compliance without paying for terabytes of expensive SSD EBS storage. What is the production architecture solution?",
      options: [
        "Delete all metrics after 7 days.",
        "Prometheus Remote Write to VictoriaMetrics / Mimir with S3 Storage: Configure Prometheus with a 2-hour local retention and stream metrics via `remote_write` to a scalable TSDB (VictoriaMetrics/Mimir) that compresses time-series data into cheap S3 object storage.",
        "Print the metrics on paper.",
        "Store metrics in SQLite."
      ],
      answerIdx: 1,
      debrief: "Prometheus is designed for short-term operational alerting, not multi-year long-term storage. Using `remote_write` streams data to specialized cloud-native TSDBs (VictoriaMetrics, Thanos, or Mimir) that compact metrics and store years of historical data in inexpensive S3 buckets."
    },
    quests: [
      { id: "devops-m2-d48-q1", name: "Loki Chunks vs Elasticsearch Inverted Index Architecture", type: "concept", desc: "Compare index storage footprints, ingester ring architectures, and S3 chunk compaction." },
      { id: "devops-m2-d48-q2", name: "Detective Lab: The Loki Stream Explosion High-Cardinality Crash", type: "detective", desc: "Isolate an application logging with dynamic labels and refactor to query-time LogQL line parsing." },
      { id: "devops-m2-d48-q3", name: "Mastery Assignment: VictoriaMetrics Remote-Write & Long-Term S3 Storage Spec", type: "assignment", desc: "Author Prometheus remote_write and VictoriaMetrics Helm specifications with multi-year S3 retention." },
      { id: "devops-m2-d48-q4", name: "Production Incident Lab: Remote Write Queue Dropping Metric Crisis", type: "detective", desc: "Triage a metric loss incident where Prometheus remote write queue starved during network partition." }
    ]
  },
  {
    day: 49,
    month: 2,
    blockNum: 10,
    title: "Kubernetes Chaos Engineering: Chaos Mesh, Pod Chaos, Network Latency / Packet Corruption & DNS Chaos",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Resiliency Engineering (Automated Chaos Injection & Recovery)",
    spokenGoal: "Break your cluster deliberately to prove it cannot be broken: master Chaos Engineering on Kubernetes, Chaos Mesh operators, Pod Chaos (random pod killings), Network Chaos (latency, packet loss, bandwidth throttling), DNS Chaos, and automated rollback stop conditions.",
    conceptInvariant: "A microservice architecture is only truly resilient if it survives the simultaneous death of arbitrary pods and network degradation without dropping customer transactions. Chaos experiments must run continuously in staging and game days to validate resilience invariants.",
    failureMode: "Assuming an application has proper circuit breakers and timeouts; when an actual network latency event occurs in production, thread pools exhaust and the entire cluster collapses in a cascading failure.",
    tryItFriction: "Create a Chaos Mesh `NetworkChaos` experiment injecting 250ms latency and 10% packet corruption on an internal payment service, verifying that client circuit breakers trip and fall back gracefully in under 5 seconds.",
    socraticHints: [
      "Why must Chaos experiments inject network latency in addition to killing pods?",
      "Because slow networks are FAR harder to handle than dead servers!",
      "A dead server fails immediately (fast fail); a slow server ties up connection sockets, exhausts threads, and causes cascading collapse."
    ],
    situationalPuzzle: {
      scenario: "During a Chaos Mesh GameDay, the SRE team injects DNS Chaos: CoreDNS query latency is increased by 3 seconds. Multiple backend microservices collapse because their database connections and API clients have default 30-second connection timeouts, tying up all server threads. What resilience pattern was missing in the application code?",
      options: [
        "The application needed more RAM.",
        "Aggressive Timeouts & Circuit Breaking: Applications must never use unbounded or multi-second connection timeouts; clients must enforce aggressive timeouts (e.g. 500ms), circuit breakers (e.g. Resilience4j), and DNS caching to survive DNS latency storms.",
        "DNS should be removed from the internet.",
        "Chaos experiments should be banned."
      ],
      answerIdx: 1,
      debrief: "Default network client configurations often have multi-second or infinite timeouts. When network or DNS latency strikes, client threads block indefinitely, causing thread starvation and cascading system failure. Resilient systems enforce aggressive timeouts, circuit breakers, and fallbacks."
    },
    quests: [
      { id: "devops-m2-d49-q1", name: "Chaos Engineering Principles & Chaos Mesh Controller Architecture", type: "concept", desc: "Trace Linux tc (traffic control) netem packet manipulation, iptables corruption, and cgroup freezing." },
      { id: "devops-m2-d49-q2", name: "Detective Lab: The Unhandled Network Latency Cascading Collapse", type: "detective", desc: "Inject 300ms network delay into a staging cluster and identify un-timeouted synchronous HTTP calls." },
      { id: "devops-m2-d49-q3", name: "Mastery Assignment: Production Chaos Mesh Experiment Suite Manifest", type: "assignment", desc: "Author declarative PodChaos, NetworkChaos, and DNSChaos manifests with automated duration timers." },
      { id: "devops-m2-d49-q4", name: "Production Incident Lab: GameDay Automated Circuit Breaker Verification", type: "detective", desc: "Validate that application circuit breakers transition to OPEN state and return cached fallbacks during chaos." }
    ]
  },
  {
    day: 50,
    month: 2,
    blockNum: 10,
    title: "⭐ MILESTONE 9: Enterprise SRE Observability Platform with Multi-Burn-Rate Alerts & Automated Chaos Drills",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Month 2 Milestone Synthesis (SRE Reliability & Chaos Verification)",
    spokenGoal: "Architect and prove enterprise SRE operational excellence: construct a complete reliability engineering platform featuring Prometheus multiwindow multi-burn-rate alerting rules, OpenTelemetry tail-based sampling trace pipelines, Grafana RED dashboards, and automated Chaos Mesh resilience drills.",
    conceptInvariant: "Reliability is an empirical science, not wishful thinking. A high-reliability platform continuously measures its error budget burn rate, traces 100% of anomalous transactions, and executes automated chaos drills in CI/CD to prove systems withstand infrastructure turbulence.",
    failureMode: "Claiming 99.99% availability on paper while having zero automated alerting on error budget consumption, discovering system degradation only when executive leadership receives user complaints.",
    tryItFriction: "Execute an automated Chaos drill injecting random pod termination and network latency during an active synthetic traffic load, proving that the multi-burn-rate alert notifies the team and circuit breakers prevent customer-facing errors.",
    socraticHints: [
      "How do you prove your SRE alerting and observability platform works before an outage occurs?",
      "Inject automated chaos into the system!",
      "Verify that the Prometheus burn rate alert fires accurately, OTel captures the trace, and Grafana displays the incident in real time."
    ],
    situationalPuzzle: {
      scenario: "During an automated chaos drill, Chaos Mesh injects a network partition isolating 2 out of 3 backend pods. The multi-burn-rate alert fires within 90 seconds. The SRE on-call engineer opens Grafana and clicks directly on a high-latency trace in the dashboard, identifying the exact partitioned network interface in Jaeger. What unified observability principle made this rapid triage possible?",
      options: [
        "The engineer guessed correctly.",
        "Correlation Across the 3 Pillars of Observability: Unifying Metrics (Prometheus alerting), Logs (Loki line filtering), and Traces (OpenTelemetry traceparent links in log lines and exemplar dots on metric charts) enables seamless, 1-click drill-down from alert to root cause.",
        "All microservices were combined into one binary.",
        "The cluster was restarted."
      ],
      answerIdx: 1,
      debrief: "True observability links Metrics, Logs, and Traces into an interconnected web. Prometheus exemplars connect metric latency spikes directly to OpenTelemetry trace IDs; logs include trace context headers, allowing engineers to transition from a high-level alert to the exact failing line of code in seconds."
    },
    quests: [
      { id: "devops-m2-d50-q1", name: "Milestone Architecture: Unified SRE Observability & Chaos Blueprint", type: "concept", desc: "Design the complete platform: Prometheus TSDB -> OTel Collector -> Grafana -> Alertmanager -> Chaos Mesh." },
      { id: "devops-m2-d50-q2", name: "Detective Lab: The Uncorrelated Telemetry Silo Blindspot", type: "detective", desc: "Inject W3C trace IDs into structured logs and attach Prometheus exemplars to bridge metrics and traces." },
      { id: "devops-m2-d50-q3", name: "Mastery Assignment: End-to-End SRE Burn-Rate Alerting & Chaos Test Suite", type: "assignment", desc: "Author production PrometheusRules, OTel Collector pipelines, and automated Chaos Mesh game day scripts." },
      { id: "devops-m2-d50-q4", name: "Production Incident Lab: Live Multi-System Outage Simulation & Triage", type: "detective", desc: "Triage a live multi-system failure drill, measure MTTR, and prove service recovery within error budget limits." }
    ]
  },

  // ─── BLOCK 11: Multi-Cluster GitOps, Disaster Recovery & FinOps (Days 51–55) ──────
  {
    day: 51,
    month: 2,
    blockNum: 11,
    title: "Multi-Cluster GitOps Orchestration: ArgoCD App-of-Apps Pattern & ApplicationSet Multi-Cluster Generators",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Enterprise GitOps Architecture (Fleet Management & Scale)",
    spokenGoal: "Manage hundreds of Kubernetes clusters from a single Git repository: master the ArgoCD App-of-Apps pattern, ApplicationSet Controller generators (Git generator, Cluster generator, Matrix generator), and automated multi-tenant cluster onboarding.",
    conceptInvariant: "Managing clusters individually creates operational drift. The ArgoCD ApplicationSet Controller enables a single declarative manifest to fan out deployments across 50 heterogeneous clusters automatically based on cluster labels (`environment: prod`, `region: eu-west-1`).",
    failureMode: "Manually copying ArgoCD Application YAML files for every new microservice across 20 clusters, leading to hundreds of duplicate manifests with diverging configuration drift.",
    tryItFriction: "Author an ArgoCD `ApplicationSet` using the Git Generator and Cluster Generator matrix, automatically deploying a fleet of microservices across 3 distinct Kubernetes clusters from a single template.",
    socraticHints: [
      "How does an ArgoCD ApplicationSet eliminate manual manifest duplication?",
      "Generators! An ApplicationSet generates standard ArgoCD Applications dynamically based on cluster labels or Git directories.",
      "Add a new cluster to your fleet, and ApplicationSet automatically deploys all required workloads to it."
    ],
    situationalPuzzle: {
      scenario: "An enterprise expands into a new geographic region and provisions an empty Kubernetes cluster (`cluster-eu-central`). The DevOps team adds the cluster credentials to ArgoCD with label `region: europe`. Within 3 minutes, all 40 company microservices, monitoring agents, and security controllers are running automatically on the new cluster. What tool automated this?",
      options: [
        "An engineer stayed up all night running kubectl.",
        "ArgoCD ApplicationSet with Cluster Generator: The ApplicationSet controller watched for clusters labeled `region: europe` and automatically instantiated and synced 40 parameterized Applications to the new target cluster without human intervention.",
        "GitHub automatically emailed the files.",
        "The Kubernetes apiserver copied itself."
      ],
      answerIdx: 1,
      debrief: "ArgoCD ApplicationSets provide true fleet management. By defining cluster generators matching labels like `region: europe`, new clusters added to the fleet automatically trigger the instantiation and deployment of all declared applications, achieving zero-touch cluster provisioning."
    },
    quests: [
      { id: "devops-m2-d51-q1", name: "ApplicationSet Controller Architecture: Generators & Matrix Topologies", type: "concept", desc: "Trace Cluster, Git, List, and Pull Request generators, template parameters, and sync wave ordering." },
      { id: "devops-m2-d51-q2", name: "Detective Lab: The App-of-Apps Recursive Dependency Lockup", type: "detective", desc: "Debug an ArgoCD app-of-apps pattern deadlock where child applications failed due to circular sync waves." },
      { id: "devops-m2-d51-q3", name: "Mastery Assignment: Production Multi-Cluster ApplicationSet Fleet Suite", type: "assignment", desc: "Construct an ApplicationSet manifest deploying monitoring, security, and workloads across multi-region clusters." },
      { id: "devops-m2-d51-q4", name: "Production Incident Lab: Wildcard ApplicationSet Deletion Disaster", type: "detective", desc: "Recover from an incident where a misconfigured generator rule attempted to prune production workloads." }
    ]
  },
  {
    day: 52,
    month: 2,
    blockNum: 11,
    title: "Kubernetes Disaster Recovery & State Migration: Velero Backup/Restore, Restic Volume Sync & CSI Snapshots",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Enterprise Disaster Recovery (Cluster Backup & State Migration)",
    spokenGoal: "Survive catastrophic cluster loss: master Velero disaster recovery architecture, Kubernetes resource metadata backup to S3, Container Storage Interface (CSI) volume snapshots, Restic/Kopia file-level volume sync, and full cross-region cluster restoration.",
    conceptInvariant: "Git stores desired state, but Velero backs up actual RUNNING state (etcd persistent metadata, dynamic secrets, and stateful volume data). In a total disaster where a cloud region is destroyed, Velero restores stateful databases and cluster configurations in minutes.",
    failureMode: "Relying solely on GitOps to restore a cluster following a catastrophic cloud provider outage, discovering that all PersistentVolume data (database files, user uploads) is permanently lost because stateful data was not backed up.",
    tryItFriction: "Execute an automated Velero backup of a namespace containing an active PostgreSQL database and persistent volume, simulate total namespace deletion, and restore the complete running database with zero data loss in under 3 minutes.",
    socraticHints: [
      "Why is GitOps alone insufficient for disaster recovery of stateful workloads?",
      "Git only stores your CODE and YAML definitions! Git does NOT store the actual data inside your PostgreSQL database volumes.",
      "Velero backs up both the Kubernetes metadata AND coordinates CSI storage snapshots of the underlying persistent disks."
    ],
    situationalPuzzle: {
      scenario: "A primary Kubernetes cluster suffers a catastrophic failure. The SRE team provisions a fresh cluster in a secondary region. The team executes `velero restore create --from-backup latest-full-backup`. The resources restore, but database pods fail to mount storage because the original cloud EBS volume snapshots reside in the failed region. What storage backup setting was missing?",
      options: [
        "Kubernetes cannot restore databases.",
        "Cross-Region Snapshot Replication & S3 Object Storage: Storage snapshots and Velero backup archives must be automatically replicated to a secondary cloud region or multi-region S3 bucket to enable cross-region recovery during regional blackouts.",
        "The database should have used RAM only.",
        "Velero only works in single-AZ clusters."
      ],
      answerIdx: 1,
      debrief: "A true multi-region disaster recovery plan requires that backup archives and storage volume snapshots be replicated to an independent secondary region. Storing backups only in the primary region means a regional failure locks you out of your own backups."
    },
    quests: [
      { id: "devops-m2-d52-q1", name: "Velero Backup Engine Architecture & CSI Volume Snapshotting", type: "concept", desc: "Trace Velero backup controllers, VolumeSnapshotClass, Restic repository integration, and S3 object storage." },
      { id: "devops-m2-d52-q2", name: "Detective Lab: The Unbacked-Up Stateful PersistentVolume Loss", type: "detective", desc: "Audit cluster storage classes and configure automated CSI volume snapshot schedules." },
      { id: "devops-m2-d52-q3", name: "Mastery Assignment: Automated Cross-Region Velero Disaster Recovery Spec", type: "assignment", desc: "Author complete Velero Schedule and BackupStorageLocation manifests with cross-region replication." },
      { id: "devops-m2-d52-q4", name: "Production Incident Lab: Live Total Cluster Destruction & Restoration Drill", type: "detective", desc: "Execute a simulated total cluster loss drill and measure real RTO and RPO metrics during recovery." }
    ]
  },
  {
    day: 53,
    month: 2,
    blockNum: 11,
    title: "Zero-Downtime Stateful Workloads on Kubernetes: StatefulSets, PersistentVolume Claims & Rook-Ceph CephFS/RBD",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Stateful Systems Architecture (Distributed Storage & StatefulSets)",
    spokenGoal: "Run databases and distributed stateful systems on Kubernetes with confidence: master StatefulSets, ordinal indexing (`pod-0`, `pod-1`), stable network identities (Headless Services), PersistentVolumeClaims (PVCs), and cloud-native software-defined storage with Rook-Ceph (CephFS and RBD).",
    conceptInvariant: "Unlike Deployments (which treat pods as anonymous interchangeable cattle), StatefulSets guarantee unique, persistent ordinal identities (`kafka-0`, `kafka-1`). When `kafka-0` crashes, its replacement is guaranteed to have the exact same hostname and will re-attach the exact same persistent storage disk.",
    failureMode: "Deploying a stateful database cluster (like MongoDB or Kafka) using a Kubernetes `Deployment` with a single shared ReadWriteMany volume, causing database split-brain and permanent storage corruption.",
    tryItFriction: "Deploy a 3-node PostgreSQL cluster using a StatefulSet and Headless Service, simulate the sudden termination of node-1, and observe the replacement pod re-attach the exact same persistent volume without data loss.",
    socraticHints: [
      "What is the difference between a Deployment and a StatefulSet in Kubernetes?",
      "Deployments are for STATELESS apps (random names, shared scaling, interchangeable pods)!",
      "StatefulSets are for STATEFUL apps (ordered indexing: `app-0, app-1`, dedicated storage per pod, stable network identities)."
    ],
    situationalPuzzle: {
      scenario: "A cloud-native database runs on Kubernetes using cloud provider EBS volumes (`ReadWriteOnce`). A worker node experiences a hardware failure. Kubernetes attempts to schedule `db-0` onto a new node, but the pod remains in `ContainerCreating` for 15 minutes with error: `Volume is already exclusively attached to one node and can't be attached to another`. What storage architecture eliminates this EBS cloud lock?",
      options: [
        "Delete the database and restore from scratch.",
        "Cloud-Native Software-Defined Storage (Rook-Ceph / Longhorn): Rook-Ceph provides distributed software-defined storage replicated across nodes at the software layer, eliminating proprietary cloud EBS volume attachment locks and enabling instant failover across nodes.",
        "Make all database pods share one memory stick.",
        "Run the database without storage."
      ],
      answerIdx: 1,
      debrief: "Cloud block storage (like AWS EBS) enforces hardware attachment limits: a volume attached to a crashed node cannot attach to a new node until the hypervisor releases it (which can take 10-15 minutes). Software-defined storage like Rook-Ceph or Longhorn manages storage at the cluster level, enabling instantaneous failover."
    },
    quests: [
      { id: "devops-m2-d53-q1", name: "StatefulSet Controller Lifecycle & VolumeAttachment Architecture", type: "concept", desc: "Trace ordinal deployment sequencing (0 -> 1 -> 2), Headless Service DNS SRV records, and PVC dynamic binding." },
      { id: "devops-m2-d53-q2", name: "Detective Lab: The EBS VolumeAttachment Multi-Attach Lockup", type: "detective", desc: "Resolve a stuck pod failed to attach volume by diagnosing cloud provider volume attachment race conditions." },
      { id: "devops-m2-d53-q3", name: "Mastery Assignment: High-Availability Distributed StatefulSet Manifest Suite", type: "assignment", desc: "Construct a complete StatefulSet manifest for an HA database cluster with PVC volume claim templates." },
      { id: "devops-m2-d53-q4", name: "Production Incident Lab: Rook-Ceph OSD Disk Degradation Emergency", type: "detective", desc: "Triage a degraded storage cluster, replace a failing OSD disk, and monitor automated Ceph data rebalancing." }
    ]
  },
  {
    day: 54,
    month: 2,
    blockNum: 11,
    title: "Cloud FinOps for Kubernetes: OpenCost, Kubecost Allocation, Rightsizing Recommendations & VPA Automation",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Financial Engineering (Kubernetes Cost Allocation & Waste Elimination)",
    spokenGoal: "Connect Kubernetes resource requests directly to corporate dollars: master Kubernetes FinOps, OpenCost and Kubecost allocation architectures, multi-tenant cost attribution (cost per namespace, team, service), waste identification (idle CPU/RAM), and Vertical Pod Autoscaler (VPA) automated rightsizing.",
    conceptInvariant: "In Kubernetes, cloud providers charge you for what you REQUEST, not what you USE. If a developer sets `resources.requests.cpu: '4'` on a pod that only uses 0.1 CPU, the company pays for 4 full cores of dedicated node capacity. Resource overprovisioning is the #1 driver of cloud waste.",
    failureMode: "Developers configuring 8GB RAM requests for 50 microservices that each consume 150MB RAM, forcing the company to pay for 30 large EC2 worker nodes ($12,000/mo) when 2 nodes ($800/mo) would easily handle the workload.",
    tryItFriction: "Deploy OpenCost via Helm, inspect real-time cost attribution by namespace, identify the top 3 overprovisioned services, and apply VPA recommendations to cut resource requests by 65%.",
    socraticHints: [
      "Why does setting `resources.requests` too high inflate your cloud bill even if actual CPU usage is low?",
      "Because the Kubernetes scheduler reserves that capacity on worker nodes! It will not schedule other pods on that reserved space.",
      "High requests force the cluster to launch more physical nodes, directly ballooning your cloud bill."
    ],
    situationalPuzzle: {
      scenario: "A VP of Engineering receives a $60,000/month Kubernetes cloud bill and asks: 'Which engineering team is responsible for the recent 40% cost increase, and how much is being wasted on idle capacity?' Which tool provides this exact financial breakdown natively in Kubernetes?",
      options: [
        "AWS billing alone, which only shows total EC2 cost.",
        "Kubecost / OpenCost Allocation Engine: It calculates the cost of CPU, RAM, GPU, and storage per namespace, team label, and pod, calculating the exact dollar cost of idle vs utilized resources.",
        "Ask each engineer to estimate their spending.",
        "Delete half the pods randomly."
      ],
      answerIdx: 1,
      debrief: "Cloud provider billing only sees physical EC2/compute instances, not the multi-tenant workloads sharing them. OpenCost and Kubecost correlate cloud billing APIs with in-cluster Prometheus resource usage, attributing exact dollar costs and idle waste down to individual teams, namespaces, and pods."
    },
    quests: [
      { id: "devops-m2-d54-q1", name: "Kubernetes Cost Allocation Mechanics & FinOps Unit Economics", type: "concept", desc: "Trace spot vs on-demand pricing models, RAM/CPU blended cost formulas, and idle capacity overhead." },
      { id: "devops-m2-d54-q2", name: "Detective Lab: The $15,000 Overprovisioned Idle Resource Scrub", type: "detective", desc: "Audit a wasteful cluster using OpenCost and rightsize over-allocated microservice requests." },
      { id: "devops-m2-d54-q3", name: "Mastery Assignment: Automated Vertical Pod Autoscaler (VPA) Recommendation Engine", type: "assignment", desc: "Author VPA manifests in `Off` recommendation mode, parsing automated rightsizing metrics." },
      { id: "devops-m2-d54-q4", name: "Production Incident Lab: Uncontrolled Cluster Autoscaler Budget Explosion", type: "detective", desc: "Triage a runaway cluster scaling incident caused by a misconfigured load test and implement hard budget limits." }
    ]
  },
  {
    day: 55,
    month: 2,
    blockNum: 11,
    title: "⭐ MILESTONE 10: Multi-Region Active-Active Multi-Cluster Kubernetes GitOps Fleet with Velero DR",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Month 2 Milestone Synthesis (Global Multi-Cluster Fleet Architecture)",
    spokenGoal: "Architect and prove extreme scale global infrastructure: deploy a multi-region active-active Kubernetes fleet spanning US and Europe, orchestrated via ArgoCD ApplicationSets, backed by Velero automated cross-region disaster recovery, Rook-Ceph distributed storage, and Kubecost financial governance.",
    conceptInvariant: "Global multi-cluster resiliency requires total infrastructure independence: each regional cluster must operate as a fully autonomous cell capable of surviving the total annihilation of peer regions, while GitOps maintains unified configuration parity across the entire fleet.",
    failureMode: "Building a multi-cluster setup with a single shared control plane or centralized database in one region; when that primary region goes down, all global clusters fail simultaneously.",
    tryItFriction: "Execute a simulated regional disaster: completely sever the US cluster from the network and observe the European cluster absorb global traffic seamlessly while Velero proves automated cross-region state recovery.",
    socraticHints: [
      "What is the golden rule of Multi-Region Active-Active cluster architecture?",
      "Cell-based isolation! Each regional cluster must be completely independent and autonomous.",
      "Never create a centralized single point of failure that spans across regions."
    ],
    situationalPuzzle: {
      scenario: "During an executive architecture review, the Chief Information Security Officer (CISO) asks: 'If our primary cloud provider region experiences a physical power grid blackout, what is our automated recovery time objective (RTO) and recovery point objective (RPO) across our global Kubernetes fleet?' What is the definitive Staff SRE response?",
      options: [
        "We will wait for the cloud provider to fix the power.",
        "Autonomous Multi-Region RTO < 30s, RPO = 0: Because our fleet runs Active-Active across independent regional cells orchestrated via GitOps and Route 53 ARC, traffic steers away in under 30 seconds; stateful data backed up via continuous cross-region Velero sync meets sub-15-minute RPO.",
        "RTO is 4 weeks.",
        "Kubernetes does not have RTO."
      ],
      answerIdx: 1,
      debrief: "A Staff SRE articulates disaster recovery with mathematical precision. Active-active multi-region architectures provide near-zero RTO for stateless workloads via DNS/ARC routing switches, while stateful workloads rely on continuous automated cross-region snapshot replication to achieve strict RPO guarantees."
    },
    quests: [
      { id: "devops-m2-d55-q1", name: "Milestone Architecture: Global Multi-Cluster Fleet Blueprint", type: "concept", desc: "Design the complete global platform: ApplicationSets -> Regional Clusters -> Velero Cross-Region -> Kubecost." },
      { id: "devops-m2-d55-q2", name: "Detective Lab: The Inter-Cluster Configuration Drift Desync", type: "detective", desc: "Identify and reconcile configuration drift across 3 regional clusters using ArgoCD diff engines." },
      { id: "devops-m2-d55-q3", name: "Mastery Assignment: Production Multi-Cluster GitOps & Velero Fleet Suite", type: "assignment", desc: "Author complete ApplicationSet manifests, Velero cross-region schedules, and OpenCost attribution configs." },
      { id: "devops-m2-d55-q4", name: "Production Incident Lab: Live Regional Cluster Blackout Drill", type: "detective", desc: "Execute a live failover simulation, severing a primary cluster and verifying global traffic redirection." }
    ]
  },

  // ─── BLOCK 12: Production Incident Command, Compliance & Staff Capstone Viva (Days 56–60)
  {
    day: 56,
    month: 2,
    blockNum: 12,
    title: "Production Outage War Rooms: 3 AM Kernel Panics, Conntrack Table Exhaustion & Cascading OOM Killer Storms",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "SRE Incident Command (Live High-Stress Outage Triage)",
    spokenGoal: "Lead production war rooms under extreme pressure like a battle-tested Staff SRE Incident Commander: diagnose and resolve catastrophic outages in real time, analyze Linux kernel panics, conntrack table exhaustion, cascading OOM killer storms, and author Blameless Post-Mortems.",
    conceptInvariant: "The Incident Command Principle: In a high-severity P0 production outage, the Incident Commander's role is communication, delegation, and mitigation (stopping user impact). The commander does NOT write code or investigate root cause during the incident; root cause investigation occurs strictly AFTER the service is stabilized.",
    failureMode: "An incident commander jumping into terminal sessions to debug a C++ core dump during a live outage while executive leadership, customer support, and stakeholders are completely blind to incident status.",
    tryItFriction: "Lead a simulated 3 AM P0 outage drill: triage conflicting Prometheus alerts, establish incident command hierarchy, shed non-critical traffic, stabilize the cluster in under 10 minutes, and write an executive RCA.",
    socraticHints: [
      "What is the first rule of the SRE Incident Commander during a P0 outage?",
      "Mitigate first, debug later! Focus 100% on stopping user impact (rollback, traffic shedding, failover).",
      "Do not try to find the root cause while production is actively down."
    ],
    situationalPuzzle: {
      scenario: "At 3:20 AM, an e-commerce platform suffers a complete traffic drop. Worker nodes report healthy CPU and RAM, but no new TCP connections can be established. Node system logs report: `nf_conntrack: table full, dropping packet`. Why did all incoming connections drop, and what is the emergency mitigation?",
      options: [
        "The ethernet cables were unplugged.",
        "Linux Netfilter Conntrack Table Exhaustion: The kernel's stateful connection tracking table filled to capacity; emergency fix: increase `sysctl -w net.netfilter.nf_conntrack_max=1048576` and lower TCP timeout thresholds to immediately accept connections.",
        "Reboot the customer's phone.",
        "Delete the database."
      ],
      answerIdx: 1,
      debrief: "Linux Netfilter connection tracking (`conntrack`) tracks stateful TCP connections. High-throughput clusters can fill this table during traffic spikes or connection leaks. When full, the kernel silently drops all subsequent incoming packets. Emergency remediation requires increasing `nf_conntrack_max` via sysctl."
    },
    quests: [
      { id: "devops-m2-d56-q1", name: "SRE Incident Command System (ICS) & Blameless Post-Mortem Taxonomy", type: "concept", desc: "Learn incident roles (Commander, Scribe, Ops Lead), timeline reconstruction, and 5-Whys root cause analysis." },
      { id: "devops-m2-d56-q2", name: "Detective Lab: The Kernel Conntrack Table Exhaustion Packet Drop", type: "detective", desc: "Diagnose a silent network blackout in kernel dmesg logs and tune sysctl networking parameters." },
      { id: "devops-m2-d56-q3", name: "Mastery Assignment: Production Outage Post-Mortem & Incident Runbook", type: "assignment", desc: "Author an executive-level RCA document detailing root cause, timeline, blast radius, and 5 preventative actions." },
      { id: "devops-m2-d56-q4", name: "Production Incident Lab: Live 3 AM Cascading OOM Killer War Room", type: "detective", desc: "Survive an unannounced multi-node OOM killer storm, isolate the offending workload, and restore cluster stability." }
    ]
  },
  {
    day: 57,
    month: 2,
    blockNum: 12,
    title: "Event-Driven Automated Remediation: Robusta, StackStorm & Kubernetes Event Watchers for Automated Runbooks",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Autonomous Operations (Self-Healing Runbooks & Event-Driven Automation)",
    spokenGoal: "Eliminate repetitive on-call toil through automated remediation: master Robusta, StackStorm, Kubernetes Event Watchers, event-driven remediation runbooks, automated pod restart diagnosis, and automated disk cleanup.",
    conceptInvariant: "SRE Toil Reduction Invariant: If a human engineer performs an operational task manually more than twice (e.g. clearing temporary files, restarting stuck pods, gathering memory dumps on OOM), that task must be codified into an automated event-driven remediation runbook.",
    failureMode: "Waking up an on-call engineer every night at 2 AM to manually run `docker system prune` on a full disk node, wasting human sleep on tasks that an automated script should resolve in 2 seconds.",
    tryItFriction: "Deploy Robusta on Kubernetes with an automated playbook: when a Pod crashes with OOMKilled, Robusta automatically captures the last 100 log lines, memory profile, and posts an enriched diagnostic report directly to Slack.",
    socraticHints: [
      "What is 'Toil' in Google Site Reliability Engineering?",
      "Repetitive, manual, tactical work that lacks enduring value and scales linearly with service growth!",
      "SRE teams mandate capping toil at 50% of engineering time, automating the rest via event-driven runbooks."
    ],
    situationalPuzzle: {
      scenario: "A worker node's root disk reaches 90% capacity due to accumulated core dumps. Instead of paging an on-call engineer, an automated remediation engine detects the `DiskPressure` event, executes a verified runbook to purge core dumps older than 24 hours, and restores disk usage to 45% in 3 seconds. What SRE principle was achieved?",
      options: [
        "Manual operations.",
        "Automated Self-Healing / Toil Elimination: Automating predictable operational remediation eliminates human on-call fatigue, reduces MTTR to near zero, and ensures systems self-heal autonomously.",
        "The disk was deleted.",
        "Kubernetes was reinstalled."
      ],
      answerIdx: 1,
      debrief: "Automated remediation turns static runbooks into executable software. By listening to Kubernetes events or Prometheus webhooks, tools like Robusta and StackStorm trigger automated healing actions (clearing disks, collecting diagnostic bundles, scaling pods) without waking up human engineers."
    },
    quests: [
      { id: "devops-m2-d57-q1", name: "Event-Driven Remediation Architecture: Watchers, Webhooks & Playbooks", type: "concept", desc: "Trace Kubernetes Informer event streams, Robusta action runners, and remediation safety bounds." },
      { id: "devops-m2-d57-q2", name: "Detective Lab: The Repetitive On-Call Disk Pressure Toil Drain", type: "detective", desc: "Audit an on-call ticket queue and automate recurring disk-pressure remediation with Robusta playbooks." },
      { id: "devops-m2-d57-q3", name: "Mastery Assignment: Autonomous Self-Healing Kubernetes Playbook Suite", type: "assignment", desc: "Author complete Robusta automation playbooks capturing crash dumps and auto-remediating stuck nodes." },
      { id: "devops-m2-d57-q4", name: "Production Incident Lab: Runaway Automated Remediation Loop Containment", type: "detective", desc: "Resolve a crisis where an automated remediation script entered an infinite loop deleting healthy pods." }
    ]
  },
  {
    day: 58,
    month: 2,
    blockNum: 12,
    title: "Enterprise Compliance & Cryptographic Auditability: SOC2 Type II, ISO 27001, Immutable Audit Logs & GPG Git Signatures",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Enterprise Compliance Engineering (Cryptographic Auditability & Governance)",
    spokenGoal: "Pass rigorous enterprise compliance audits with zero friction: master SOC2 Type II Trust Services Criteria, ISO/IEC 27001, Kubernetes API immutable audit logging, mandatory GPG/SSH cryptographic Git commit signing, and automated compliance evidence collection.",
    conceptInvariant: "In regulated enterprise environments, unverified Git commits are an unacceptable security risk. Branch protection rules must enforce mandatory cryptographic commit signing (`gpg --sign` or `ssh-keygen -Y`); any unsigned commit is rejected automatically by the git server.",
    failureMode: "Failing an enterprise SOC2 Type II audit because developers commit code using unverified, spoofable author names (`git commit --author=\"Linus Torvalds <linus@linux.org>\"`), making it impossible to prove who wrote production code.",
    tryItFriction: "Configure mandatory GPG commit signing on GitHub with branch protection rules rejecting unsigned commits, and configure Kubernetes API Server audit logging with JSON output to S3.",
    socraticHints: [
      "Can anyone change the author name and email on a standard Git commit?",
      "YES! Anyone can type `git commit --author=\"CEO <ceo@company.com>\"` on an unsigned commit.",
      "Mandatory GPG or SSH commit signing cryptographically proves the true identity of the author."
    ],
    situationalPuzzle: {
      scenario: "During an annual SOC2 Type II audit, the auditor requests proof that no unauthorized engineer modified the production database configuration during the past 6 months. What Kubernetes feature provides an immutable, tamper-evident record of every single API request, actor, timestamp, and payload?",
      options: [
        "The developer's memory.",
        "Kubernetes API Audit Logging: Configuring the kube-apiserver with an Audit Policy logs every API interaction (who, what, when, originating IP, and response) to an immutable, write-once-read-many (WORM) S3 compliance bucket.",
        "The bash history on the node.",
        "A word document."
      ],
      answerIdx: 1,
      debrief: "Kubernetes API Audit Logging records every event traversing the kube-apiserver. By defining an audit policy (`Metadata`, `Request`, `RequestResponse`) and streaming logs to immutable storage (like S3 with Object Lock), enterprises provide non-falsifiable compliance evidence for SOC2 and ISO 27001."
    },
    quests: [
      { id: "devops-m2-d58-q1", name: "SOC2 Type II & ISO 27001 Controls Mapping for Cloud Platforms", type: "concept", desc: "Map access control, change management, encryption, and auditability requirements to Kubernetes primitives." },
      { id: "devops-m2-d58-q2", name: "Detective Lab: The Spoofed Unsigned Git Commit Audit Failure", type: "detective", desc: "Audit a repository for unsigned commits and enforce mandatory GPG signature verification in GitHub." },
      { id: "devops-m2-d58-q3", name: "Mastery Assignment: Kubernetes API Immutable Audit Policy & WORM Spec", type: "assignment", desc: "Author an enterprise kube-apiserver audit policy manifest with granular logging levels and S3 exports." },
      { id: "devops-m2-d58-q4", name: "Production Incident Lab: Audit Log Tampering Detection Drill", type: "detective", desc: "Detect and alert on unauthorized attempts to modify audit logging daemonsets in a regulated cluster." }
    ]
  },
  {
    day: 59,
    month: 2,
    blockNum: 12,
    title: "Production Production Readiness Review (PRR): Operational Excellence Scorecards, Capacity Modeling & GameDays",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Staff Platform Governance (Production Readiness Reviews & Capacity Planning)",
    spokenGoal: "Ensure no service launches to production unprepared: master Google SRE Production Readiness Reviews (PRRs), operational excellence scorecards, capacity modeling, graceful degradation under load, and enterprise GameDay simulation execution.",
    conceptInvariant: "A microservice is NEVER ready for production launch merely because its code is written. A Production Readiness Review mandates: verified SLOs, multi-burn-rate alerts, tested runbooks, automated canary rollouts, capacity headroom modeling, and proven chaos survival before production traffic opens.",
    failureMode: "Launching a high-profile marketing campaign for an untested service that immediately crashes because the team forgot to configure connection pooling, autoscaling, or health checks.",
    tryItFriction: "Complete a full SRE Production Readiness Review (PRR) scorecard for a mission-critical billing microservice, auditing 25 reliability criteria across monitoring, deployment, scaling, and security.",
    socraticHints: [
      "What is the purpose of a Google SRE Production Readiness Review (PRR)?",
      "To verify that a new service meets reliability, observability, and operability standards BEFORE it goes live!",
      "It catches architecture flaws, missing alerts, and single points of failure before users ever touch the system."
    ],
    situationalPuzzle: {
      scenario: "A product team wants to launch a new viral mobile game on Friday afternoon. The Staff SRE blocks the launch following a Production Readiness Review (PRR) because the team has no canary release configuration, no PDBs, and no runbooks for database failover. The Product Manager complains to the VP. Why is the SRE's decision justified?",
      options: [
        "SREs dislike product launches.",
        "Operational Risk & Reliability Guardrails: Launching without canaries, PDBs, and failover runbooks creates an unacceptable risk of catastrophic user downtime; SRE standards require that operational safeguards be in place before taking live traffic.",
        "Friday launches are illegal.",
        "Kubernetes is turned off on weekends."
      ],
      answerIdx: 1,
      debrief: "Production Readiness Reviews protect the business from reckless launches. Releasing services without canary guardrails, autoscaling, or incident runbooks transforms predictable operational risks into catastrophic outages. SRE governance ensures systems meet baseline reliability thresholds before launch."
    },
    quests: [
      { id: "devops-m2-d59-q1", name: "Google SRE Production Readiness Review (PRR) Framework", type: "concept", desc: "Audit the 7 PRR pillars: Design, Observability, Alerting, Capacity, Dependencies, Release, and Resilience." },
      { id: "devops-m2-d59-q2", name: "Detective Lab: The Unprepared Friday Afternoon Launch Audit", type: "detective", desc: "Execute a PRR audit on a candidate service, identify 8 critical operational deficiencies, and block launch." },
      { id: "devops-m2-d59-q3", name: "Mastery Assignment: Enterprise SRE Production Readiness Review Scorecard", type: "assignment", desc: "Author an automated PRR evaluation template with scoring rubrics, capacity formulas, and sign-off criteria." },
      { id: "devops-m2-d59-q4", name: "Production Incident Lab: Pre-Launch GameDay Failure Drill", type: "detective", desc: "Execute an executive GameDay simulation injecting database latency and verify operational runbook execution." }
    ]
  },
  {
    day: 60,
    month: 2,
    blockNum: 12,
    title: "🏆 MASTER CAPSTONE VIVA: `ApexDevOps GlobalGrid` Zero-Downtime Multi-Cluster Sovereign Cloud Platform & Live Architectural Defense",
    stageName: "Stage 4: Autonomous Production Mastery",
    stageNum: 4,
    pedagogicalRole: "Staff Principal SRE & Platform Architect Viva Voce Defense",
    spokenGoal: "Defend your complete Staff DevOps & SRE qualification: present and defend `ApexDevOps GlobalGrid`—a multi-region, zero-downtime sovereign cloud platform engineered for 99.999% availability. Defend every architectural decision live before an executive examination board.",
    conceptInvariant: "The Staff DevOps & SRE Standard: True operational mastery is the synthesis of immutable GitOps delivery, kernel-level eBPF networking, cryptographic supply chain integrity, multi-burn-rate observability, automated self-healing runbooks, and proven multi-region active-active disaster recovery.",
    failureMode: "Presenting an architecture that relies on manual interventions, unverified container images, or single-cluster dependencies, disqualifying the design from enterprise Staff qualification.",
    tryItFriction: "Defend the entire architectural portfolio live before an executive examination board, surviving real-time failure injections (simultaneous cluster blackout, corrupted container supply chain, and BGP routing failure) without service interruption.",
    socraticHints: [
      "What distinguishes a Staff DevOps / SRE Architect from a senior engineer during an architectural defense?",
      "The ability to defend systemic trade-offs: balancing velocity vs reliability, cost vs redundancy, and security vs developer friction!",
      "Every design decision is justified with empirical data, mathematical invariants, and zero-downtime proofs."
    ],
    situationalPuzzle: {
      scenario: "During your Staff Principal Capstone Defense, the Chief Technology Officer asks: 'What is the single most critical architectural decision in your ApexDevOps platform that prevents a rogue employee with admin access from deploying a malicious backdoor to production?' What is the definitive Staff Architect answer?",
      options: [
        "We trust all employees because they signed an NDA.",
        "End-to-End Cryptographic Zero-Trust Delivery: 1) Developers have zero direct cluster access; 2) Git enforces signed commits; 3) CI builds are SLSA Level 3 hermetic; 4) Images are signed via keyless Cosign; 5) In-cluster Kyverno webhooks reject any artifact not signed by the official pipeline.",
        "We use strong passwords.",
        "The CTO manually inspects every container."
      ],
      answerIdx: 1,
      debrief: "A Staff Platform Architect designs systems where security is enforced mathematically, not through human trust. By decoupling cluster access from humans, enforcing signed commits, hermetic SLSA builds, keyless Cosign attestation, and cluster admission verification, even an internal actor cannot bypass the secure delivery chain."
    },
    quests: [
      { id: "devops-m2-d60-q1", name: "Staff Capstone Blueprint: ApexDevOps GlobalGrid Architecture Document", type: "concept", desc: "Deliver full enterprise architecture: multi-cluster CAPI, Cilium eBPF, SLSA Level 3 pipeline, and SRE observability." },
      { id: "devops-m2-d60-q2", name: "Detective Lab: The 5-Nines SLA Reliability & Security Audit", type: "detective", desc: "Audit the complete system for single points of failure, unmonitored dependencies, and manual operational toil." },
      { id: "devops-m2-d60-q3", name: "Mastery Assignment: ApexDevOps Global Infrastructure as Code & GitOps Fleet Suite", type: "assignment", desc: "Deliver production Terraform, Helm, ArgoCD, and Kyverno manifests deploying the entire multi-cluster platform." },
      { id: "devops-m2-d60-q4", name: "Staff Capstone Viva: Live Executive Board Architectural Defense", type: "detective", desc: "Defend your design choices, trade-offs, security model, and disaster recovery SLA live before the Staff Examination Board." }
    ]
  }
];
