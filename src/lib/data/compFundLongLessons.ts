import type { LongLesson } from './longLessons';

export const COMP_FUND_LONG_LESSONS: LongLesson[] = [
  {
    day: 1,
    title: 'POSIX File System Navigation, Pipelines & File Streams',
    goal: 'Master the POSIX file tree hierarchy, absolute and relative paths, standard file streams, and multi-command pipelines in the Linux shell.',
    minutes: 30,
    recap: 'Welcome to Computer Literacy & Systems Architecture. Today you interact directly with the operating system kernel through the POSIX command shell.',
    parts: [
      {
        title: 'The Hierarchical Single-Root File Tree',
        say: [
          'In UNIX and POSIX operating systems, everything descends from a single root directory represented by a forward slash.',
          'Unlike Windows which splits storage across drive letters like C and D, POSIX mounts every physical disk and virtual stream into one unified hierarchy.',
          'When your shell session begins, the kernel assigns you a current working directory.',
          'The command pwd stands for print working directory and outputs the absolute path of your current location.',
          'An absolute path always begins with a forward slash and specifies the complete path from the root.',
          'A relative path begins without a leading slash and resolves relative to where you are standing right now.'
        ],
        example: 'Think of an absolute path as a full GPS postal address with country and postal code, while a relative path is saying walk two doors down the hall.',
        code: `pwd
mkdir -p workspace/project
cd workspace/project
pwd
cd ../..
pwd`,
        output: `/home/user\n/home/user/workspace/project\n/home/user`,
        codeNotes: [
          { line: 1, note: 'Prints initial working directory' },
          { line: 2, note: 'Creates nested subdirectories idempotently' },
          { line: 5, note: 'Traverses back two directories up the tree' }
        ],
        tryIt: 'Add a command to create a config directory inside workspace/project.',
        check: {
          question: 'What distinguishes an absolute path from a relative path in POSIX systems?',
          options: [
            'An absolute path begins at the root directory with a forward slash',
            'An absolute path only works for hidden files',
            'A relative path can only refer to the home directory'
          ],
          answer: 0,
          why: 'Absolute paths originate at the system root / and provide an unambiguous location regardless of the current working directory.'
        }
      },
      {
        title: 'File Inspection with ls and Flags',
        say: [
          'Listing directory contents is performed with the ls utility.',
          'Running ls without arguments displays the visible files in your current working directory.',
          'Adding flags alters command behavior: the minus l flag produces a long listing showing file permissions, owner, size, and timestamp.',
          'The minus a flag reveals hidden files, which in UNIX convention begin with a dot.',
          'Flags can be combined: running ls minus l a gives the complete view of all directory contents.',
          'Understanding metadata permissions is fundamental before modifying files or executing binaries.'
        ],
        example: 'Looking into a closed box shows what is inside, but reading the shipping label shows who packed it, when it arrived, and who is allowed to open it.',
        code: `mkdir -p workspace
touch workspace/app.js
touch workspace/.env
ls workspace
ls -a workspace`,
        output: `app.js\n.  ..  .env  app.js`,
        codeNotes: [
          { line: 3, note: 'Creates a hidden configuration file starting with a dot' },
          { line: 5, note: 'Flags -a instructs ls to include hidden dotfiles' }
        ],
        tryIt: 'Add another file named README.md and verify it appears in the regular ls listing.',
        check: {
          question: 'In UNIX file conventions, why does a configuration file like .env not appear in basic ls output?',
          options: [
            'Files starting with a dot are designated as hidden files by convention',
            'The file has been encrypted by the kernel',
            'The file size is zero bytes'
          ],
          answer: 0,
          why: 'UNIX tools omit filenames starting with a dot unless explicitly requested with the -a or --all flag.'
        }
      },
      {
        title: 'File Content Generation & Standard Streams (stdout & stderr)',
        say: [
          'In UNIX architecture, programs communicate through three standard streams: standard input, standard output, and standard error.',
          'Standard output, file descriptor 1, carries normal program results.',
          'The echo utility prints its arguments directly to standard output.',
          'We can redirect standard output into a file using the greater-than operator.',
          'A single greater-than operator overwrites the target file completely.',
          'A double greater-than operator appends data to the end of the file without destroying existing contents.',
          'The cat utility, short for concatenate, reads files and prints their raw contents to standard output.'
        ],
        example: 'Writing on a fresh page of a notebook replaces what was there, while adding a line at the bottom keeps all previous notes intact.',
        code: `echo "DATABASE_PORT=5432" > app.env
echo "CACHE_PORT=6379" >> app.env
cat app.env`,
        output: `DATABASE_PORT=5432\nCACHE_PORT=6379`,
        codeNotes: [
          { line: 1, note: 'Overwrites app.env with the first configuration variable' },
          { line: 2, note: 'Appends second configuration variable to app.env' },
          { line: 3, note: 'Concatenates and displays file contents on stdout' }
        ],
        tryIt: 'Append a third line with LOG_LEVEL=debug and run cat to verify.',
        check: {
          question: 'What happens if you use > instead of >> when writing to an existing configuration file?',
          options: [
            'The existing file content is completely overwritten with the new output',
            'The shell throws a permission denied error',
            'The content is automatically merged at the top of the file'
          ],
          answer: 0,
          why: 'The single redirection operator > truncates the destination file before writing, whereas >> appends to the end.'
        }
      },
      {
        title: 'UNIX Philosophy & Composable Pipelines with grep and wc',
        say: [
          'The core UNIX philosophy states: Write programs that do one thing well, and write programs that work together.',
          'The pipe operator, represented by a vertical bar, connects the standard output of one command directly to the standard input of the next.',
          'The grep utility searches text for lines that match a regular expression or keyword.',
          'The wc utility counts lines, words, and bytes in input streams.',
          'Passing the minus l flag to wc counts specifically the number of newline characters.',
          'By combining cat, grep, and wc with pipes, complex data analysis queries can be answered without writing custom scripts.'
        ],
        example: 'An assembly line where worker one unpacks items, worker two discards defective units, and worker three counts the approved boxes.',
        code: `echo "INFO user login" > service.log
echo "ERROR database connection timeout" >> service.log
echo "INFO cache hit" >> service.log
echo "ERROR payment gateway 502" >> service.log
grep "ERROR" service.log
grep "ERROR" service.log | wc -l`,
        output: `ERROR database connection timeout\nERROR payment gateway 502\n2`,
        codeNotes: [
          { line: 5, note: 'Filters service.log to only print lines containing ERROR' },
          { line: 6, note: 'Streams filtered error lines into wc -l to count total errors' }
        ],
        tryIt: 'Pipe grep "INFO" into wc -l to count the number of info log lines.',
        check: {
          question: 'What is the purpose of the pipe | operator in a POSIX command line?',
          options: [
            'It routes stdout of the preceding command into stdin of the following command',
            'It pauses execution of the shell for one second',
            'It runs both commands in parallel on separate CPU cores'
          ],
          answer: 0,
          why: 'The pipe operator constructs an inter-process communication stream connecting stdout of the left command to stdin of the right command.'
        }
      },
      {
        title: 'Data Sorting, Deduplication & Pipeline Synthesis',
        say: [
          'Production log analysis frequently demands sorting and unique count aggregations.',
          'The sort utility reorders text lines alphabetically or numerically.',
          'The uniq utility filters out adjacent duplicate lines from an input stream.',
          'Because uniq only removes consecutive duplicates, piping into sort before uniq is standard practice.',
          'Adding the minus c flag to uniq prefixes each line with its frequency count.',
          'Combining sort and uniq delivers instant telemetry metrics directly from production logs.'
        ],
        example: 'Sorting a shuffled deck of cards by suit and rank makes it trivial to spot and count how many cards of each suit exist.',
        code: `echo "GET /api/v1/auth" > access.log
echo "GET /api/v1/data" >> access.log
echo "GET /api/v1/auth" >> access.log
echo "GET /api/v1/metrics" >> access.log
echo "GET /api/v1/auth" >> access.log
sort access.log | uniq -c`,
        output: `3 GET /api/v1/auth\n1 GET /api/v1/data\n1 GET /api/v1/metrics`,
        codeNotes: [
          { line: 6, note: 'Sorts access log so duplicate endpoints are contiguous, then counts occurrences' }
        ],
        tryIt: 'Add another request to /api/v1/data and see the count change from 1 to 2.',
        check: {
          question: 'Why must input text usually be passed through sort before running uniq?',
          options: [
            'Because uniq only collapses adjacent identical lines',
            'Because sort decrypts binary log files',
            'Because uniq requires sorted ASCII headers to compile'
          ],
          answer: 0,
          why: 'The uniq utility operates on an in-memory streaming window and only detects duplicates if they appear consecutively.'
        }
      }
    ],
    summary: [
      'The POSIX file tree originates from root / and resolves paths relatively or absolutely.',
      'Hidden files start with a dot and require the -a flag to display in ls.',
      'Redirection with > overwrites files, while >> appends to existing content.',
      'Pipelines | chain small utilities together according to the UNIX philosophy.',
      'Combining sort, uniq, and grep enables rapid log analysis and production metrics extraction.'
    ],
    projectStep: {
      title: 'Automated Log Analyzer Script',
      steps: [
        'Initialize workspace directory with mkdir -p workspace/logs',
        'Populate production traffic logs into workspace/logs/api.log',
        'Construct a shell pipeline to count error codes and write telemetry to report.txt'
      ]
    }
  },
  {
    coursePrefix: 'comp_fund',
    day: 2,
    title: 'POSIX Permissions, Stream Slicing & Shell Automation Pipelines',
    goal: 'Master advanced POSIX systems administration: octal and symbolic file permissions with ls -l metadata inspection, stream pagination with head, case-insensitive log triage via grep and sort, line volume metrics via wc, and conditional && build chaining.',
    minutes: 35,
    recap: 'In Day 1, we mastered the POSIX single-root file tree, directory traversal, stream redirection, and fundamental pipelines. Now, we dive into security metadata permissions, stream pagination, case-insensitive log triage, metric counting, and production pipeline chaining.',
    parts: [
      {
        title: 'POSIX File Permissions & Long Listing Metadata Inspection',
        say: [
          'In multi-user POSIX operating systems, every file and directory is protected by a granular permissions matrix.',
          'When you inspect a file using ls with the minus l flag, the leftmost ten characters represent its file mode and permission attributes.',
          'The first character specifies the file type: a hyphen indicates a standard regular file, while the letter d denotes a directory.',
          'The remaining nine characters are grouped into three distinct triads: User permissions, Group permissions, and Other (world) permissions.',
          'Within each triad, the characters r, w, and x represent Read permission (numeric weight 4), Write permission (numeric weight 2), and Execute permission (numeric weight 1).',
          'For example, the mode -rw-r--r-- grants the owner both read and write access (4 plus 2 equals 6), while fellow group members and public users are granted read-only access (4).',
          'Understanding these metadata flags is crucial in server security: accidentally leaving sensitive credentials with world-writable permissions invites security vulnerabilities.'
        ],
        example: 'Think of an office filing cabinet. The department manager holds the master key to read and edit financial records (rw- owner permissions). Teammates can view summary reports through a locked glass display (r-- group permissions), while office visitors have zero access to private files (--- world permissions).',
        code: `mkdir -p secure_vault
touch secure_vault/keys.pem
touch secure_vault/public.txt
ls -l secure_vault`,
        output: `-rw-r--r--  1  student  staff       0  Oct 12 12:00  keys.pem\n-rw-r--r--  1  student  staff       0  Oct 12 12:00  public.txt`,
        codeNotes: [
          { line: 1, note: 'Creates secure_vault directory idempotently' },
          { line: 2, note: 'Creates empty cryptographic key placeholder' },
          { line: 4, note: 'Inspects long-listing permission modes, owner, and file size metadata' }
        ],
        tryIt: 'Add another file named private.key and run ls -l to inspect its permissions.',
        check: {
          question: 'In the POSIX permission string -rw-r--r--, what permissions are granted to the file owner?',
          options: [
            'Read and Write access (octal mode 6)',
            'Execute only',
            'Full control including execute permissions'
          ],
          answer: 0,
          why: 'The first triad rw- corresponds to Read (4) and Write (2), giving the file owner read-write access without execute privileges.'
        }
      },
      {
        title: 'Stream Truncation & Paging with head and Line Windows',
        say: [
          'In production server environments, log files frequently grow to millions of lines and gigabytes in size.',
          'Opening a massive 10GB file with a standard text editor like nano or cat consumes excessive memory and can crash terminal sessions.',
          'The POSIX head utility solves this by streaming only the first few lines of a file or input stream, terminating as soon as the requested window is satisfied.',
          'By default, head outputs the first 10 lines of the file.',
          'Adding the minus n flag followed by an integer specifies exactly how many lines to extract from the top of the stream.',
          'Using head allows systems engineers to inspect configuration headers, verify CSV column schemas, or read API responses without loading entire datasets into memory.'
        ],
        example: 'Think of previewing the first two paragraphs of a 500-page book in a bookstore to decide if you want to read it, rather than carrying the entire encyclopedia to the checkout counter.',
        code: `echo "PAGE 1: Authentication Gateway" > endpoints.txt
echo "PAGE 2: Customer Dashboard" >> endpoints.txt
echo "PAGE 3: Payment Checkout" >> endpoints.txt
echo "PAGE 4: Settings & Profile" >> endpoints.txt
head -n 2 endpoints.txt`,
        output: `PAGE 1: Authentication Gateway\nPAGE 2: Customer Dashboard`,
        codeNotes: [
          { line: 1, note: 'Initializes endpoints text file with first API route' },
          { line: 5, note: 'Extracts only the top 2 lines of endpoints.txt without reading the remainder' }
        ],
        tryIt: 'Change the flag to head -n 3 to extract the first three endpoint routes.',
        check: {
          question: 'Why do systems administrators use the head utility instead of cat when inspecting high-volume production files?',
          options: [
            'head streams only the requested top lines without buffering the entire multi-gigabyte file into memory',
            'head automatically translates binary files into Python code',
            'head permanently deletes the remaining lines of the file'
          ],
          answer: 0,
          why: 'head truncates the stream after the specified line count, providing instant feedback while consuming negligible memory regardless of how large the underlying file is.'
        }
      },
      {
        title: 'Case-Insensitive Pattern Matching & Deduplication with grep and sort',
        say: [
          'Production log streams often contain inconsistent formatting: one microservice might log ERROR in uppercase, while another logs error in lowercase.',
          'Standard grep pattern searches are case-sensitive by default, which can cause critical failure entries to be silently missed during incident triage.',
          'Passing the minus i flag to grep enables Case-Insensitive matching, capturing all variations such as Error, ERROR, and error in a single unified filter pass.',
          'When triaging repeated failures, passing the filtered output through sort organizes identical error messages contiguously.',
          'Piping the sorted stream into uniq collapses consecutive duplicate lines into single distinct entries.',
          'This composable pipeline extracts clean, deduplicated failure signatures directly from raw unstructured logs in seconds.'
        ],
        example: 'Think of collecting business cards from a conference bowl. Some cards say "manager" in small print and others say "MANAGER" in bold capital letters. Passing them through a case-insensitive sorter groups all manager titles together and removes duplicates so you have a single distinct contact list.',
        code: `echo "ERROR database timeout" > events.log
echo "INFO cache hit" >> events.log
echo "error database timeout" >> events.log
echo "WARN high memory" >> events.log
echo "ERROR database timeout" >> events.log
grep -i "database" events.log | sort | uniq`,
        output: `ERROR database timeout\nerror database timeout`,
        codeNotes: [
          { line: 1, note: 'Simulates mixed-case log events' },
          { line: 6, note: 'Filters on database case-insensitively, sorts alphabetically, and deduplicates identical entries' }
        ],
        tryIt: 'Add another INFO line and verify that it is excluded by the database filter.',
        check: {
          question: 'What does the -i flag instruct the grep utility to do during text pattern matching?',
          options: [
            'Perform a case-insensitive search, matching both uppercase and lowercase variations of the pattern',
            'Invert the search to only print lines that do not match the pattern',
            'Install the software package over the internet'
          ],
          answer: 0,
          why: 'The -i flag makes grep case-insensitive, ensuring that patterns like "database" match "Database", "DATABASE", and "database" alike.'
        }
      },
      {
        title: 'Metric Aggregation & Line Volume Counting with wc -l',
        say: [
          'In infrastructure monitoring and continuous integration, engineers frequently need to quantify event volumes rather than reading raw text.',
          'The word count utility wc counts lines, words, and byte volumes across input streams.',
          'Adding the minus l flag instructs wc to count newline boundaries, giving the exact total line count of the file or stream.',
          'When combined with grep via a pipe, wc -l functions as a lightweight real-time stream aggregation engine.',
          'For example, piping grep "ACTIVE" nodes.txt into wc -l immediately calculates the total number of healthy server instances without writing custom code.',
          'This capability forms the backbone of infrastructure health check scripts and autoscaling monitors.'
        ],
        example: 'Think of an automated turnstile at a subway station. Instead of having a security officer write down every commuter name, the mechanical clicker increments a counter every time someone walks through, displaying the total passenger count on a digital board.',
        code: `echo "cluster-node-01 US-EAST ACTIVE" > nodes.txt
echo "cluster-node-02 US-WEST ACTIVE" >> nodes.txt
echo "cluster-node-03 EU-CENTRAL ACTIVE" >> nodes.txt
echo "cluster-node-04 AP-SOUTH DRAIN" >> nodes.txt
wc -l nodes.txt
grep "ACTIVE" nodes.txt | wc -l`,
        output: `4\n3`,
        codeNotes: [
          { line: 1, note: 'Registers 4 cluster node telemetry records' },
          { line: 5, note: 'Counts total lines in the nodes manifest (4)' },
          { line: 6, note: 'Filters active nodes and pipes to wc -l to compute healthy node count (3)' }
        ],
        tryIt: 'Count how many nodes are in DRAIN status by piping grep "DRAIN" into wc -l.',
        check: {
          question: 'What is the purpose of piping the output of grep into wc -l?',
          options: [
            'To count the exact number of lines that matched the search filter',
            'To sort the log file in descending order',
            'To convert the text output into HTML format'
          ],
          answer: 0,
          why: 'grep streams only the lines that match the search criteria, and wc -l counts how many lines arrive over the pipe, delivering the total match count.'
        }
      },
      {
        title: 'Conditional Chained Pipelines & Atomic Execution with &&',
        say: [
          'In shell scripting and automation pipelines, executing commands sequentially using standard semicolons can be dangerous if an early step fails.',
          'For example, if you run mkdir dist; cd dist; rm -rf * and the mkdir command fails due to permission errors, the script might execute rm -rf * in your home directory!',
          'To ensure safety, POSIX shells provide conditional execution using the logical AND operator &&.',
          'Every POSIX utility returns an Exit Status code between 0 and 255 upon termination. By convention, an exit code of 0 signifies success, while any non-zero code denotes failure.',
          'When commands are chained with &&, the shell evaluates the next command ONLY IF the preceding command exited with status 0.',
          'If any command in the && chain fails, execution immediately halts, preventing cascading data corruption and ensuring atomic deployment pipelines.'
        ],
        example: 'Think of an electric circuit with three safety switches wired in series. Power only flows to the laser cutter if Switch 1 (protective cover closed) AND Switch 2 (coolant flowing) AND Switch 3 (key turned) are all active. If any single switch is open, the machine refuses to turn on.',
        code: `mkdir -p dist && touch dist/bundle.js && echo "Build Success"
ls dist
cat dist/bundle.js`,
        output: `Build Success\nbundle.js`,
        codeNotes: [
          { line: 1, note: 'Safely creates directory, creates bundle asset, and prints confirmation only if all steps succeed' },
          { line: 2, note: 'Verifies bundle artifact exists in target directory' }
        ],
        tryIt: 'Add an echo "Artifact verified" step chained to the end with &&.',
        check: {
          question: 'How does chaining commands with && differ from separating them with a semicolon ; in a shell script?',
          options: [
            'With &&, subsequent commands execute ONLY if the preceding command succeeded with exit status 0',
            'With &&, all commands run simultaneously in background processes',
            'With ;, subsequent commands are automatically encrypted'
          ],
          answer: 0,
          why: 'The && operator enforces conditional short-circuit execution: if any command fails (non-zero exit code), the remainder of the chain is aborted, whereas semicolons execute unconditionally regardless of failure.'
        }
      }
    ],
    summary: [
      'POSIX file permissions define User, Group, and Other access matrices with numeric weights for Read (4), Write (2), and Execute (1).',
      'The head utility streams only the top lines of large files, preventing memory exhaustion when inspecting high-volume logs.',
      'Passing -i to grep enables case-insensitive pattern matching, and piping into sort | uniq extracts clean failure signatures.',
      'Piping grep into wc -l quantifies matching line volumes for infrastructure health monitoring and deployment metrics.',
      'The && operator guarantees safe atomic pipelines by halting execution immediately if any preceding command returns a non-zero exit code.'
    ],
    projectStep: {
      title: 'Build a POSIX Server Health Audit & Log Triage Script',
      steps: [
        'Inspect file permissions of sensitive credential vaults using ls -l.',
        'Extract the top 5 records of an access log using head -n.',
        'Construct a pipeline using grep -i, sort, and uniq to isolate unique error messages.',
        'Calculate total healthy cluster node capacity using a piped wc -l metric counter.',
        'Chain automated artifact creation and deployment verification safely using &&.'
      ]
    }
  },
  {
    day: 3,
    title: 'Linux Process Lifecycle, POSIX Signals, Virtual Memory Paging & CFS Scheduling',
    goal: 'Master low-level Linux operating system internals: process lifecycle trees (PID, PPID, Fork/Exec, Zombies), asynchronous POSIX signals (graceful SIGTERM vs uncatchable SIGKILL), virtual memory address translation (VPN to PFN, Page Tables, TLBs, and Page Faults), kernel process scheduling (CFS red-black trees and vruntime), and file descriptor tables with inode architectures.',
    minutes: 40,
    recap: 'In Day 2, we mastered POSIX permissions, metadata inspection with ls -l, stream truncation with head, case-insensitive log filtering with grep -i, and safe conditional chaining with &&. Now, in Day 3, we dive directly into Linux operating system internals: process lifecycle trees, graceful versus uncatchable signals, virtual memory page tables, the completely fair scheduler, and file descriptors.',
    parts: [
      {
        title: 'Linux Process Lifecycle: PID, PPID, Fork-Exec & Zombie States',
        say: [
          'Every running program in a Linux operating system is managed by the kernel as a process with a unique Process Identifier (PID) and a Parent Process Identifier (PPID). Process 1, typically systemd or init, is the direct ancestor of all user-space processes.',
          'New processes are spawned using the classic two-step POSIX system call sequence: fork() duplicates the calling process into an exact copy child, and execve() replaces the child address space with a new executable binary.',
          'When a child process finishes execution, it sends a SIGCHLD signal to its parent and enters the ZOMBIE state. In the zombie state, its memory is freed, but its PID and exit status remain in the kernel process table until the parent invokes wait() or waitpid() to reap it.',
          'If the parent process terminates without reaping its children, the children become orphans and are adopted by PID 1 (init/systemd), which immediately reaps them to prevent process table exhaustion.',
          'Understanding process lifecycle states (RUNNING, SLEEPING, STOPPED, ZOMBIE) is essential for diagnosing server deadlocks, zombie process leaks, and microservice container crashes in production.'
        ],
        example: 'Think of a corporate work order. A manager signs a purchase order (fork) and dispatches a courier (execve). When the courier returns with the receipt, the manager must file the receipt (wait/reap); if the manager leaves the building without filing, the receipt clutters the desk (zombie) until the archive administrator (PID 1) files it.',
        code: `echo "PID  PPID STATE   COMMAND" > proc_table.txt
echo "1    0    SLEEP   systemd" >> proc_table.txt
echo "101  1    SLEEP   sshd" >> proc_table.txt
echo "1024 101  RUNNING node" >> proc_table.txt
echo "1025 1024 ZOMBIE  worker-child" >> proc_table.txt
cat proc_table.txt
grep "RUNNING" proc_table.txt
grep "ZOMBIE" proc_table.txt`,
        output: `PID  PPID STATE   COMMAND\n1    0    SLEEP   systemd\n101  1    SLEEP   sshd\n1024 101  RUNNING node\n1025 1024 ZOMBIE  worker-child\n1024 101  RUNNING node\n1025 1024 ZOMBIE  worker-child`,
        codeNotes: [
          { line: 1, note: 'Creates process table manifest with headers' },
          { line: 4, note: 'Registers parent node worker in RUNNING state' },
          { line: 5, note: 'Registers unreaped child in ZOMBIE state pending parent wait()' },
          { line: 7, note: 'Filters active running processes' },
          { line: 8, note: 'Isolates zombie processes requiring cleanup' }
        ],
        tryIt: 'Add a new process row with state SLEEP and filter for all SLEEP processes using grep.',
        check: {
          question: 'What is a "zombie process" in a Linux operating system?',
          options: [
            'A process that has completed execution but remains in the process table because its parent has not yet called wait()',
            'A malicious rootkit program running in kernel space',
            'A process whose CPU usage has exceeded 100%',
            'A thread running without any physical RAM'
          ],
          answer: 0,
          why: 'A zombie process has finished execution and released its memory, but its PID and exit status are preserved in the process table so its parent can read the exit code via wait() or waitpid().'
        }
      },
      {
        title: 'POSIX Signals: Asynchronous IPC, Graceful SIGTERM vs Uncatchable SIGKILL',
        say: [
          'POSIX signals are asynchronous notifications sent by the kernel or other processes to notify a target thread of an event. Common signals include SIGHUP (1), SIGINT (2, Ctrl+C), SIGTERM (15), and SIGKILL (9).',
          'When a process receives SIGTERM (signal 15), the process can catch the signal with a signal handler (e.g., sigaction in C or process.on("SIGTERM") in Node.js) to perform graceful cleanup: closing database connections, finishing active in-flight HTTP requests, and flushing write buffers.',
          'In contrast, SIGKILL (signal 9) cannot be caught, blocked, or ignored by any user-space process. The Linux kernel immediately terminates the process and releases its memory, which can leave temporary locks unreleased and database tables corrupted.',
          'Kubernetes and Docker orchestrators use this dual-signal model: they send SIGTERM first, grant a terminationGracePeriodSeconds (e.g. 30 seconds), and only send SIGKILL if the process fails to terminate gracefully.',
          'Correct signal handling is the hallmark of zero-downtime distributed microservices.'
        ],
        example: 'Think of leaving an office at the end of the day. A scheduled building closing announcement (SIGTERM) allows workers to save documents, finish current calls, lock filing cabinets, and exit peacefully. A sudden building power cutoff (SIGKILL) shuts off machines instantly with zero warning, risking data corruption.',
        code: `echo "SIGNAL NUM ACTION   CATCHABLE" > signals.txt
echo "SIGHUP 1   RELOAD   YES" >> signals.txt
echo "SIGINT 2   INTERRUPT YES" >> signals.txt
echo "SIGTERM 15 GRACEFUL  YES" >> signals.txt
echo "SIGKILL 9  TERMINATE NO" >> signals.txt
cat signals.txt
grep "YES" signals.txt | wc -l
grep "SIGKILL" signals.txt`,
        output: `SIGNAL NUM ACTION   CATCHABLE\nSIGHUP 1   RELOAD   YES\nSIGINT 2   INTERRUPT YES\nSIGTERM 15 GRACEFUL  YES\nSIGKILL 9  TERMINATE NO\n3\nSIGKILL 9  TERMINATE NO`,
        codeNotes: [
          { line: 1, note: 'Initializes signal table with POSIX numbers and actions' },
          { line: 4, note: 'Defines SIGTERM (15) as catchable for graceful application teardown' },
          { line: 5, note: 'Defines SIGKILL (9) as uncatchable kernel-level immediate termination' },
          { line: 7, note: 'Counts all signals that user applications can handle and catch (3)' }
        ],
        tryIt: 'Add SIGQUIT (signal 3) with CATCHABLE=YES and verify the catchable count increases to 4.',
        check: {
          question: 'Why does container orchestration like Kubernetes send SIGTERM before SIGKILL during pod shutdown?',
          options: [
            'SIGTERM allows the application to cleanly flush buffers, finish pending requests, and close sockets before SIGKILL forces termination',
            'SIGTERM reboots the underlying physical Linux server',
            'SIGKILL is deprecated in modern Linux kernels',
            'SIGTERM automatically compresses the database into a zip archive'
          ],
          answer: 0,
          why: 'SIGTERM gives the user application an opportunity to execute graceful shutdown logic. SIGKILL cannot be intercepted by user code and forces an abrupt abort, which could truncate inflight transactions.'
        }
      },
      {
        title: 'Virtual Memory Paging, Page Tables, TLBs & Page Faults',
        say: [
          'Modern operating systems isolate processes by giving each process its own virtual address space. A user program never sees raw physical RAM addresses; instead, virtual memory is partitioned into fixed-size blocks called pages (typically 4KB in Linux x86_64).',
          'Physical RAM is partitioned into matching blocks called page frames. The Memory Management Unit (MMU) hardware uses multi-level Page Tables to map Virtual Page Numbers (VPN) to Physical Frame Numbers (PFN).',
          'Because traversing multi-level page tables in DRAM adds latency, the CPU caches recent virtual-to-physical translations in a fast hardware cache called the Translation Lookaside Buffer (TLB).',
          'When a process accesses a virtual page that is marked "present = 0" (e.g. swapped out to disk or lazily allocated), the CPU triggers a Page Fault exception. The kernel page fault handler interrupts execution, loads the requested page from disk or zero-fills an anonymous frame, updates the page table, and resumes execution.',
          'Understanding memory paging explains copy-on-write (COW) during fork(), memory overcommit, and out-of-memory (OOM) killer mechanics.'
        ],
        example: 'Think of a library catalog index card. The card lists a shelf code (virtual address). You check the circulation desk clipboard (TLB) first; if it is listed (TLB hit), you fetch the book immediately. If not (TLB miss), you inspect the card drawers (Page Table). If the book is in an external warehouse (present = 0), a delivery truck brings it in (Page Fault).',
        code: `echo "VPN   PFN   DIRTY PRESENT" > page_table.txt
echo "0x001 0x0A4 0     1" >> page_table.txt
echo "0x002 0x0B8 1     1" >> page_table.txt
echo "0x003 0x000 0     0" >> page_table.txt
echo "0x004 0x0F1 0     1" >> page_table.txt
head -n 3 page_table.txt
grep "0x000" page_table.txt`,
        output: `VPN   PFN   DIRTY PRESENT\n0x001 0x0A4 0     1\n0x002 0x0B8 1     1\n0x003 0x000 0     0`,
        codeNotes: [
          { line: 1, note: 'Defines virtual memory page table manifest with VPN, PFN, and dirty/present bits' },
          { line: 4, note: 'Page 0x003 has PRESENT=0 indicating swapped out page frame requiring page fault handling' },
          { line: 6, note: 'Extracts top 3 lines of page table' },
          { line: 7, note: 'Identifies non-present page frame triggering kernel page fault' }
        ],
        tryIt: 'Change the head command to head -n 4 to preview 4 virtual page translations.',
        check: {
          question: 'What hardware component caches recent virtual-to-physical memory translations to accelerate MMU lookups?',
          options: [
            'Translation Lookaside Buffer (TLB)',
            'Direct Memory Access (DMA) controller',
            'SATA storage controller',
            'Network Interface Card (NIC)'
          ],
          answer: 0,
          why: 'The Translation Lookaside Buffer (TLB) is a specialized on-chip CPU associative cache that stores recent virtual-to-physical page mappings, avoiding slow DRAM page table walks on every memory reference.'
        }
      },
      {
        title: 'Linux Completely Fair Scheduler (CFS) & vruntime Priority',
        say: [
          'The Linux kernel uses the Completely Fair Scheduler (CFS) for standard non-realtime processes. Instead of fixed time slices, CFS models an ideal multi-tasking CPU where every runnable process receives a mathematically fair share of CPU time.',
          'To track execution fairness, CFS maintains a virtual runtime (vruntime) metric for each process. vruntime measures the exact amount of execution time the thread has consumed, scaled inversely by its nice level priority (nice -20 high priority to +19 low priority).',
          'Processes with higher priority (lower nice value) accumulate vruntime much more slowly, granting them larger effective shares of CPU time.',
          'CFS organizes runnable tasks in a time-ordered red-black binary search tree (rb-tree) keyed by vruntime. The task with the smallest vruntime sits at the leftmost node.',
          'When a scheduling decision occurs, the kernel picks the leftmost process, dispatches it to the CPU core, updates its vruntime, and reinserts it into the tree in O(log N) time.'
        ],
        example: 'Think of runners at a water hydration station. Each runner has a digital meter recording total water consumed (vruntime). The athlete who has drank the least amount of water is always summoned to the faucet first, ensuring balanced, equitable hydration across the entire field.',
        code: `echo "012.5ms PID_1088 realtime_audio" > cfs_queue.txt
echo "042.1ms PID_1001 api_gateway" >> cfs_queue.txt
echo "078.9ms PID_1033 db_sync" >> cfs_queue.txt
echo "100.4ms PID_1042 worker_low_prio" >> cfs_queue.txt
sort cfs_queue.txt | head -n 2`,
        output: `012.5ms PID_1088 realtime_audio\n042.1ms PID_1001 api_gateway`,
        codeNotes: [
          { line: 1, note: 'Defines CFS runnable tasks ordered with normalized vruntime values' },
          { line: 4, note: 'Worker with 100.4ms has accumulated largest vruntime' },
          { line: 5, note: 'Sorts queue to simulate CFS red-black tree leftmost lookup and picks top 2 tasks' }
        ],
        tryIt: 'Add a new high-priority interactive task with vruntime 005.0ms and verify it appears first in the sorted queue.',
        check: {
          question: 'How does the Linux Completely Fair Scheduler (CFS) determine which runnable process to dispatch to a CPU core next?',
          options: [
            'It selects the process with the lowest virtual runtime (vruntime), located at the leftmost node of its red-black tree',
            'It randomly picks any process in memory',
            'It always selects the process with the largest PID',
            'It executes processes in reverse alphabetical order of their binary names'
          ],
          answer: 0,
          why: 'CFS tracks virtual runtime (vruntime) in a red-black tree. The task that has consumed the least proportional CPU time (lowest vruntime) sits at the leftmost node and is scheduled next to maintain fairness.'
        }
      },
      {
        title: 'File Descriptors, Inodes & Stream Redirection Architecture',
        say: [
          'In UNIX philosophy, "everything is a file" (devices, sockets, pipes, and regular files). When a process opens any I/O resource, the kernel allocates an entry in the process File Descriptor (FD) table.',
          'File descriptors 0, 1, and 2 are pre-allocated at startup for stdin, stdout, and stderr. Any additional open file receives the lowest available non-negative integer (e.g. 3, 4, 5).',
          'Below the file descriptor table sits the inode (index node) layer on the filesystem. An inode contains file metadata: permissions, owner, link count, byte size, timestamps, and pointers to raw data blocks on disk, but notably NOT the filename!',
          'Filenames live strictly inside directory structures as mappings from human-readable names to inode numbers. This separation allows multiple hard links to point to the exact same physical inode without duplicating data.',
          'Stream redirection operators (> and >>) in the shell invoke the dup2() system call, remapping file descriptor 1 (stdout) or 2 (stderr) to point to a new target file or socket.'
        ],
        example: 'Think of a hotel room keycard versus the physical room. The keycard number (file descriptor) is what the guest carries. The room record in the hotel database (inode) holds room dimensions and inventory. The brass room number on the door (directory filename) simply directs people to that room.',
        code: `mkdir -p /home/student/workspace/proc_fs
echo "INODE:984321 SIZE:4096 LINKS:1 DATA:app_manifest" > /home/student/workspace/proc_fs/inode_meta.txt
cat /home/student/workspace/proc_fs/inode_meta.txt
echo "STDOUT: fd_1 active" > stdout.log
echo "STDERR: fd_2 connected" >> stderr.log
cat stdout.log
cat stderr.log`,
        output: `INODE:984321 SIZE:4096 LINKS:1 DATA:app_manifest\nSTDOUT: fd_1 active\nSTDERR: fd_2 connected`,
        codeNotes: [
          { line: 1, note: 'Creates virtual proc_fs directory' },
          { line: 2, note: 'Stores inode metadata demonstrating inode number and link count' },
          { line: 4, note: 'Demonstrates stdout redirection simulating file descriptor 1 dup2()' },
          { line: 5, note: 'Demonstrates stderr redirection simulating file descriptor 2 dup2()' }
        ],
        tryIt: 'Inspect the content of stderr.log using cat stderr.log.',
        check: {
          question: 'Where is the filename of a file stored in a POSIX filesystem architecture?',
          options: [
            'Inside directory entries as a mapping from name to inode number, not in the inode itself',
            'Directly inside the physical CPU registers',
            'In the first 4 bytes of physical RAM',
            'Inside the network router firmware'
          ],
          answer: 0,
          why: 'An inode stores permissions, timestamps, sizes, and disk block pointers, but filenames are strictly stored in directory entries mapping human-readable names to inode numbers.'
        }
      }
    ],
    summary: [
      'Linux processes follow a fork/exec lifecycle; terminated children remain zombies until reaped by their parent or adopted by PID 1.',
      'POSIX signals deliver asynchronous notifications: SIGTERM (15) allows graceful cleanup, while SIGKILL (9) forces uncatchable termination.',
      'Virtual memory translates VPN to PFN via page tables, cached by the hardware TLB, triggering page faults on non-present pages.',
      'The Completely Fair Scheduler (CFS) selects the task with the lowest vruntime from its red-black tree to ensure equitable CPU distribution.',
      'File descriptors index per-process I/O tables pointing to underlying filesystem inodes, while filenames live inside directory tables.'
    ],
    projectStep: {
      title: 'Construct a Linux Kernel Process & Memory Architecture Inspector',
      steps: [
        'Model a POSIX process table isolating running services and detecting unreaped zombie child states.',
        'Evaluate asynchronous signal vectors distinguishing catchable SIGTERM teardown from uncatchable SIGKILL.',
        'Inspect virtual memory page table mappings identifying non-present page frames and page fault conditions.',
        'Simulate CFS red-black tree task dispatching by sorting virtual runtime metrics.',
        'Examine filesystem inode metadata structures and simulate standard stream redirection via dup2.'
      ]
    }
  },
  {
    day: 4,
    title: 'POSIX Network Sockets, TCP/IP Handshake, High-Concurrency epoll & TLS 1.3',
    goal: 'Master foundational computer networking & low-level communication architecture: Berkeley socket lifecycle (socket, bind, listen, accept), TCP 3-way handshake & state machine (SYN, ACK, TIME_WAIT), Linux high-concurrency I/O multiplexing (epoll vs select/poll), recursive DNS resolution root hierarchy, and TLS 1.3 cryptographic key exchange.',
    minutes: 35,
    recap: 'Welcome to Computer Networking & Low-Level Communication Architecture. Today we transition from internal OS processes to inter-machine socket programming, TCP state machines, and cryptographic transport layers.',
    parts: [
      {
        title: 'POSIX Berkeley Socket Lifecycle: socket, bind, listen, accept',
        say: [
          'In UNIX operating systems, all input and output adheres to the universal abstraction of file descriptors. When two computers communicate over the internet, the operating system kernel provides network endpoints known as Berkeley sockets.',
          'The lifecycle of a TCP server begins with socket(AF_INET, SOCK_STREAM, 0), requesting a stream-oriented socket file descriptor from the kernel. Next, bind() binds that socket descriptor to a specific local IP address and port number. Without bind(), the kernel does not know which incoming network packets belong to this process.',
          'The server then calls listen(), which transitions the socket from active client mode to passive listening mode and initializes the kernel incoming connection backlog queue (SOMAXCONN). Finally, accept() blocks until an incoming client connection arrives, pulling it from the queue and returning a brand-new file descriptor representing the dedicated bi-directional communication channel with that specific client.'
        ],
        example: 'Like a hospital phone switchboard: the main reception phone number is the passive listening socket. When a patient calls, the operator answers and transfers them to a dedicated internal room line (the connected client socket), freeing the main switchboard to accept new calls.',
        code: `mkdir -p /home/student/workspace/net_socket
echo "FD_3 LISTEN  0.0.0.0:8080 BACKLOG:128" > /home/student/workspace/net_socket/sockets.txt
echo "FD_4 ACCEPT  192.168.1.50:52310 ESTABLISHED" >> /home/student/workspace/net_socket/sockets.txt
echo "FD_5 ACCEPT  192.168.1.51:52312 ESTABLISHED" >> /home/student/workspace/net_socket/sockets.txt
cat /home/student/workspace/net_socket/sockets.txt
grep "ESTABLISHED" /home/student/workspace/net_socket/sockets.txt`,
        output: `FD_3 LISTEN  0.0.0.0:8080 BACKLOG:128\nFD_4 ACCEPT  192.168.1.50:52310 ESTABLISHED\nFD_5 ACCEPT  192.168.1.51:52312 ESTABLISHED\n\nFD_4 ACCEPT  192.168.1.50:52310 ESTABLISHED\nFD_5 ACCEPT  192.168.1.51:52312 ESTABLISHED`,
        codeNotes: [
          { line: 1, note: 'Creates virtual net_socket directory' },
          { line: 2, note: 'Registers listening socket descriptor FD_3 bound to 0.0.0.0:8080' },
          { line: 3, note: 'Records accepted client connection on dedicated socket descriptor FD_4' },
          { line: 4, note: 'Records second accepted client connection on dedicated socket descriptor FD_5' }
        ],
        tryIt: 'Filter for the listening socket descriptor using grep "LISTEN" /home/student/workspace/net_socket/sockets.txt.',
        check: {
          question: 'What does the POSIX accept() system call return when an incoming TCP connection is established?',
          options: [
            'A brand-new file descriptor specifically dedicated to communicating with the connected client, leaving the original listening socket open for new incoming connections',
            'The physical MAC address of the nearest Wi-Fi router',
            'A string containing the user password in plain text',
            'An integer count of the total RAM installed on the server'
          ],
          answer: 0,
          why: 'accept() creates and returns a new connected socket file descriptor for that specific client stream, allowing the original listening socket to continue accepting new inbound connections concurrently.'
        }
      },
      {
        title: 'TCP 3-Way Handshake & Connection Teardown State Machine',
        say: [
          'Transmission Control Protocol (TCP) provides reliable, ordered, error-checked delivery of byte streams across unreliable IP networks. Before any application data can travel, client and server must establish sequence numbers and window sizes via the 3-Way Handshake.',
          'Step 1: The client sends a SYN packet with an initial random sequence number x (ISN). Step 2: The server receives the SYN and responds with a SYN-ACK packet containing its own initial sequence number y and acknowledging the client with ACK = x + 1. Step 3: The client replies with an ACK packet containing ACK = y + 1. At this moment, the connection transitions to the ESTABLISHED state on both endpoints.',
          'Graceful connection termination uses a 4-way FIN/ACK handshake. The endpoint that initiates teardown enters the TIME_WAIT state, lasting 2 * MSL (Maximum Segment Lifetime, typically 60 seconds). TIME_WAIT is essential in networking: it ensures that late-arriving, duplicate packets from the closed connection expire in the network and cannot be misattributed to a newly opened connection reusing the same IP and port.'
        ],
        example: 'Like an air-traffic radio protocol: "Tower, this is Flight 101, requesting approach" (SYN) -> "Flight 101, Tower acknowledges, climb to 5000 feet, do you copy?" (SYN-ACK) -> "Tower, Flight 101 copies, 5000 feet confirmed" (ACK).',
        code: `mkdir -p /home/student/workspace/tcp_state
echo "STEP_1 CLIENT SYN     SEQ:1000 ACK:0" > /home/student/workspace/tcp_state/handshake.log
echo "STEP_2 SERVER SYN-ACK SEQ:5000 ACK:1001" >> /home/student/workspace/tcp_state/handshake.log
echo "STEP_3 CLIENT ACK     SEQ:1001 ACK:5001" >> /home/student/workspace/tcp_state/handshake.log
echo "STATE: ESTABLISHED" >> /home/student/workspace/tcp_state/handshake.log
echo "TEARDOWN: TIME_WAIT 2MSL_TIMEOUT:60s" >> /home/student/workspace/tcp_state/handshake.log
cat /home/student/workspace/tcp_state/handshake.log`,
        output: `STEP_1 CLIENT SYN     SEQ:1000 ACK:0\nSTEP_2 SERVER SYN-ACK SEQ:5000 ACK:1001\nSTEP_3 CLIENT ACK     SEQ:1001 ACK:5001\nSTATE: ESTABLISHED\nTEARDOWN: TIME_WAIT 2MSL_TIMEOUT:60s`,
        codeNotes: [
          { line: 1, note: 'Creates virtual tcp_state directory' },
          { line: 2, note: 'Logs Step 1 client SYN packet with initial sequence number 1000' },
          { line: 3, note: 'Logs Step 2 server SYN-ACK packet with sequence 5000 and ACK 1001' },
          { line: 4, note: 'Logs Step 3 client ACK packet completing 3-way handshake' }
        ],
        tryIt: 'Inspect the handshake log and observe how the ACK sequence numbers advance by exactly 1 in each handshake step.',
        check: {
          question: 'What critical networking problem is prevented by the TCP TIME_WAIT state (2 * MSL)?',
          options: [
            'It prevents delayed duplicate packets from a previous connection incarnation from corrupting a new connection reusing the same IP and port tuple',
            'It prevents the computer screen from sleeping during file downloads',
            'It speeds up the CPU clock frequency',
            'It forces the internet router to reboot every 60 seconds'
          ],
          answer: 0,
          why: 'TIME_WAIT holds the socket open long enough for stray packets in flight to expire and ensures the final ACK was received by the remote peer before the port can be safely reused.'
        }
      },
      {
        title: 'I/O Multiplexing: epoll vs select and poll for 100K Connections',
        say: [
          'In early server architectures (the C10K problem era), servers handled concurrent connections by spawning a new OS thread or process per connection. This model failed at scale because OS context switching and 8MB thread stack allocations exhausted server memory.',
          'Early I/O multiplexing used select() and poll(). While they allowed a single thread to monitor multiple sockets, both required passing an array of all monitored file descriptors from user space to kernel space on EVERY single poll call, leading to O(N) CPU overhead where the CPU wasted cycles scanning thousands of idle sockets.',
          'Linux epoll revolutionized high-concurrency servers (powering Nginx, Node.js libuv, and Netty). epoll maintains a kernel-level data structure using a red-black tree to register file descriptors in O(log N) time and an internal ready list. When network packets arrive, the network card hardware interrupt adds the active socket directly to the ready list in O(1) time, allowing a single thread to handle 100,000+ persistent connections with near-zero idle CPU usage.'
        ],
        example: 'Like an office receptionist checking on 100 meeting rooms: with select(), the receptionist walks to all 100 rooms every 5 minutes knocking on doors. With epoll(), rooms have a buzzer that illuminates a light on the receptionist desk only when assistance is needed.',
        code: `mkdir -p /home/student/workspace/epoll_events
echo "EPOLL_EVENT: FD_4 EPOLLIN  CLIENT_REQUEST_READY" > /home/student/workspace/epoll_events/events.log
echo "EPOLL_EVENT: FD_5 EPOLLOUT SOCKET_WRITE_READY" >> /home/student/workspace/epoll_events/events.log
cat /home/student/workspace/epoll_events/events.log
grep "EPOLLIN" /home/student/workspace/epoll_events/events.log`,
        output: `EPOLL_EVENT: FD_4 EPOLLIN  CLIENT_REQUEST_READY\nEPOLL_EVENT: FD_5 EPOLLOUT SOCKET_WRITE_READY\n\nEPOLL_EVENT: FD_4 EPOLLIN  CLIENT_REQUEST_READY`,
        codeNotes: [
          { line: 1, note: 'Creates virtual epoll_events directory' },
          { line: 2, note: 'Records an incoming read readiness event (EPOLLIN) on client socket descriptor FD_4' },
          { line: 3, note: 'Records write buffer readiness event (EPOLLOUT) on socket descriptor FD_5' }
        ],
        tryIt: 'Filter for write readiness events using grep "EPOLLOUT" /home/student/workspace/epoll_events/events.log.',
        check: {
          question: 'Why does Linux epoll scale to 100,000 concurrent sockets while select() degrades exponentially?',
          options: [
            'epoll uses an in-kernel ready list populated by device interrupts returning only active sockets in O(1) time, avoiding select O(N) linear scanning of all descriptors',
            'epoll uses 5G cellular modems instead of ethernet cables',
            'select() is forbidden on 64-bit microprocessors',
            'epoll compresses all incoming network packets with zip compression'
          ],
          answer: 0,
          why: 'select() requires the kernel to iterate over all N file descriptors on every call. epoll uses hardware interrupt callbacks to maintain a ready list of only active descriptors, achieving O(1) event delivery.'
        }
      },
      {
        title: 'DNS Resolution Pipeline & Root Server Hierarchy',
        say: [
          'The Domain Name System (DNS) is the global decentralized directory service translating human-readable domain names (such as pinit.io) into machine-routable IP addresses (such as 76.76.21.21).',
          'When an application requests a domain, resolution follows a strict hierarchical tree: first checking the local OS cache and /etc/hosts. If missed, the query proceeds to a Recursive Resolver (like 1.1.1.1 or 8.8.8.8), which queries the Root DNS servers (13 named root server clusters designated a.root-servers.net through m.root-servers.net).',
          'The Root servers refer the resolver to the Top-Level Domain (TLD) servers (such as .io or .com). The TLD servers in turn refer the query to the Authoritative Nameservers for the specific domain. The authoritative server returns the final resource record (A for IPv4, AAAA for IPv6, CNAME for aliases), accompanied by a Time-To-Live (TTL) integer specifying how many seconds intermediate caches may retain the mapping.'
        ],
        example: 'Like finding an address in an international registry: checking the World Directorate (Root), which points you to the United Kingdom registry (TLD), which directs you to the London municipal hall (Authoritative server), which provides the exact street coordinates (A record).',
        code: `mkdir -p /home/student/workspace/dns_trace
echo "QUERY: pinit.io TYPE:A" > /home/student/workspace/dns_trace/resolution.txt
echo "STEP_1 ROOT_SERVER      .           NS a.root-servers.net" >> /home/student/workspace/dns_trace/resolution.txt
echo "STEP_2 TLD_SERVER       .io         NS a.nic.io" >> /home/student/workspace/dns_trace/resolution.txt
echo "STEP_3 AUTH_NAMESERVER  pinit.io    A  76.76.21.21 TTL:300" >> /home/student/workspace/dns_trace/resolution.txt
cat /home/student/workspace/dns_trace/resolution.txt
grep "AUTH_NAMESERVER" /home/student/workspace/dns_trace/resolution.txt`,
        output: `QUERY: pinit.io TYPE:A\nSTEP_1 ROOT_SERVER      .           NS a.root-servers.net\nSTEP_2 TLD_SERVER       .io         NS a.nic.io\nSTEP_3 AUTH_NAMESERVER  pinit.io    A  76.76.21.21 TTL:300\n\nSTEP_3 AUTH_NAMESERVER  pinit.io    A  76.76.21.21 TTL:300`,
        codeNotes: [
          { line: 1, note: 'Creates virtual dns_trace directory' },
          { line: 2, note: 'Records recursive lookup query for domain pinit.io A record' },
          { line: 3, note: 'Traces referral from root DNS server to .io TLD' },
          { line: 4, note: 'Traces referral from TLD server to authoritative nameserver' },
          { line: 5, note: 'Records final authoritative A record resolution with 300s TTL' }
        ],
        tryIt: 'Filter for the root server referral line using grep "ROOT_SERVER" /home/student/workspace/dns_trace/resolution.txt.',
        check: {
          question: 'What is the function of the TTL (Time-To-Live) field in a DNS resource record?',
          options: [
            'It dictates the duration in seconds that resolvers and client operating systems can cache the DNS record before re-querying authoritative nameservers',
            'It measures the distance in miles to the web server',
            'It sets the maximum speed limit of the ethernet network cable',
            'It automatically deletes the website domain after the timer expires'
          ],
          answer: 0,
          why: 'TTL specifies cache freshness. Lower TTLs allow fast DNS failover during migrations, while higher TTLs reduce lookup latency and decrease load on authoritative nameservers.'
        }
      },
      {
        title: 'TLS 1.3 Cryptographic Handshake & Key Exchange',
        say: [
          'Transport Layer Security (TLS 1.3) encrypts internet traffic across the wire, preventing eavesdropping, tampering, and message forgery between web browsers and servers.',
          'Legacy TLS 1.2 required two full round-trips (2-RTT) of back-and-forth packet negotiation before encrypted application data could be sent. TLS 1.3 optimizes this to a single round-trip (1-RTT) by having the client guess the server cryptographic parameters and send its Diffie-Hellman Ephemeral (ECDHE) key share directly in the initial ClientHello packet.',
          'The server responds with ServerHello containing its own key share, its digital X.509 certificate, and a cryptographic signature. Both parties calculate a shared symmetric session key (using curve X25519) without ever transmitting the secret over the wire. This ephemeral key exchange guarantees Forward Secrecy: even if an adversary records all encrypted traffic today and steals the server private key five years from now, previously recorded sessions can never be decrypted.'
        ],
        example: 'Like two people mixing colors of paint in public view: both add their secret color to a common base and share the intermediate mixture. Both can compute the identical final secret shade, yet someone watching from across the room cannot deduce the secret colors used.',
        code: `mkdir -p /home/student/workspace/tls_handshake
echo "TLS_VERSION: TLS_1_3" > /home/student/workspace/tls_handshake/tls.log
echo "CIPHER_SUITE: TLS_AES_256_GCM_SHA384" >> /home/student/workspace/tls_handshake/tls.log
echo "KEY_EXCHANGE: ECDHE_X25519" >> /home/student/workspace/tls_handshake/tls.log
echo "FORWARD_SECRECY: VERIFIED" >> /home/student/workspace/tls_handshake/tls.log
cat /home/student/workspace/tls_handshake/tls.log
grep "FORWARD_SECRECY" /home/student/workspace/tls_handshake/tls.log`,
        output: `TLS_VERSION: TLS_1_3\nCIPHER_SUITE: TLS_AES_256_GCM_SHA384\nKEY_EXCHANGE: ECDHE_X25519\nFORWARD_SECRECY: VERIFIED\n\nFORWARD_SECRECY: VERIFIED`,
        codeNotes: [
          { line: 1, note: 'Creates virtual tls_handshake directory' },
          { line: 2, note: 'Records negotiated protocol version TLS 1.3' },
          { line: 3, note: 'Records symmetric authenticated encryption cipher suite AES-256-GCM' },
          { line: 4, note: 'Records Elliptic Curve Diffie-Hellman Ephemeral key exchange algorithm X25519' },
          { line: 5, note: 'Confirms forward secrecy verification protecting past sessions' }
        ],
        tryIt: 'Filter for the negotiated cipher suite using grep "CIPHER_SUITE" /home/student/workspace/tls_handshake/tls.log.',
        check: {
          question: 'What security property does Ephemeral Diffie-Hellman (ECDHE) key exchange provide in TLS 1.3?',
          options: [
            'Forward Secrecy: compromises of the server long-term private key in the future cannot be used to decrypt previously recorded session traffic',
            'Zero gas fees on Ethereum transactions',
            'Automatic renewal of SSL domain certificates',
            'Compression of JPEG images on web pages'
          ],
          answer: 0,
          why: 'ECDHE generates fresh, temporary cryptographic key pairs for each connection session. Once the session ends, the keys are discarded from memory, making retro-active decryption mathematically impossible.'
        }
      }
    ],
    summary: [
      'POSIX Berkeley sockets follow a socket/bind/listen/accept sequence, returning dedicated connection file descriptors upon client accept.',
      'TCP establishes reliable byte streams via 3-way handshake (SYN, SYN-ACK, ACK) and enforces TIME_WAIT (2*MSL) to prevent stale packet collision.',
      'Linux epoll achieves O(1) event delivery using kernel ready lists populated by hardware interrupts, handling 100K+ concurrent sockets.',
      'Recursive DNS resolution traverses Root, TLD, and Authoritative nameservers, respecting TTL caching boundaries.',
      'TLS 1.3 provides 1-RTT handshake negotiation and ECDHE key exchange, guaranteeing cryptographic Forward Secrecy.'
    ],
    projectStep: {
      title: 'Architect a Low-Level Network Socket & Transport Layer Diagnostic Suite',
      steps: [
        'Simulate a POSIX Berkeley TCP socket server inspecting listening descriptors and accepted client channels.',
        'Trace the 3-way TCP handshake and connection teardown state machine isolating the TIME_WAIT socket lifecycle.',
        'Evaluate Linux epoll I/O multiplexing readiness queues distinguishing EPOLLIN and EPOLLOUT notification events.',
        'Trace recursive DNS resolution traversing Root servers, TLD registries, and Authoritative A record lookups.',
        'Audit a TLS 1.3 1-RTT cryptographic handshake verifying ECDHE key exchange and Forward Secrecy invariants.'
      ]
    }
  }
];

