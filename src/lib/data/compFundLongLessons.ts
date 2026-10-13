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
  }
];

