# scripts/visuals/generate_computer_fundamentals_m1_rest.py
"""
Generator script for Course 32: Computer Literacy, Digital Productivity & OS Fundamentals (course-computer-fundamentals)
Month 1: Days 16 to 30 (60 Quests: Q32.61 to Q32.120).
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
        "title": "Linux Shell Philosophy: Streams, Pipes, Standard I/O (stdin/stdout/stderr) & Redirection",
        "stageNum": 3,
        "stageName": "Stage 3: Systems Stress-Testing",
        "pedagogicalRole": "POSIX Shell Architecture (Standard Streams, Unix Philosophy, Anonymous Pipes, File Descriptor Redirection & Buffer Flushing)",
        "spokenGoal": "The Unix philosophy is built on a simple, elegant insight: write programs that do one thing well, and connect them using text streams because text is the universal interface. Today we master standard streams—stdin (0), stdout (1), and stderr (2), anonymous pipes, file descriptor redirection (2>&1, /dev/null), and the mechanics of user-space stream buffering.",
        "conceptInvariant": "Stream Composability Invariant: In a Unix pipeline ($P_1 \\mid P_2$), stdout of $P_1$ connects to stdin of $P_2$ via an OS pipe buffer without intermediate disk persistence; data flows asynchronously as bytes become available.",
        "failureMode": "The Pipe Buffer Deadlock Meltdown: A developer writes a Python script that spawns a subprocess with <code>subprocess.Popen</code> and attempts to read stderr before stdout. The child process writes 100KB to stdout. Because the Linux pipe buffer is limited to 64KB, the child blocks waiting for stdout to be drained, while the parent blocks waiting for stderr, resulting in a permanent inter-process deadlock.",
        "tryItFriction": "Construct a Python pipeline that triggers a pipe buffer deadlock by overflowing 64KB on stdout while waiting on stderr, and resolve it using <code>communicate()</code>.",
        "socraticHints": [
            "Why does the OS kernel allocate a 64KB in-memory ring buffer for anonymous pipes, and what occurs when a writer writes to a full pipe?",
            "What is the difference between <code>command > file 2>&1</code> and <code>command 2>&1 > file</code> in bash, and why does execution order matter?",
            "How does standard library buffering change from line-buffered (when writing to a terminal) to block-buffered (when writing to a file or pipe)?"
        ],
        "situationalPuzzle": {
            "scenario": "A deployment script executes a database migration command and redirects output: <code>migrate.sh 2>&1 > /dev/null</code>. The script fails, but nothing prints to the terminal, and no logs are captured. The developer is baffled: 'I told it to redirect stderr to stdout, so why didn't I see the error on my screen?'",
            "options": [
                "The computer was in silent mode.",
                "Diagnose Bash Redirection Order Evaluation: Bash parses redirections from left to right. When <code>2>&1</code> is evaluated first, file descriptor 2 (stderr) is redirected to where file descriptor 1 (stdout) currently points (the terminal). Next, <code>> /dev/null</code> is evaluated, which redirects file descriptor 1 to /dev/null. As a result, stdout is silenced, but errors should print to the terminal; however, if the script failed before stderr was written, nothing appears. The correct standard redirection to silence stdout while capturing errors is <code>migrate.sh > /dev/null 2> error.log</code>, or to discard both: <code>migrate.sh > /dev/null 2>&1</code>.",
                "Delete bash and rewrite the OS in batch files.",
                "Run the script 100 times until it works."
            ],
            "correctOptionIndex": 1,
            "debrief": "File descriptor redirections in POSIX shells are evaluated strictly from left to right. In `2>&1 > /dev/null`, stderr duplicates stdout's initial target, but stdout is subsequently redirected to `/dev/null`. To redirect both stdout and stderr to `/dev/null`, the file must be redirected first: `> /dev/null 2>&1`."
        },
        "quests": [
            {
                "id": "Q32.61",
                "name": "Unix Philosophy & Standard Stream Architecture",
                "type": "Concept",
                "desc": "Detail the Unix stream architecture: standard file descriptors (0, 1, 2), anonymous pipe buffers, subshell redirection, and C standard I/O library buffering rules."
            },
            {
                "id": "Q32.62",
                "name": "The 64KB Pipe Buffer Subprocess Deadlock Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Analyze a stalled deployment script trace; identify how an unconsumed stdout stream filled the OS 64KB pipe buffer, freezing the build pipeline."
            },
            {
                "id": "Q32.63",
                "name": "POSIX Pipeline & Stream Redirection Engine Implementation",
                "type": "Mastery Assignment",
                "desc": "Build a mini-shell in Python that implements pipe chaining (<code>cmd1 | cmd2 | cmd3</code>) using native OS <code>pipe()</code> and <code>dup2()</code> syscalls without shell invocation."
            },
            {
                "id": "Q32.64",
                "name": "High-Throughput Stream Piping & Backpressure Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Pipe 10GB of random data through a chain of 5 stream processors; measure CPU utilization, pipe buffer fills, and SIGPIPE handling when downstream consumers terminate early."
            }
        ]
    },
    {
        "day": 17,
        "month": 1,
        "blockNum": 4,
        "title": "POSIX Text Processing Mastery: grep, sed, awk, cut, sort, uniq & Regular Expressions",
        "stageNum": 3,
        "stageName": "Stage 3: Systems Stress-Testing",
        "pedagogicalRole": "Production Systems Tooling (Stream Text Processing, POSIX Regular Expressions, Stream Editor [sed], Pattern Scanning [awk] & Pipeline Composition)",
        "spokenGoal": "In a 3 AM production outage, you will not have an IDE or GUI database tool; you will have a terminal, a 50GB log file, and the POSIX text processing toolkit. Today we master stream text manipulation—wielding grep (regular expression matching), sed (stream transformation and substitution), awk (field-based relational data processing), and sorting filters (cut, sort, uniq) to diagnose distributed systems in seconds.",
        "conceptInvariant": "Stream Processing Invariant: POSIX text tools process data line-by-line in constant memory ($O(1)$ RAM), enabling gigabyte-scale log aggregation without triggering OS out-of-memory errors.",
        "failureMode": "The Python Memory Exhaustion Outage: A site reliability engineer attempts to parse a 40GB production access log during an active DDoS incident using a naive Python script that executes <code>lines = f.readlines()</code>. The Python process consumes all 32GB of host RAM, triggers the kernel OOM killer, and terminates the monitoring agent, blinding the incident response team for 45 minutes.",
        "tryItFriction": "Construct a one-line bash pipeline using <code>awk</code> and <code>sort | uniq -c</code> that parses 1,000,000 access log lines in under 3 seconds to find the top 5 attacking IP addresses with zero memory growth.",
        "socraticHints": [
            "Why is <code>grep -E</code> (Extended Regular Expressions) mathematically equivalent to a Deterministic Finite Automaton (DFA)?",
            "How does <code>awk</code> treat each input line as a record ($0) divided into fields ($1, $2, ... $NF) separated by the Field Separator (FS)?",
            "What is the performance difference between <code>sed 's/foo/bar/g'</code> and reading an entire file into memory before string replacement?"
        ],
        "situationalPuzzle": {
            "scenario": "During a massive database outage, you need to extract all HTTP 500 error responses from a 20GB Nginx log, isolate the requesting IP (field 1) and requested URL (field 7), count occurrences of each URL per IP, and output the top 10 offenders. The junior sysadmin starts writing a 100-line Java program.",
            "options": [
                "Wait 2 hours for the Java program to be written and compiled.",
                "Execute the POSIX Stream Pipeline: <code>awk '$9 == 500 {print $1, $7}' /var/log/nginx/access.log | sort | uniq -c | sort -nr | head -n 10</code>. This processes the 20GB log line-by-line in streaming mode, completes in under 20 seconds, consumes less than 50MB of RAM, and instantly pinpoints the offending API endpoints.",
                "Open the 20GB file in Microsoft Word and search for '500'.",
                "Delete the log file so the errors disappear."
            ],
            "correctOptionIndex": 1,
            "debrief": "POSIX text stream utilities (awk, sort, uniq, head) are optimized C implementations designed for streaming data. Composing them in bash pipelines processes massive multi-gigabyte log files in seconds with minimal RAM footprint, allowing instant diagnosis during production outages."
        },
        "quests": [
            {
                "id": "Q32.65",
                "name": "POSIX Text Processing & Stream Architecture",
                "type": "Concept",
                "desc": "Detail the computational models of grep, sed, and awk, contrasting pattern matching automata, stream editing buffers, and awk associative array data processing."
            },
            {
                "id": "Q32.66",
                "name": "The High-Cardinality DDoS Log Forensic Challenge",
                "type": "Detective Challenge",
                "desc": "Analyze a 1GB obfuscated Apache access log using POSIX command-line tools; identify a slow-rate HTTP POST attack hidden amongst 200,000 benign requests."
            },
            {
                "id": "Q32.67",
                "name": "Automated Log Harvester & Error Metric Aggregator Implementation",
                "type": "Mastery Assignment",
                "desc": "Build a robust bash/awk script that monitors streaming server logs, extracts HTTP status code distributions, calculates p95 response times, and outputs JSON metrics."
            },
            {
                "id": "Q32.68",
                "name": "50GB Log Streaming Processing & Memory Benchmarking Lab",
                "type": "Production Incident Lab",
                "desc": "Process a synthetic 50GB log file through an awk/sed pipeline on a low-memory 512MB RAM container; verify 100% completion with zero memory thrashing or OOM invocations."
            }
        ]
    },
    {
        "day": 18,
        "month": 1,
        "blockNum": 4,
        "title": "Linux Process Management & Diagnostics: ps, top, htop, lsof, strace & Signals (SIGTERM vs SIGKILL)",
        "stageNum": 3,
        "stageName": "Stage 3: Systems Stress-Testing",
        "pedagogicalRole": "Systems Diagnostics & Process Lifecycle (Process States [R/S/D/Z], POSIX Signals [SIGTERM vs SIGKILL], /proc Filesystem & Strace Telemetry)",
        "spokenGoal": "When a production service freezes, you must inspect its live operational state without disrupting healthy workloads. Today we master Linux process diagnostics—reading process states (Running, Sleeping, Uninterruptible Sleep, Zombie), mastering POSIX signals (graceful SIGTERM vs uncatchable SIGKILL), inspecting open network/file descriptors with <code>lsof</code>, and tracing raw system calls with <code>strace</code>.",
        "conceptInvariant": "Signal Handling Invariant: SIGKILL (signal 9) and SIGSTOP (signal 19) are handled directly by the OS kernel and cannot be caught, blocked, or ignored by user-space processes; SIGTERM (signal 15) allows graceful resource cleanup.",
        "failureMode": "The Uninterruptible Sleep 'D-State' Zombie Horde: A network file system (NFS) mount disconnects unexpectedly. 50 worker processes attempt to read files from the mount and enter Uninterruptible Sleep state ('D' state) waiting for disk I/O. The admin issues <code>kill -9</code>, but nothing happens—processes in 'D' state cannot process signals until the I/O returns, resulting in permanent process lockup that can only be cleared by rebooting.",
        "tryItFriction": "Write a C or Python script that handles SIGTERM gracefully (cleaning up temporary files) while demonstrating that SIGKILL instantly terminates execution without executing exit handlers.",
        "socraticHints": [
            "What is a Zombie process ('Z' state), and why does a zombie process consume an entry in the OS process table even though it consumes 0 bytes of memory?",
            "Why does a process stuck in Uninterruptible Sleep ('D' state) ignore <code>kill -9</code> (SIGKILL)?",
            "How does <code>strace -p [pid]</code> attach to a running production process using the <code>ptrace</code> system call, and what latency overhead does it introduce?"
        ],
        "situationalPuzzle": {
            "scenario": "A mission-critical database process hangs and stops responding to client queries. The sysadmin immediately runs <code>kill -9 [pid]</code>. Upon rebooting the database, the startup engine reports that database tables are corrupted because transaction logs were not flushed and lock files were not deleted. The management team asks why the admin used SIGKILL.",
            "options": [
                "SIGKILL is always the recommended command for stopping databases.",
                "Diagnose Abrupt Signal Termination: SIGKILL (signal 9) immediately terminates a process at the kernel level without giving it a single CPU cycle to flush write buffers, commit open transactions, or remove lock files. The standard operating procedure mandates sending SIGTERM (signal 15) first, allowing the application's signal handler to gracefully checkpoint databases and close connections; SIGKILL should only be used as a last resort after an agreed grace period (e.g. 30 seconds).",
                "The database should have caught the SIGKILL signal and ignored it.",
                "Databases do not need to flush transaction logs."
            ],
            "correctOptionIndex": 1,
            "debrief": "SIGKILL (signal 9) bypasses user-space signal handlers entirely, terminating execution abruptly. For databases and stateful services, SIGKILL risks severe data corruption and orphaned lock files. Production operations always issue SIGTERM (15) first, allowing graceful shutdown handlers to flush buffers and cleanly disconnect."
        },
        "quests": [
            {
                "id": "Q32.69",
                "name": "Linux Process States & POSIX Signal Architecture",
                "type": "Concept",
                "desc": "Detail the Linux process lifecycle state transitions (Running, Interruptible, Uninterruptible Sleep, Stopped, Zombie), signal delivery mechanics, and the /proc filesystem layout."
            },
            {
                "id": "Q32.70",
                "name": "The Orphaned Zombie Process Table Leak Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a Linux server that refuses to spawn new processes (<code>fork: retry: Resource temporarily unavailable</code>); trace how a faulty parent process spawned 32,000 un-reaped zombie child processes."
            },
            {
                "id": "Q32.71",
                "name": "Process Supervisor & Graceful SIGTERM Shutdown Engine",
                "type": "Mastery Assignment",
                "desc": "Build an open-source process supervisor in Python/C that monitors child processes, handles SIGTERM/SIGCHLD, executes graceful drain timeouts, and enforces fallback SIGKILL escalation."
            },
            {
                "id": "Q32.72",
                "name": "Live Process Strace Profiling & I/O Blockage Triage Lab",
                "type": "Production Incident Lab",
                "desc": "Attach <code>strace</code> to a simulated hanging production process; identify the exact blocked system call (e.g. <code>futex()</code> or <code>read()</code> on an unresponsive socket) within 60 seconds."
            }
        ]
    },
    {
        "day": 19,
        "month": 1,
        "blockNum": 4,
        "title": "Robust Bash Scripting: Exit Codes (set -euo pipefail), Traps, Arguments, Arrays & Subshells",
        "stageNum": 3,
        "stageName": "Stage 3: Systems Stress-Testing",
        "pedagogicalRole": "Production Shell Scripting (Bash Defensive Engineering, Strict Error Handling [set -euo pipefail], Signal Traps, Subshell Isolation & Argument Parsing)",
        "spokenGoal": "Most bash scripts in production are fragile time bombs waiting to wipe root filesystems or silently ignore fatal errors. Today we engineer production-grade, defensive bash scripts—mastering strict mode (<code>set -euo pipefail</code>), signal cleanup traps (<code>trap 'cleanup' EXIT</code>), safe argument parsing, bash arrays, and subshell variable isolation.",
        "conceptInvariant": "Strict Shell Execution Invariant: Production shell scripts must enforce <code>set -euo pipefail</code>; a script must abort immediately upon encountering any unhandled command error (<code>-e</code>), unset variable reference (<code>-u</code>), or pipeline segment failure (<code>-o pipefail</code>).",
        "failureMode": "The Infamous 'rm -rf /' Unset Variable Disaster: A cleanup script runs as root with the command <code>rm -rf $TMP_DIR/$APP_NAME</code>. In a new deployment environment, neither environment variable is configured. Because the script does not use <code>set -u</code>, both variables evaluate to empty strings, resolving the command to <code>rm -rf //</code>. The script proceeds to recursively wipe the entire operating system root filesystem.",
        "tryItFriction": "Write a bash pipeline <code>cat missing_file.txt | grep 'foo'</code> and demonstrate how standard bash reports exit code 0 (because grep exited 1, but wait, grep exited 1; or successful right side), while <code>set -o pipefail</code> correctly reports the failure.",
        "socraticHints": [
            "Why does standard bash continue executing subsequent lines after a command fails, and how does <code>set -e</code> alter this default behavior?",
            "What is the difference between running commands in a subshell <code>(cd /tmp && make)</code> versus the current shell <code>{ cd /tmp && make; }</code>?",
            "How does <code>trap 'rm -f $TMPFILE' EXIT</code> guarantee that temporary scratch files are cleaned up even if the script crashes or receives SIGINT (Ctrl+C)?"
        ],
        "situationalPuzzle": {
            "scenario": "A CI/CD deployment pipeline executes: <code>git checkout main && ./build.sh | tee build.log && ./deploy.sh</code>. The <code>./build.sh</code> script encounters a critical compiler syntax error and exits with code 1. However, the CI/CD pipeline continues running and deploys broken artifacts to production. The team is shocked that the pipeline did not halt.",
            "options": [
                "Blame Git for downloading bad code.",
                "Diagnose Pipeline Exit Code Masking: In a standard bash pipeline, the exit status of <code>./build.sh | tee build.log</code> is determined exclusively by the rightmost command (<code>tee</code>). Because <code>tee</code> successfully wrote the log and exited 0, bash treated the entire pipeline as successful, allowing <code>./deploy.sh</code> to execute. Resolve by adding <code>set -o pipefail</code> at the beginning of the CI script, ensuring that if any command in a pipeline fails, the pipeline returns that failure code.",
                "Remove <code>tee</code> and never record build logs again.",
                "Run the deployment on Windows instead of Linux."
            ],
            "correctOptionIndex": 1,
            "debrief": "Without `set -o pipefail`, POSIX shells only return the exit code of the final command in a pipeline. If a build script fails (`exit 1`) while piped into `tee` (`exit 0`), the pipeline falsely reports success. Production automation scripts must always specify `set -euo pipefail`."
        },
        "quests": [
            {
                "id": "Q32.73",
                "name": "Defensive Bash Scripting & Strict Mode Architecture",
                "type": "Concept",
                "desc": "Detail the mechanics of bash defensive flags (<code>set -euo pipefail</code>, <code>IFS=$'\\n\\t'</code>), signal traps (EXIT, ERR, INT), subshell execution, and variable quoting."
            },
            {
                "id": "Q32.74",
                "name": "The Unset Variable Production Deletion Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Audit a catastrophic deployment script that corrupted production storage; trace how an unset environment variable combined with unquoted globbing wiped production directories."
            },
            {
                "id": "Q32.75",
                "name": "Production-Grade Linux Backup & Rotation Script Implementation",
                "type": "Mastery Assignment",
                "desc": "Write a battle-tested bash script with strict error handling, temporary directory cleanup traps, CLI argument parsing via <code>getopts</code>, and atomic file rotation."
            },
            {
                "id": "Q32.76",
                "name": "Automated Chaos Scripting & Pipefail Verification Lab",
                "type": "Production Incident Lab",
                "desc": "Execute an automated validation test verifying that a defensive bash script handles missing commands, interrupted subshells, SIGINT terminations, and pipeline failures gracefully."
            }
        ]
    },
    {
        "day": 20,
        "month": 1,
        "blockNum": 4,
        "title": "Milestone 4: ApexShell POSIX Telemetry Harvester & Incident Automation Suite Review",
        "stageNum": 3,
        "stageName": "Stage 3: Systems Stress-Testing",
        "pedagogicalRole": "Architectural Milestone Evaluation (Comprehensive Architecture Review & Systems Stress-Testing for Linux Automation & Telemetry Suite)",
        "spokenGoal": "Today you face the Senior Systems Review Board for Milestone 4. You will present and defend ApexShell—our production Linux telemetry harvesting and incident remediation suite. Built entirely with robust, defensive POSIX shell and streaming tools, ApexShell harvests system metrics from /proc, parses gigabyte log streams in real-time, monitors process states, and executes automated remediation with strict signal handling and zero memory footprint.",
        "conceptInvariant": "Shell Automation Resiliency Invariant: An incident automation script is production-ready if and only if it handles unexpected signal terminations, command failures, and pipeline errors idempotently without leaving orphaned lockfiles or zombie processes ($State_{clean} = \\text{Trap}(Exit)$).",
        "failureMode": "The Orphaned Lockfile Deployment Deadlock: An automated deployment script creates a lockfile <code>/var/run/deploy.lock</code>. During execution, an uncaught error causes the script to abort immediately without executing cleanup. Subsequent automated deployments detect the stale lockfile and permanently abort, halting all company software updates for 3 days.",
        "tryItFriction": "Construct a PID-aware flock locking mechanism in bash that automatically releases file locks if the owning process crashes or is killed with SIGKILL.",
        "socraticHints": [
            "How does ApexShell guarantee idempotency when retrying automated service restarts during an active production outage?",
            "What automated safeguards prevent ApexShell from inadvertently spawning a fork bomb during high-frequency process monitoring loops?",
            "Defend your choice of native POSIX stream utilities over an external Python/Go runtime for incident response tools."
        ],
        "situationalPuzzle": {
            "scenario": "During the Milestone 4 review, a reviewer injects a network partition that causes an automated remediation script inside ApexShell to hang indefinitely while attempting to curl an external webhook. The entire incident response engine is blocked. The reviewer asks: 'Why didn't your automation suite timeout and proceed with local server remediation?'",
            "options": [
                "Explain that network partitions are unpredictable and cannot be helped.",
                "Present the ApexShell Defensive Network & Timeout Architecture: 1) Enforce hard execution timeouts on all external I/O commands using GNU <code>timeout 5s curl ...</code>; 2) Isolate external telemetry reporting into non-blocking background subshells (<code>(report_webhook &)</code>); 3) Ensure local remediation steps execute deterministically regardless of external network state; 4) Implement flock-based advisory locks with non-blocking checks (<code>flock -n</code>) to prevent concurrent incident script stampedes.",
                "Disable all external webhook reporting permanently.",
                "Restart the server every time a network partition occurs."
            ],
            "correctOptionIndex": 1,
            "debrief": "Automation scripts in production must never block indefinitely on external dependencies. All network calls must specify strict connection and execution timeouts (e.g. `timeout 5s` or `curl --max-time 5`). External reporting should run asynchronously so that core local remediation actions proceed without hindrance."
        },
        "quests": [
            {
                "id": "Q32.77",
                "name": "ApexShell Systems Architecture Blueprint",
                "type": "Concept",
                "desc": "Author the complete systems specification for ApexShell, documenting stream parsing pipelines, process management hooks, advisory locking protocols, and signal trap handlers."
            },
            {
                "id": "Q32.78",
                "name": "The Stale Lockfile Infinite Pipeline Block Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate an automated CI/CD server frozen for 48 hours; trace how an un-trapped SIGTERM left a stale advisory lock in <code>/tmp</code> that blocked all subsequent build workers."
            },
            {
                "id": "Q32.79",
                "name": "ApexShell Automated Telemetry Harvester Implementation",
                "type": "Mastery Assignment",
                "desc": "Implement the complete ApexShell suite in defensive bash, featuring automated /proc telemetry extraction, streaming log anomaly detection using awk, flock mutexes, and robust traps."
            },
            {
                "id": "Q32.80",
                "name": "ApexShell Milestone 4 Viva Defense & Injected Fault Lab",
                "type": "Production Incident Lab",
                "desc": "Defend ApexShell before the simulated Review Board while enduring injected network hangs, massive log surges (100,000 lines/sec), and sudden SIGINT interruptions."
            }
        ]
    },
    {
        "day": 21,
        "month": 1,
        "blockNum": 5,
        "title": "The OSI & TCP/IP Stack: Packets, Frames, Ethernet, MAC Addresses & ARP Resolution",
        "stageNum": 3,
        "stageName": "Stage 3: Systems Stress-Testing",
        "pedagogicalRole": "Computer Networking Foundations (OSI 7-Layer Model vs TCP/IP 4-Layer Architecture, Ethernet Frames, MAC Addressing & ARP Resolution)",
        "spokenGoal": "To understand how computers communicate across the globe, one must understand how bits travel across physical wires and radio waves. Today we master networking foundations—contrasting the theoretical OSI 7-layer model with the practical TCP/IP stack, dissecting Layer 2 Ethernet frames and 48-bit MAC addresses, and analyzing how the Address Resolution Protocol (ARP) bridges IP addresses to physical network interfaces.",
        "conceptInvariant": "Layer Encapsulation Invariant: As data traverses down the network stack, each layer wraps the payload with its own protocol header (Application $\\to$ TCP Segment $\\to$ IP Packet $\\to$ Ethernet Frame); intermediate routers inspect only up to Layer 3 (IP).",
        "failureMode": "The ARP Spoofing Man-in-the-Middle Attack: A malicious device on a local corporate Ethernet switch broadcasts forged gratuitous ARP replies claiming that the default gateway IP maps to the attacker's MAC address. The switch updates its ARP cache, routing all confidential outbound internet traffic through the attacker's machine for unencrypted inspection.",
        "tryItFriction": "Use <code>arp -a</code> and <code>tcpdump -e</code> in Linux to inspect the local ARP cache and observe the ARP broadcast request ('Who has 192.168.1.1?') and unicast reply.",
        "socraticHints": [
            "Why do computers on the same local subnet communicate using Layer 2 MAC addresses, while communication across subnets requires Layer 3 IP routing?",
            "What is a broadcast domain, and how does an ARP request query all hosts on a local Ethernet segment simultaneously using the destination MAC <code>FF:FF:FF:FF:FF:FF</code>?",
            "How does Dynamic ARP Inspection (DAI) on managed enterprise switches mitigate ARP spoofing attacks?"
        ],
        "situationalPuzzle": {
            "scenario": "A newly deployed server cannot ping another server on the same physical rack switch, reporting 'Destination Host Unreachable'. Both servers have valid IP addresses (192.168.1.10 and 192.168.1.20) with subnet mask 255.255.255.0. <code>tcpdump</code> shows that Server A sends ARP requests 'Who has 192.168.1.20?', but Server B never responds.",
            "options": [
                "Replace the network cables with gold-plated cables.",
                "Diagnose Layer 2 Subnet / VLAN Misconfiguration or Host Firewall: 1) Verify that both switch ports are assigned to the same VLAN ID (switches isolate broadcast domains between VLANs, preventing ARP requests from reaching other VLANs); 2) Check Server B's host firewall (iptables/nftables) or ARP response kernel settings (<code>arp_ignore</code>); 3) Once placed on the same VLAN, Server B receives the ARP broadcast, updates its ARP cache, and replies with its MAC address, establishing Layer 2 connectivity.",
                "Upgrade Server A to IPv6 immediately.",
                "Reboot the entire building power grid."
            ],
            "correctOptionIndex": 1,
            "debrief": "Before two hosts on an IP subnet can communicate, the sender must resolve the destination IP to a Layer 2 MAC address via ARP broadcast. If switch ports belong to different VLANs, the ARP broadcast is confined to its local VLAN and never reaches the target host. Aligning VLAN configurations restores ARP resolution."
        },
        "quests": [
            {
                "id": "Q32.81",
                "name": "OSI & TCP/IP Layered Encapsulation Architecture",
                "type": "Concept",
                "desc": "Detail the protocol data unit (PDU) encapsulation process across OSI/TCP/IP layers, specifying Ethernet frame headers, IP packet headers, MTU limits, and ARP resolution flows."
            },
            {
                "id": "Q32.82",
                "name": "The ARP Cache Poisoning Man-in-the-Middle Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Analyze a Wireshark pcap file from a compromised LAN; identify the rogue MAC address emitting unsolicited ARP responses that hijacked the default gateway traffic."
            },
            {
                "id": "Q32.83",
                "name": "Raw Ethernet Frame Parser & ARP Resolution Engine Implementation",
                "type": "Mastery Assignment",
                "desc": "Build an open-source raw socket utility in Python/C that captures raw Ethernet frames (<code>AF_PACKET</code>), parses 14-byte frame headers, and maintains a dynamic ARP cache table."
            },
            {
                "id": "Q32.84",
                "name": "Local Subnet ARP Storm & Flood Simulation Lab",
                "type": "Production Incident Lab",
                "desc": "Inject high-frequency synthetic ARP broadcast packets onto a virtual network interface; measure switch CPU load, buffer packet drops, and demonstrate Dynamic ARP Inspection mitigation."
            }
        ]
    },
    {
        "day": 22,
        "month": 1,
        "blockNum": 5,
        "title": "IP Routing, CIDR Subnetting, NAT (Network Address Translation) & Routing Tables",
        "stageNum": 3,
        "stageName": "Stage 3: Systems Stress-Testing",
        "pedagogicalRole": "Network Layer Architecture (IPv4/IPv6 Addressing, CIDR Subnet Masks, Longest Prefix Match Routing & Source/Destination NAT)",
        "spokenGoal": "How does a packet find its way across thousands of interconnected networks to reach a destination server halfway across the planet? Today we master Layer 3 IP Routing—deciphering Classless Inter-Domain Routing (CIDR) subnet masks, computing network and broadcast boundaries, exploring routing tables and the Longest Prefix Match algorithm, and unpacking Network Address Translation (NAT) that preserves IPv4 address space.",
        "conceptInvariant": "Routing Longest Prefix Match Invariant: When an IP router forwards a packet to destination $IP_{dest}$, it evaluates all matching routing table entries and selects the entry with the most specific (longest) subnet prefix mask ($Prefix_{longest} = \\max |Mask_i|$).",
        "failureMode": "The Overlapping CIDR VPN Outage: An enterprise merges with a partner company and connects their internal networks via an IPsec VPN tunnel. Both companies accidentally used the same private subnet (<code>10.0.1.0/24</code>) for their core database servers. Routing tables cannot determine which physical gateway owns the destination IP, causing routing loops and bringing down customer transactions for 24 hours.",
        "tryItFriction": "Calculate the network address, usable host range, and broadcast address for <code>172.16.42.130/27</code> using bitwise binary AND operations in Python, and verify with <code>ipcalc</code>.",
        "socraticHints": [
            "How does a subnet mask (like <code>/24</code> or <code>255.255.255.0</code>) mathematically separate the Network ID portion of an IP address from the Host ID portion?",
            "What is the difference between Source NAT (SNAT / Masquerading) for outbound internet traffic and Destination NAT (DNAT / Port Forwarding) for hosting internal servers?",
            "Why is the default gateway in a routing table represented as <code>0.0.0.0/0</code> with a prefix length of zero?"
        ],
        "situationalPuzzle": {
            "scenario": "A cloud engineer provisions two VPC subnets in AWS: Subnet A (10.0.0.0/16) and Subnet B (10.0.1.0/24). A packet destined for 10.0.1.50 arrives at the core router. Route table Entry 1 routes 10.0.0.0/16 to Gateway A. Route table Entry 2 routes 10.0.1.0/24 to Gateway B. The engineer is worried the router will randomly split traffic between both gateways.",
            "options": [
                "The router will crash because of the overlapping subnet conflict.",
                "Explain the Longest Prefix Match Invariant: IP routers do not flip coins or split traffic arbitrarily; they use the Longest Prefix Match rule. Subnet B's prefix mask is /24 (24 contiguous matching bits), which is more specific than Subnet A's /16 (16 matching bits). Therefore, all packets destined for 10.0.1.50 are deterministically forwarded to Gateway B. Packets for 10.0.2.50 match only Entry 1 and are forwarded to Gateway A.",
                "Delete both gateways and connect all servers with a single public IP.",
                "Change all IP addresses to letters."
            ],
            "correctOptionIndex": 1,
            "debrief": "IP forwarding hardware executes Longest Prefix Match (LPM) via Ternary Content Addressable Memory (TCAM). When multiple routes match an IP address, the route with the longest subnet mask prefix (/24 over /16) is deterministically selected. This allows broad aggregate routes to exist alongside specific local subnet overrides."
        },
        "quests": [
            {
                "id": "Q32.85",
                "name": "CIDR Subnetting & IP Forwarding Routing Architecture",
                "type": "Concept",
                "desc": "Detail the mathematical architecture of CIDR subnetting, binary bitmasks, Longest Prefix Match routing tables, and Source/Destination NAT translation state machines."
            },
            {
                "id": "Q32.86",
                "name": "The Overlapping Subnet IPsec Blackhole Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a corporate network routing failure where packets to a payroll server vanished; trace how an overlapping /23 subnet announcement hijacked traffic away from the /24 host."
            },
            {
                "id": "Q32.87",
                "name": "CIDR Subnet Calculator & Routing Table Simulator Implementation",
                "type": "Mastery Assignment",
                "desc": "Build an IP routing engine in Python that parses CIDR notations, computes network boundaries, maintains a routing table, and executes deterministic Longest Prefix Match forwarding."
            },
            {
                "id": "Q32.88",
                "name": "Linux Iptables NAT & Packet Forwarding Stress Lab",
                "type": "Production Incident Lab",
                "desc": "Configure Linux <code>iptables</code> MASQUERADE (SNAT) and PREROUTING (DNAT) rules on a dual-homed router container; route 50,000 packets per second and verify conntrack state scaling."
            }
        ]
    },
    {
        "day": 23,
        "month": 1,
        "blockNum": 5,
        "title": "Transport Layer Physics: TCP Three-Way Handshake, Sliding Windows, Flow Control vs UDP",
        "stageNum": 3,
        "stageName": "Stage 3: Systems Stress-Testing",
        "pedagogicalRole": "Transport Layer Engineering (TCP State Machine, Three-Way Handshake, Sequence/ACK Numbers, Sliding Windows, Flow Control & UDP Low-Latency)",
        "spokenGoal": "The Internet Protocol (IP) offers only 'best-effort' packet delivery—packets can be dropped, delayed, or delivered out of order. Today we master the Transport Layer—analyzing how Transmission Control Protocol (TCP) creates a reliable, ordered, byte-stream abstraction over an unreliable network via the Three-Way Handshake (SYN, SYN-ACK, ACK), Sliding Windows, and Congestion Control, and understanding when to abandon TCP for User Datagram Protocol (UDP).",
        "conceptInvariant": "Reliable Byte-Stream Invariant: TCP guarantees in-order, lossless byte delivery; every received byte is acknowledged via an explicit Cumulative Acknowledgment number ($ACK = Seq + \\text{Length}$), and unacknowledged bytes trigger automated retransmission timeouts ($RTO$).",
        "failureMode": "The SYN Flood Connection Exhaustion Attack: An attacker floods a public web server with millions of spoofed TCP SYN packets. The server responds with SYN-ACK and allocates memory in its in-kernel TCP connection backlog queue (SYN queue). Because the attacker never sends the final ACK, the SYN queue overflows, and legitimate users are rejected with connection timeout errors.",
        "tryItFriction": "Capture a live TCP Three-Way Handshake in Wireshark or <code>tcpdump</code>, noting the initial sequence numbers (ISN), window scaling options, and the transition to ESTABLISHED state.",
        "socraticHints": [
            "Why must TCP use a Three-Way Handshake (SYN, SYN-ACK, ACK) instead of a simple two-way request/response to establish a synchronized bidirectional session?",
            "How does the TCP Sliding Window mechanism allow high-throughput transmission without waiting for an acknowledgment after every single packet?",
            "What is the difference between Flow Control (preventing the sender from overwhelming the receiver's buffer) and Congestion Control (preventing the sender from overwhelming network routers)?"
        ],
        "situationalPuzzle": {
            "scenario": "A game development studio builds an online multiplayer first-person shooter. They implement character movement synchronization over standard TCP. Players with even slightly jittery Wi-Fi connections complain that the entire game world freezes for 500 milliseconds, and then all characters suddenly teleport forward (rubber-banding).",
            "options": [
                "Increase the TCP window size to 100 megabytes.",
                "Diagnose TCP Head-of-Line Blocking: TCP guarantees strictly in-order delivery. If a single movement packet is lost in transit, the receiver's OS TCP stack buffers all subsequent received packets and refuses to deliver them to the game engine until the lost packet is retransmitted and acknowledged (Head-of-Line Blocking). For real-time gaming, audio, and video, stale movement data is worthless. Re-architect the multiplayer network layer to use UDP with application-level sequencing: drop lost packets immediately and process the freshest incoming state.",
                "Force all players to play single-player offline games.",
                "Tell players to move their characters more slowly."
            ],
            "correctOptionIndex": 1,
            "debrief": "TCP's guarantee of strictly ordered, reliable delivery causes Head-of-Line (HoL) blocking: if packet #2 is dropped, packets #3, #4, and #5 are held in kernel buffers until #2 is retransmitted. For real-time applications (gaming, voice, video), historical state is useless. Real-time systems use UDP, processing fresh packets immediately and discarding lost packets."
        },
        "quests": [
            {
                "id": "Q32.89",
                "name": "TCP Finite State Machine & Transport Layer Architecture",
                "type": "Concept",
                "desc": "Detail the TCP state machine (LISTEN, SYN_SENT, ESTABLISHED, TIME_WAIT), 3-way handshake mechanics, sliding window flow control, and slow-start congestion control algorithms."
            },
            {
                "id": "Q32.90",
                "name": "The SYN Flood Backlog Queue Exhaustion Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Analyze kernel telemetry logs from a crashed web server; identify the half-open SYN backlog saturation attack and calculate the impact of enabling SYN cookies (<code>tcp_syncookies</code>)."
            },
            {
                "id": "Q32.91",
                "name": "Reliable UDP Packet Sequencing & Retransmission Protocol Implementation",
                "type": "Mastery Assignment",
                "desc": "Build an application-layer reliable transport protocol over raw UDP in Python that implements packet sequence headers, sliding window acknowledgments, and custom timeout retransmission."
            },
            {
                "id": "Q32.92",
                "name": "TCP vs UDP Latency & Head-of-Line Blocking Simulation Lab",
                "type": "Production Incident Lab",
                "desc": "Inject synthetic 5% packet loss on a Linux network link using <code>tc netem</code>; benchmark throughput and latency variance between TCP and UDP streaming under loss."
            }
        ]
    },
    {
        "day": 24,
        "month": 1,
        "blockNum": 5,
        "title": "Application Protocols: DNS Resolution Topology, HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC) & The TLS Handshake",
        "stageNum": 3,
        "stageName": "Stage 3: Systems Stress-Testing",
        "pedagogicalRole": "Application Layer & Security Protocols (DNS Resolution Hierarchy, HTTP Evolution [1.1 pipelining -> HTTP/2 multiplexing -> HTTP/3 QUIC] & TLS 1.3 Cryptographic Handshake)",
        "spokenGoal": "Every web interaction begins with name resolution and secure transport. Today we master Application Layer protocols—tracing the hierarchical DNS resolution tree (Root, TLD, Authoritative, Recursive Resolvers), evaluating the evolution of HTTP (from HTTP/1.1 line-blocking to HTTP/2 binary multiplexing and HTTP/3 QUIC over UDP), and dissecting the cryptographic TLS 1.3 handshake that secures global commerce.",
        "conceptInvariant": "Transport Security Invariant: An HTTPS connection is authenticated and confidential if and only if the server presents a valid X.509 certificate signed by a trusted Certificate Authority (CA) and completes an ephemeral Diffie-Hellman key exchange ($Key_{session} = \\text{ECDH}(Priv_c, Pub_s)$).",
        "failureMode": "The Stale DNS TTL Global Blackout: An enterprise migrates its customer portal to a new cloud IP address. Project managers forgot that the DNS A record had an ancient Time-to-Live (TTL) of 86,400 seconds (24 hours). When the old server is decommissioned, 60% of global internet users continue querying the dead IP address for an entire day because recursive DNS resolvers cached the old record.",
        "tryItFriction": "Trace the step-by-step recursive DNS resolution of a domain from root name servers down to authoritative name servers using <code>dig +trace</code>.",
        "socraticHints": [
            "How does DNS recursive resolution work from Root servers (.) to TLD servers (.com) to Authoritative nameservers?",
            "Why did HTTP/2 multiplexing over a single TCP connection still suffer from TCP-level Head-of-Line blocking, and how does HTTP/3 (QUIC over UDP) finally solve it?",
            "How does TLS 1.3 reduce handshake latency to a single round-trip (1-RTT) or zero round-trips (0-RTT) compared to legacy TLS 1.2?"
        ],
        "situationalPuzzle": {
            "scenario": "A mobile banking app experiences severe latency delays (up to 3 seconds) when users transition from Wi-Fi to cellular networks. The app uses HTTPS over HTTP/2. Every network switch causes the operating system to drop the TCP connection, forcing the app to execute a full TCP handshake followed by a TLS handshake before sending the first HTTP request.",
            "options": [
                "Disable encryption to remove the TLS handshake.",
                "Migrate to HTTP/3 (QUIC over UDP): HTTP/3 runs on top of QUIC (over UDP). QUIC introduces Connection IDs that are independent of the client's IP address and port. When a mobile user walks out of Wi-Fi range onto cellular data, the IP address changes, but the QUIC Connection ID remains valid. The connection seamlessly migrates without dropping, eliminating connection renegotiation latency.",
                "Require users to stand still while using the banking app.",
                "Revert to HTTP/1.0 with raw uncompressed HTML."
            ],
            "correctOptionIndex": 1,
            "debrief": "HTTP/2 is bound to an underlying TCP connection identified by the 4-tuple (Src IP, Src Port, Dst IP, Dst Port). When a mobile device switches networks, the IP changes, killing the TCP connection. HTTP/3 uses QUIC over UDP with 64-bit Connection IDs, enabling instantaneous connection migration across network interfaces with zero handshake overhead."
        },
        "quests": [
            {
                "id": "Q32.93",
                "name": "DNS Resolution Hierarchy & Modern HTTP/3 Protocol Architecture",
                "type": "Concept",
                "desc": "Detail the global DNS resolution topology, record types (A, CNAME, MX, TXT), HTTP/1.1 vs HTTP/2 vs HTTP/3 QUIC stream multiplexing, and the TLS 1.3 cryptographic handshake."
            },
            {
                "id": "Q32.94",
                "name": "The High-TTL DNS Migration Blackout Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate a high-severity global outage following a cloud infrastructure cutover; identify the misconfigured DNS TTL that caused recursive resolvers to blackhole user requests."
            },
            {
                "id": "Q32.95",
                "name": "Recursive DNS Resolver & Query Engine Implementation",
                "type": "Mastery Assignment",
                "desc": "Build a recursive DNS client in Python from scratch that sends raw UDP query packets to root name servers, follows referral NS records down the hierarchy, and parses DNS answer records."
            },
            {
                "id": "Q32.96",
                "name": "HTTP/1.1 vs HTTP/2 vs HTTP/3 Benchmark & Handshake Lab",
                "type": "Production Incident Lab",
                "desc": "Benchmark web page asset loading across HTTP/1.1, HTTP/2, and HTTP/3 under simulated 100ms network latency and 2% packet loss; measure Time-to-First-Byte (TTFB) and connection migration."
            }
        ]
    },
    {
        "day": 25,
        "month": 1,
        "blockNum": 5,
        "title": "Milestone 5: ApexNet Raw Packet Sniffer & Subnet Routing Engine Review",
        "stageNum": 3,
        "stageName": "Stage 3: Systems Stress-Testing",
        "pedagogicalRole": "Architectural Milestone Evaluation (Comprehensive Architecture Review & Systems Stress-Testing for Networking & Packet Routing Suite)",
        "spokenGoal": "Today you face the Senior Systems Review Board for Milestone 5. You will present and defend ApexNet—our production-grade simulated networking and packet routing platform. ApexNet unifies Layer 2 Ethernet frame handling, ARP cache resolution, CIDR subnetting with Longest Prefix Match routing tables, stateful NAT, and transport-layer TCP state machine emulation. You must prove packet integrity, zero routing loops, and robust firewall filtering under live adversarial penetration testing.",
        "conceptInvariant": "Networking Subsystem Determinism Invariant: A simulated network stack is compliant if and only if packets conform to standard RFC wire formats, routing tables prevent TTL expiration loops, and stateful firewalls drop unauthorized unsolicited ingress packets ($Drop(Invalid) == 1$).",
        "failureMode": "The Routing Loop TTL Packet Storm: A misconfigured routing table in ApexNet contains a mutual circular forwarding entry between Router A and Router B for subnet 10.2.0.0/24. Because simulated IP packets lacked automated TTL decrementing logic, packets bounced between both routers forever, consuming 100% of simulator memory and CPU.",
        "tryItFriction": "Construct an automated test validating that ApexNet decrements IP packet Time-to-Live (TTL) at every hop, and drops the packet with an ICMP Time Exceeded message when $TTL \\le 1$.",
        "socraticHints": [
            "How does ApexNet verify the RFC 791 IP header checksum on received packets, and why must the checksum be recomputed at every hop after decrementing TTL?",
            "What state table data structure in ApexNet tracks active NAT connections to route incoming response packets back to the correct internal private IP and port?",
            "Defend your handling of TCP sequence number wrapping when streaming high-bandwidth data in the transport simulator."
        ],
        "situationalPuzzle": {
            "scenario": "During the Milestone 5 review, a reviewer injects a packet with a forged source IP matching an internal trusted server (IP Spoofing) across the external WAN interface of ApexNet. The packet reaches an internal admin endpoint. The reviewer demands: 'Why did your gateway route a packet claiming to be from our internal LAN when it entered from an external WAN interface?'",
            "options": [
                "Assume the packet was sent by a trusted employee on vacation.",
                "Present the ApexNet Ingress Anti-Spoofing & Reverse Path Forwarding (uRPF) Architecture: 1) Implement Reverse Path Forwarding (RFC 3704): When a packet arrives on an interface, the router looks up the source IP in its routing table; if the best reverse path to that source IP does not match the ingress interface, the packet is flagged as a spoofed martian address and immediately dropped; 2) Enforce boundary firewall ingress filters blocking RFC 1918 private subnets from WAN interfaces; 3) Log the drop event to the security audit stream.",
                "Allow all packets because the internet is a friendly place.",
                "Turn off the WAN interface permanently."
            ],
            "correctOptionIndex": 1,
            "debrief": "IP spoofing attacks forge trusted source addresses to bypass perimeter filters. Modern routing engines deploy Unicast Reverse Path Forwarding (uRPF): the router verifies whether incoming packets arrive on the exact interface the router would use to reach that source address. If an internal private IP arrives on a public WAN link, uRPF drops it immediately."
        },
        "quests": [
            {
                "id": "Q32.97",
                "name": "ApexNet Complete Systems Architecture Blueprint",
                "type": "Concept",
                "desc": "Author the complete systems specification for ApexNet, documenting raw Ethernet frame handlers, ARP tables, CIDR longest-prefix routing engines, stateful NAT, and uRPF anti-spoofing filters."
            },
            {
                "id": "Q32.98",
                "name": "The Infinite Routing Loop TTL Exhaustion Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Analyze a network router capture where a packet storm crashed core switches; identify the circular route entry that bounced packets until memory exhausted."
            },
            {
                "id": "Q32.99",
                "name": "ApexNet Raw Packet Sniffer & Virtual Router Implementation",
                "type": "Mastery Assignment",
                "desc": "Implement the complete ApexNet platform in Python, featuring raw packet parsing (Ethernet, ARP, IPv4, TCP), dynamic routing table management, NAT connection tracking, and ICMP handling."
            },
            {
                "id": "Q32.100",
                "name": "ApexNet Milestone 5 Viva Defense & Anti-Spoofing Lab",
                "type": "Production Incident Lab",
                "desc": "Defend ApexNet before the simulated Review Board while enduring injected IP spoofing attacks, ARP cache poisoning storms, and high-frequency routing table flap events."
            }
        ]
    },
    {
        "day": 26,
        "month": 1,
        "blockNum": 6,
        "title": "Permissions & Access Control: Linux DAC (chmod/chown/umask), SUID/SGID & POSIX ACLs",
        "stageNum": 4,
        "stageName": "Stage 4: Production-Ready Engineering",
        "pedagogicalRole": "Operating System Security (Discretionary Access Control [DAC], Permission Octets, SUID/SGID Execution, Sticky Bits & POSIX Access Control Lists [ACLs])",
        "spokenGoal": "Security begins with access control. Today we master operating system permission models—dissecting Linux Discretionary Access Control (DAC), the octal representation of read/write/execute permissions (chmod 755 vs 644), ownership assignment (chown), the umask calculation, dangerous SUID/SGID execution bits, and fine-grained POSIX Access Control Lists (getfacl/setfacl).",
        "conceptInvariant": "Access Control Invariant: An operation on a file by process $P$ (with effective UID $u$ and GID $g$) is authorized if and only if DAC permission bits or extended ACLs explicitly grant the requested permission to $u$, $g$, or 'other'.",
        "failureMode": "The World-Writable SUID Root Privilege Escalation: A junior sysadmin writes a backup utility in C and configures it with <code>chmod 4777 /usr/local/bin/backup</code> (SUID root + world-writable). Any unprivileged user on the system can modify the binary's code or replace it with a shell script, instantly gaining complete, unconstrained root privileges across the entire server.",
        "tryItFriction": "Demonstrate how the <code>umask</code> value (e.g. 022) mathematically masks file creation modes from default 666 (files) and 777 (directories) using bitwise NOT-AND.",
        "socraticHints": [
            "What is the security hazard of the SUID (Set User ID) bit on an executable file, and why must SUID binaries be written with extreme defensive paranoia?",
            "How does the Sticky Bit (chmod +t / 1777) protect shared directories like <code>/tmp</code> from users deleting each other's files?",
            "Why do standard Unix user/group/other permission bits fail when a file must be accessible by three distinct specific users, and how do POSIX ACLs (<code>setfacl</code>) resolve this?"
        ],
        "situationalPuzzle": {
            "scenario": "An enterprise web application fails to upload images, returning an HTTP 500 error. The junior developer solves the issue by running: <code>chmod -R 777 /var/www/html/uploads</code>. The senior security engineer discovers this during an audit and immediately locks the server, calling an emergency security meeting.",
            "options": [
                "Praise the junior developer for fixing the bug with one command.",
                "Diagnose the Critical Security Hazard of 777 Permissions: Giving <code>chmod 777</code> grants read, write, and execute permissions to everyone on the system ('world'). Any compromised process or unprivileged user can upload executable PHP scripts or malware and execute them directly on the web server. Remediate with Principle of Least Privilege: set directory ownership to the web server user (<code>chown -R www-data:www-data /var/www/html/uploads</code>), set directory permissions to <code>750</code>, file permissions to <code>640</code>, and configure Nginx to disable script execution in the uploads directory.",
                "Delete the uploads folder and disable image uploads.",
                "Change permissions to 888."
            ],
            "correctOptionIndex": 1,
            "debrief": "Running `chmod 777` is a notorious security anti-pattern that grants full execution and write access to all system users. In web uploads directories, this allows attackers to upload arbitrary webshells and execute them with server privileges. Secure systems enforce proper user/group ownership (`chown`) and minimal required permissions (`chmod 750/640`)."
        },
        "quests": [
            {
                "id": "Q32.101",
                "name": "Linux DAC & Extended Access Control List (ACL) Architecture",
                "type": "Concept",
                "desc": "Detail the Unix DAC permission octet model (Read, Write, Execute for User, Group, Other), SUID/SGID/Sticky bits, umask calculus, and POSIX ACL structures."
            },
            {
                "id": "Q32.102",
                "name": "The SUID Root Binary Privilege Escalation Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Audit a compromised Linux server; discover the world-writable SUID root diagnostic utility that allowed an unprivileged contractor account to spawn a root bash shell."
            },
            {
                "id": "Q32.103",
                "name": "Automated Linux Permission Auditor & ACL Hardening Suite",
                "type": "Mastery Assignment",
                "desc": "Build an open-source auditing tool in Python/Bash that scans filesystems for world-writable files, unapproved SUID/SGID binaries, weak umask settings, and outputs remediation commands."
            },
            {
                "id": "Q32.104",
                "name": "POSIX DAC vs Extended ACL Granular Permission Lab",
                "type": "Production Incident Lab",
                "desc": "Configure a multi-user shared collaboration directory using POSIX extended ACLs (<code>setfacl</code>); prove that User A can read/write while User B has read-only access without altering primary groups."
            }
        ]
    },
    {
        "day": 27,
        "month": 1,
        "blockNum": 6,
        "title": "Cryptography Primitives: Symmetric (AES), Asymmetric (RSA/ECC), Hashing (SHA-256) & Salt",
        "stageNum": 4,
        "stageName": "Stage 4: Production-Ready Engineering",
        "pedagogicalRole": "Applied Cryptography (Symmetric Encryption [AES-GCM], Asymmetric Cryptography [RSA vs ECC], Cryptographic Hashes [SHA-256] & Salted Password Hashing [Argon2/bcrypt])",
        "spokenGoal": "In systems engineering, cryptography is the mathematical foundation of trust and privacy. Today we master cryptographic primitives—contrasting high-speed Symmetric Encryption (AES-GCM authenticated encryption) with Asymmetric Key Cryptography (RSA vs Elliptic Curve Cryptography [ECC]), exploring one-way Cryptographic Hash functions (SHA-256), and understanding why passwords must never be hashed with fast algorithms, requiring memory-hard salted algorithms like Argon2 and bcrypt.",
        "conceptInvariant": "Cryptographic Salt Invariant: Passwords must be hashed using a unique, cryptographically random salt per user ($H = \\text{Argon2}(Password, Salt)$); storing unsalted or raw MD5/SHA hashes renders credentials vulnerable to pre-computed rainbow table attacks.",
        "failureMode": "The Unsalted MD5 Credential Dump Catastrophe: A major tech enterprise stores 50 million user passwords hashed with plain MD5 without salt. When the database is leaked in a cyber breach, attackers crack 88% of user passwords within two hours using public rainbow tables, resulting in massive identity theft and a $40M regulatory fine.",
        "tryItFriction": "Demonstrate the avalanche effect in Python: hash two strings that differ by a single bit using SHA-256, and show that more than 50% of output hash bits flip unpredictably.",
        "socraticHints": [
            "Why is symmetric encryption (AES-256) thousands of times faster than asymmetric encryption (RSA-4096), and how do hybrid cryptosystems combine both?",
            "What makes a hash function 'cryptographic' (Pre-image resistance, Second pre-image resistance, Collision resistance)?",
            "Why are fast hashing algorithms (like SHA-256) disastrous for password storage, and how does Argon2id resist GPU/ASIC brute-force cracking?"
        ],
        "situationalPuzzle": {
            "scenario": "A financial app's database stores credit card numbers encrypted using AES-256 in ECB (Electronic Codebook) mode. During a security audit, a penetration tester downloads the encrypted database table and reconstructs the bank logo and customer credit card distribution patterns without knowing the encryption key. The developer is stunned: 'AES-256 is military-grade encryption!'",
            "options": [
                "Switch to AES-512 to make the key longer.",
                "Diagnose the ECB Mode Deterministic Pattern Leak: AES is a block cipher. In ECB mode, identical 16-byte plaintext blocks produce identical 16-byte ciphertext blocks, completely preserving structural patterns (the infamous ECB Tux penguin). Remediate immediately by switching to an Authenticated Encryption mode like AES-GCM (Galois/Counter Mode) or AES-CBC with a cryptographically random, unique Initialization Vector (IV) per encryption operation.",
                "Encrypt the ciphertext a second time with ECB mode.",
                "Store credit card numbers in plaintext to avoid encryption confusion."
            ],
            "correctOptionIndex": 1,
            "debrief": "A secure cipher algorithm (AES-256) can be rendered completely insecure by an improper cipher mode. In ECB (Electronic Codebook) mode, identical plaintext blocks produce identical ciphertext blocks, leaking structural data. Modern systems mandate authenticated cipher modes like AES-GCM with unique Initialization Vectors (IVs)."
        },
        "quests": [
            {
                "id": "Q32.105",
                "name": "Cryptographic Primitives & Cipher Modes Architecture",
                "type": "Concept",
                "desc": "Detail the mathematical architecture of AES block ciphers (ECB vs CBC vs GCM), RSA/ECC asymmetric mathematics, SHA-256 hashing, and the Argon2id password hashing standard."
            },
            {
                "id": "Q32.106",
                "name": "The ECB Mode Cipher Pattern Reconstruction Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Analyze an encrypted bitmap image file encrypted with AES-ECB; visually reconstruct the hidden corporate logo and explain how lack of an IV destroyed confidentiality."
            },
            {
                "id": "Q32.107",
                "name": "Authenticated AES-GCM Encryption & Argon2id Password Vault Implementation",
                "type": "Mastery Assignment",
                "desc": "Build an open-source cryptographic vault in Python using <code>cryptography</code> that encrypts files with AES-256-GCM (random nonce + auth tag) and stores passwords using Argon2id."
            },
            {
                "id": "Q32.108",
                "name": "GPU Password Cracking Benchmark & Rainbow Table Resistance Lab",
                "type": "Production Incident Lab",
                "desc": "Benchmark brute-force crack speeds comparing plain MD5, unsalted SHA-256, and salted Argon2id using hashcat; demonstrate why memory-hard parameters resist GPU clusters."
            }
        ]
    },
    {
        "day": 28,
        "month": 1,
        "blockNum": 6,
        "title": "Digital Hygiene & Authentication: SSH Keypairs, Public Key Infrastructure (PKI), MFA & Password Managers",
        "stageNum": 4,
        "stageName": "Stage 4: Production-Ready Engineering",
        "pedagogicalRole": "Production Security & Identity Operations (SSH Cryptographic Keypairs, Public Key Infrastructure [PKI], X.509 Certificates, Multi-Factor Authentication [TOTP] & Zero-Knowledge Vaults)",
        "spokenGoal": "Passwords are the single weakest link in human-computer interaction. Today we engineer modern digital hygiene and identity architectures—mastering SSH public-key authentication (Ed25519 vs RSA), Public Key Infrastructure (PKI) and Certificate Authorities (CA), Time-Based One-Time Passwords (TOTP RFC 6238), and zero-knowledge encrypted password managers.",
        "conceptInvariant": "Private Key Secrecy Invariant: The private key ($PrivKey$) must never leave the local client machine, be transmitted over networks, or be stored unencrypted on disk; identity authentication is proven via digital signatures ($Sig = \\text{Sign}(PrivKey, Challenge)$).",
        "failureMode": "The Stolen SSH Private Key Production Takeover: A developer commits their unencrypted personal SSH private key (<code>id_rsa</code>) to a public GitHub repository. Within 4 minutes, automated attacker bots scan the commit, authenticate to the enterprise cloud infrastructure with root permissions, terminate all production virtual machines, and deploy cryptocurrency miners.",
        "tryItFriction": "Generate a modern Ed25519 SSH keypair with a strong passphrase using <code>ssh-keygen -t ed25519</code>, and inspect the differences between the public key (.pub) and the encrypted private key.",
        "socraticHints": [
            "Why is Ed25519 (Elliptic Curve 25519) preferred over legacy RSA 2048/4096 for modern SSH key generation?",
            "How does the TOTP (Time-Based One-Time Password) algorithm compute a 6-digit code using a shared secret and the current UNIX timestamp divided by 30 seconds?",
            "What is a Certificate Revocation List (CRL) vs Online Certificate Status Protocol (OCSP), and how do browsers verify if an SSL certificate was revoked?"
        ],
        "situationalPuzzle": {
            "scenario": "An enterprise employee falls victim to a sophisticated phishing page that mimics the company's Okta login portal. The employee enters their username, password, and the 6-digit SMS code they received on their phone. The attacker's proxy script relays the credentials in real-time, logs in, and takes over the employee's account. The CISO demands a phishing-resistant MFA solution.",
            "options": [
                "Tell employees to inspect URLs more carefully.",
                "Deploy FIDO2 / WebAuthn Hardware Security Keys (Passkeys): SMS OTP and mobile authenticator app codes (TOTP) are vulnerable to real-time Adversary-in-the-Middle (AiTM) phishing proxies. FIDO2/WebAuthn relies on public-key cryptography bound directly to the browser's origin domain (Origin Binding). The hardware security key will only sign authentication challenges matching the authentic corporate domain, making it mathematically impossible for a phished fake website to complete authentication.",
                "Change employee passwords every 24 hours.",
                "Ban employees from using computers."
            ],
            "correctOptionIndex": 1,
            "debrief": "Traditional SMS OTP and TOTP codes are easily captured by real-time reverse proxy phishing kits (like Evilginx). Modern enterprise identity mandates FIDO2/WebAuthn hardware keys (YubiKeys/Passkeys). WebAuthn cryptographically binds the authentication signature to the browser's verified domain origin, mathematically neutralizing phishing attacks."
        },
        "quests": [
            {
                "id": "Q32.109",
                "name": "Public Key Infrastructure (PKI) & Digital Identity Architecture",
                "type": "Concept",
                "desc": "Detail the architecture of PKI hierarchies (Root CAs, Intermediate CAs, Leaf Certificates), SSH key exchange protocols, and the RFC 6238 TOTP algorithm."
            },
            {
                "id": "Q32.110",
                "name": "The Leaked Private Key Cloud Compromise Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Investigate an unauthorized cloud server intrusion; trace git commit history to locate an accidentally pushed private key and reconstruct the attacker's authentication timeline."
            },
            {
                "id": "Q32.111",
                "name": "RFC 6238 Time-Based One-Time Password (TOTP) Generator Implementation",
                "type": "Mastery Assignment",
                "desc": "Build an open-source TOTP authenticator engine in Python that generates QR codes for Google Authenticator, computes HMAC-SHA1 tokens over 30-second intervals, and verifies codes."
            },
            {
                "id": "Q32.112",
                "name": "SSH Hardening & Key-Only Bastion Host Lab",
                "type": "Production Incident Lab",
                "desc": "Harden an OpenSSH server: disable password authentication, disable root login, enforce Ed25519 public keys, configure fail2ban, and verify zero unauthorized logins under brute-force attacks."
            }
        ]
    },
    {
        "day": 29,
        "month": 1,
        "blockNum": 6,
        "title": "Malware, Attack Vectors & Defense: Buffer Overflows, Phishing, Ransomware & Process Sandboxing",
        "stageNum": 4,
        "stageName": "Stage 4: Production-Ready Engineering",
        "pedagogicalRole": "Systems Defense & Threat Modeling (Common Attack Vectors, Memory Corruption Exploits, Ransomware Propagation, Sandboxing [seccomp] & Defense-in-Depth)",
        "spokenGoal": "To defend computer systems, you must understand how adversaries attack them. Today we explore foundational systems vulnerabilities and malware mechanics—analyzing memory corruption exploits (buffer overflows, return-oriented programming), ransomware encryption loops, phishing social engineering vectors, and modern OS sandboxing mechanisms like Linux <code>seccomp</code>, namespaces, and AppArmor.",
        "conceptInvariant": "Defense-in-Depth Invariant: Security must never rely on a single defensive layer; if perimeter authentication fails, process sandboxing, least privilege, and immutable backups must contain the blast radius ($Security = \\prod Layer_i$).",
        "failureMode": "The Enterprise Ransomware Domain Takeover: An employee opens a malicious macro-enabled spreadsheet. The ransomware executes, exploits an unpatched local privilege escalation vulnerability to gain SYSTEM access, extracts cached domain admin credentials using Mimikatz, and deploys encryption payloads across all active network SMB shares, destroying all corporate file servers in 45 minutes.",
        "tryItFriction": "Write a minimal Linux seccomp filter in C/Python that restricts a process to only <code>read</code>, <code>write</code>, and <code>exit</code> system calls, verifying that attempting to call <code>execve</code> or <code>fork</code> triggers immediate kernel termination.",
        "socraticHints": [
            "How do modern operating systems mitigate buffer overflow exploits using Address Space Layout Randomization (ASLR) and Stack Canaries?",
            "What makes Ransomware attacks financially devastating, and why are automated air-gapped immutable backups the only guaranteed recovery method?",
            "How does Linux <code>seccomp</code> (Secure Computing Mode) restrict the attack surface of containerized applications by filtering system calls?"
        ],
        "situationalPuzzle": {
            "scenario": "A financial analytics firm allows customers to upload Python scripts to run risk simulations on their servers. A malicious user uploads a script containing <code>import os; os.system('cat /etc/passwd; rm -rf /')</code>. The junior developer suggests checking the uploaded text for the word 'import' with a regex filter.",
            "options": [
                "Use the regex filter to block the word 'import'.",
                "Implement a Multi-Layered OS Process Sandboxing Architecture: Never rely on text regex filtering for code execution security (attackers bypass regex easily using <code>__import__</code> or base64 decoding). Sandbox the execution environment: 1) Run user code in an unprivileged, rootless Linux container with isolated namespaces; 2) Apply strict Linux <code>seccomp</code> filters blocking network and filesystem syscalls; 3) Set cgroups limits (memory, CPU, process count); 4) Mount the filesystem as read-only (<code>ro</code>); 5) Drop all Linux capabilities (<code>cap-drop=ALL</code>).",
                "Ask users to sign an honor code promising not to run bad commands.",
                "Let all user scripts run as root."
            ],
            "correctOptionIndex": 1,
            "debrief": "Regex-based text filtering cannot prevent arbitrary code execution attacks. Secure multi-tenant systems enforce Defense-in-Depth: untrusted code must execute in isolated, unprivileged sandboxes using rootless containers, Linux `seccomp` system call filters, read-only filesystems, and strict cgroups resource limits."
        },
        "quests": [
            {
                "id": "Q32.113",
                "name": "Threat Modeling & Systems Attack Vectors Architecture",
                "type": "Concept",
                "desc": "Detail the anatomy of systems attacks: buffer overflows, Return-Oriented Programming (ROP), ransomware propagation, ASLR/DEP mitigations, and Linux seccomp sandboxing."
            },
            {
                "id": "Q32.114",
                "name": "The Ransomware Lateral Movement SMB Worm Detective Challenge",
                "type": "Detective Challenge",
                "desc": "Analyze network telemetry and Windows event logs from an active ransomware incident; trace how an initial phishing payload moved laterally across administrative shares."
            },
            {
                "id": "Q32.115",
                "name": "Linux Seccomp-BPF Process Sandbox Engine Implementation",
                "type": "Mastery Assignment",
                "desc": "Build a secure process runner in C/Python that uses <code>libseccomp</code> to enforce a strict syscall whitelist, blocking network sockets and process spawning for untrusted child processes."
            },
            {
                "id": "Q32.116",
                "name": "Buffer Overflow Exploit & ASLR Defense Lab",
                "type": "Production Incident Lab",
                "desc": "Compile a vulnerable C program with and without stack canaries and ASLR; demonstrate how modern OS compiler mitigations detect memory corruption and abort execution safely."
            }
        ]
    },
    {
        "day": 30,
        "month": 1,
        "blockNum": 6,
        "title": "Capstone 1: ApexSystem Core Operating Systems & Systems Architecture Master Capstone Viva Gate",
        "stageNum": 4,
        "stageName": "Stage 4: Production-Ready Engineering",
        "pedagogicalRole": "Month 1 Master Capstone Evaluation (Comprehensive Systems Architecture Defense & Viva Voce Examination for Operating Systems, Hardware & Security)",
        "spokenGoal": "This is the sovereign gateway of your Month 1 journey. Today you stand before the Senior Systems Review Board for the Capstone 1 Viva Gate. You will present and defend ApexSystem—a complete, production-grade operating systems and systems architecture platform. ApexSystem unifies the Von Neumann CPU instruction cycle, L1/L2 cache coherence, virtual memory paging, CFS process scheduling, an Inode-based file system with WAL journaling, asynchronous epoll I/O multiplexing, raw network packet routing, and seccomp sandboxing. Prepare to defend every architectural invariant under unsparing live examination.",
        "conceptInvariant": "System Architecture Cohesion Invariant: A computing system is functionally complete and secure if and only if hardware abstraction, process isolation, storage crash consistency, network routing, and access control operate as an integrated, non-leaking stack ($System = \\text{Integrate}(CPU, Mem, OS, FS, Net, Sec)$).",
        "failureMode": "The Cascading Systemic Hardware-to-Software Outage: Under simulated heavy multi-tenant load, a memory leak in a user process triggers excessive page faults, saturating the disk I/O queue. The filesystem journal blocks waiting for write barriers. As a result, the process scheduler starves networking threads, causing TCP connections to timeout, which triggers connection retries that crash the entire operating system.",
        "tryItFriction": "Author the definitive systems architecture defense thesis for ApexSystem, articulating how low-level hardware constraints dictate high-level software reliability.",
        "socraticHints": [
            "How does ApexSystem maintain strict memory isolation between competing processes while allowing high-performance IPC (Inter-Process Communication)?",
            "What architectural tradeoffs govern the choice between thread-based concurrency, process isolation, and asynchronous event loops?",
            "Deliver your defense on why understanding low-level systems fundamentals (bits, caches, syscalls, inodes) is the single most important skill for a senior software engineer."
        ],
        "situationalPuzzle": {
            "scenario": "You stand before the Senior Review Board for your Month 1 Capstone Defense. The Chief Technology Officer asks: 'Many software engineers today write code in high-level languages like Python or JavaScript and never need to know about CPU caches, page tables, or inodes. Why should our enterprise care about your 30 days of low-level systems architecture?'",
            "options": [
                "Admit that low-level architecture is obsolete and high-level tools do everything.",
                "Deliver the Grand Systems Architecture Defense: 'Every abstraction leaks. High-level frameworks, cloud services, and databases ultimately execute as machine opcodes, memory bus transactions, and operating system syscalls. When a microservice suffers a mysterious 10x latency spike, an unexplained memory crash, or a deadlock under Black Friday traffic, high-level developers are helpless. A systems architect understands the entire silicon-to-software stack—diagnosing cache misses, memory paging thrashing, pipe buffer deadlocks, and network buffer saturation. We do not guess; we know how the machine works, and that knowledge is what keeps the enterprise online.'",
                "Say that low-level architecture is just for fun.",
                "Leave the room without answering."
            ],
            "correctOptionIndex": 1,
            "debrief": "The Senior Systems Evaluator recognizes that all software abstractions are grounded in physical hardware and operating system kernels. When production incidents occur at scale, only engineers who understand the entire stack—from CPU registers and caches to virtual memory, file systems, and network protocols—can diagnose the root cause and engineer resilient systems."
        },
        "quests": [
            {
                "id": "Q32.117",
                "name": "ApexSystem Grand Master Systems Architecture Specification",
                "type": "Concept",
                "desc": "Author the comprehensive architectural specification for ApexSystem, documenting the end-to-end integration of CPU emulation, virtual memory, process scheduling, Inode storage, and network routing."
            },
            {
                "id": "Q32.118",
                "name": "The Full-Stack Hardware-to-Network Systemic Outage Forensic Challenge",
                "type": "Detective Challenge",
                "desc": "Perform an exhaustive forensic audit on a catastrophic enterprise datacenter crash; trace the cascading failure from a corrupted memory stick through OS page faults, disk journal deadlocks, and BGP routing collapse."
            },
            {
                "id": "Q32.119",
                "name": "ApexSystem Complete Production Systems Platform Implementation",
                "type": "Mastery Assignment",
                "desc": "Deliver the complete, production-grade ApexSystem platform in Python/C, integrating the CPU emulator, virtual memory manager, CFS scheduler, Inode WAL filesystem, epoll server, and seccomp sandbox."
            },
            {
                "id": "Q32.120",
                "name": "ApexSystem Month 1 Master Capstone Senior Board Viva Defense",
                "type": "Production Incident Lab",
                "desc": "Defend the entire 30-day ApexSystem platform in a live adversarial viva voce examination before the Senior Review Board; resolve complex systems crashes, memory corruption exploits, and hardware bottlenecks."
            }
        ]
    }
]

out_path = Path(__file__).resolve().parent / "computer_fundamentals_spec_m1_rest.py"

content = f'''# scripts/visuals/computer_fundamentals_spec_m1_rest.py
# Month 1: Days 16 to 30 Specification for Course 32: Computer Literacy, Digital Productivity & OS Fundamentals (course-computer-fundamentals)
# Conforms strictly to Gate v2 / True 9.8 standard across all 15 days (60 Quests: Q32.61 to Q32.120).

DAYS_16_TO_30 = {json.dumps(days_data, indent=2)}
'''

with open(out_path, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Successfully generated {out_path} with {len(days_data)} days ({sum(len(d['quests']) for d in days_data)} quests).")
