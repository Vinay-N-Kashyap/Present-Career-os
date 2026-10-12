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
  }
];
