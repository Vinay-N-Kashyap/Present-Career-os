import type { LongLesson } from './longLessons';

export const GIT_VCS_LONG_LESSONS: LongLesson[] = [
  {
    day: 1,
    title: 'Git Object Model, Repository Initialization & Staging Invariants',
    goal: 'Master distributed version control fundamentals: repository initialization, the 3-state architecture (Working Tree, Staging Area, Git Directory), commit hashing, and status inspection.',
    minutes: 30,
    recap: 'Welcome to Git, GitHub & Version Control Basics. Today we demystify how Git tracks cryptographic snapshots of code through its three-tier architecture.',
    parts: [
      {
        title: 'Centralized vs Distributed Version Control & The 3 Git States',
        say: [
          'Before Git, version control systems were centralized, meaning all team history lived on a single central server.',
          'If that central server went down or network connectivity was lost, developers could not commit changes or inspect past logs.',
          'Git is a distributed version control system where every single clone contains the full cryptographic history of the entire project.',
          'At the heart of Git is the Three-State Architecture: the Working Directory, the Staging Area (or Index), and the Git Repository (.git directory).',
          'Your Working Directory contains the physical files you see and edit in your code editor.',
          'The Staging Area acts as a loading dock where you curate the exact set of changes destined for the next snapshot.',
          'The Repository stores committed snapshots immutably as cryptographically hashed objects.'
        ],
        example: 'Think of your working tree as your shopping cart, the staging area as items placed onto the checkout conveyor belt, and the commit as the printed receipt.',
        code: `mkdir -p demo_repo
cd demo_repo
echo "# Core Engine" > README.md
cat README.md
ls -a`,
        output: `# Core Engine\n.  ..  README.md`,
        codeNotes: [
          { line: 1, note: 'Creates clean project folder' },
          { line: 3, note: 'Initializes project README in the working tree' },
          { line: 5, note: 'Shows files before Git initialization' }
        ],
        tryIt: 'Add another file named app.js in demo_repo before running initialization.',
        check: {
          question: 'What is the role of the Staging Area (Index) in Git?',
          options: [
            'It serves as a curated preview area to select which changes will be recorded in the next commit',
            'It stores deleted files in a temporary recycle bin',
            'It automatically uploads code to GitHub without confirmation'
          ],
          answer: 0,
          why: 'The Staging Area allows developers to craft clean, granular commits by selectively queuing changes before snapshotting them.'
        }
      },
      {
        title: 'Repository Initialization & The .git Directory Structure',
        say: [
          'To turn any normal folder into a Git repository, we execute git init.',
          'Running git init creates a hidden folder named dot git in the root of your project.',
          'The dot git directory houses the entire object database, reference pointers (like HEAD and branch names), and configuration settings.',
          'If you delete the dot git folder, the directory reverts to an ordinary folder and all history is wiped out, though working files remain intact.',
          'Never manually modify files inside dot git unless you are writing low-level plumbing tools.'
        ],
        example: 'Attaching a secure flight recorder black box to an aircraft: the cockpit remains the same, but every event is now logged.',
        code: `mkdir -p repo
cd repo
echo "git version control initialized" > status.txt
mkdir -p .git/objects .git/refs/heads
echo "ref: refs/heads/main" > .git/HEAD
ls -a
cat .git/HEAD`,
        output: `.  ..  .git  status.txt\nref: refs/heads/main`,
        codeNotes: [
          { line: 4, note: 'Simulates Git initialization internals: objects and refs databases' },
          { line: 5, note: 'Sets initial HEAD symbolic reference to main branch' },
          { line: 7, note: 'Inspects HEAD pointer referencing the default branch' }
        ],
        tryIt: 'Inspect the contents of .git/HEAD to see how Git tracks your active branch pointer.',
        check: {
          question: 'What happens to a repository if the hidden .git directory is removed?',
          options: [
            'All version history and tracking is lost, returning it to an untracked directory',
            'The operating system will crash',
            'The files in the working directory are immediately deleted'
          ],
          answer: 0,
          why: 'The .git folder houses Git internal database; removing it deletes all commit history and branches while leaving working tree files intact.'
        }
      },
      {
        title: 'Working Tree Inspection with git status',
        say: [
          'The most frequently executed command in Git is git status.',
          'git status answers three fundamental questions:',
          'First: Which branch am I currently on?',
          'Second: Which modified files have not yet been staged for commit?',
          'Third: Which files are completely untracked by Git?',
          'Developing the habit of running git status before and after every staging action prevents accidental commits of secrets or unwanted build artifacts.'
        ],
        example: 'Looking at your packing checklist before zipping your luggage to verify no essential items were left on the bed.',
        code: `mkdir -p project
echo "function sum(a, b) { return a + b; }" > project/math.js
echo "PORT=3000" > project/.env
echo "Untracked files:"
ls project
echo "Recommended: Stage math.js, ignore .env"`,
        output: `Untracked files:\n.env  math.js\nRecommended: Stage math.js, ignore .env`,
        codeNotes: [
          { line: 2, note: 'Creates application source code destined for version control' },
          { line: 3, note: 'Creates sensitive environment configuration that must NOT be staged' }
        ],
        tryIt: 'Add another file project/test.js and evaluate whether it should be tracked.',
        check: {
          question: 'Why should developers run git status before executing git commit?',
          options: [
            'To confirm precisely which changes are staged and ensure secrets or unintended files are not committed',
            'To synchronize local files with the remote GitHub server',
            'To automatically compile TypeScript code'
          ],
          answer: 0,
          why: 'git status provides full visibility into the Staging Area, preventing accidental commit of sensitive credentials or scratch files.'
        }
      },
      {
        title: 'Staging Files & The SHA-1/SHA-256 Content-Addressable Database',
        say: [
          'When you run git add, Git reads the content of the target file and calculates its cryptographic SHA hash.',
          'Git compresses the file content using zlib and writes it into the dot git objects database as a blob object.',
          'Notice that Git tracks content, not file names; if two files in different directories have identical bytes, Git stores only one blob object.',
          'The staging index updates its internal manifest to map the file path to that new blob hash.',
          'Running git add on specific paths lets you compose logical, bite-sized commits instead of committing everything blindly with dot.'
        ],
        example: 'Taking a photograph of an artifact and filing the picture in an indexed archive under its unique fingerprint number.',
        code: `mkdir -p staging_sim
echo "console.log('v1.0.0');" > staging_sim/index.js
echo "Staging index.js into index manifest..."
echo "index.js -> SHA: e69de29bb2d1d6434b8b29ae775ad8c2e48c5391" > staging_sim/index_manifest
cat staging_sim/index_manifest`,
        output: `Staging index.js into index manifest...\nindex.js -> SHA: e69de29bb2d1d6434b8b29ae775ad8c2e48c5391`,
        codeNotes: [
          { line: 2, note: 'Simulates file creation in working tree' },
          { line: 4, note: 'Simulates Git calculating SHA hash and updating the index' }
        ],
        tryIt: 'Change the log string to v1.1.0 and observe how the content hash changes.',
        check: {
          question: 'In Git internal architecture, how are file contents identified in the object database?',
          options: [
            'By the cryptographic hash of their contents (content-addressable storage)',
            'By their alphabetical file name on the operating system',
            'By their creation timestamp and file owner ID'
          ],
          answer: 0,
          why: 'Git is a content-addressable key-value store where every object is addressed by the cryptographic hash of its content.'
        }
      },
      {
        title: 'Atomic Commits & Writing Meaningful Commit Messages',
        say: [
          'A commit represents an immutable, permanent snapshot of your project state at a specific point in time.',
          'Every commit record contains four pieces of information:',
          'One: A pointer to the root tree object representing the directory snapshot.',
          'Two: A pointer to the parent commit, forming an unbroken cryptographic directed acyclic graph.',
          'Three: Author and committer metadata with timestamps.',
          'Four: A human-readable commit message explaining WHY the change was made.',
          'An atomic commit encapsulates one logical unit of work. Never bundle an unrelated bugfix with a major UI refactor.',
          'A disciplined commit message follows the imperative mood: e.g., "Add user authentication flow" rather than "Added user authentication".'
        ],
        example: 'A legal amendment that specifically states the exact clauses changed and the rationale, rather than a vague note saying documents updated.',
        code: `echo "commit 33924093" > commit_log.txt
echo "Author: Engineer <dev@campus.edu>" >> commit_log.txt
echo "Date:   $(date)" >> commit_log.txt
echo "" >> commit_log.txt
echo "    feat(auth): implement token verification middleware" >> commit_log.txt
cat commit_log.txt`,
        output: `commit 33924093\nAuthor: Engineer <dev@campus.edu>\n\n    feat(auth): implement token verification middleware`,
        codeNotes: [
          { line: 1, note: 'Displays unique commit SHA identifier' },
          { line: 5, note: 'Uses standard conventional commit message in imperative mood' }
        ],
        tryIt: 'Draft an atomic commit message for adding input validation to an email signup field.',
        check: {
          question: 'What constitutes an "atomic commit" in software engineering best practices?',
          options: [
            'A single focused commit that addresses one specific task, bug, or feature and leaves tests passing',
            'A commit that touches at least fifty files simultaneously',
            'A commit that deletes the entire .git history'
          ],
          answer: 0,
          why: 'Atomic commits isolate a single logical change, making code review, bisecting bugs, and reverting individual changes straightforward.'
        }
      }
    ],
    summary: [
      'Git is a distributed version control system where every clone contains the complete cryptographic history.',
      'The 3 states of Git are the Working Tree, the Staging Area (Index), and the Repository (.git).',
      'git init establishes the .git directory containing the object database and branch refs.',
      'git status inspects which files are untracked, modified, or staged.',
      'Git is content-addressable: objects are addressed by cryptographic hashes of their content.',
      'Atomic commits bundle one logical unit of work with clear, imperative commit messages.'
    ],
    projectStep: {
      title: 'Initialize Career OS Portfolio Repository',
      steps: [
        'Initialize local repository with git init',
        'Configure .gitignore to protect secrets and node_modules',
        'Stage project README and create first atomic initial commit'
      ]
    }
  }
];
