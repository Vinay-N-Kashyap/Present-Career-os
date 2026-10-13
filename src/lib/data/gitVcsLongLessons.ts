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
  },
  {
    coursePrefix: 'git_vcs',
    day: 2,
    title: 'Git Branching Mechanics, Merge Conflicts & Rebase Invariants',
    goal: 'Master advanced Git workflows: branch pointers and HEAD reference mechanics, fast-forward vs 3-way merges, resolving merge conflict markers, .gitignore patterns for secret prevention, and linear rebase topologies.',
    minutes: 35,
    recap: 'In Day 1, we mastered distributed repository initialization, the 3 Git states (Working Tree, Staging Area, Git Directory), and atomic commits. Now, we advance into branch references, merge topologies, conflict marker resolution, secret protection, and rebase workflows.',
    parts: [
      {
        title: 'Git Branching & HEAD Pointer Mechanics',
        say: [
          'In many older version control systems, creating a branch was an expensive operation that copied every file into a new directory on disk.',
          'In Git, a branch is astonishingly lightweight: it is nothing more than a 41-byte text file containing a 40-character commit SHA hash pointing to a commit object.',
          'Creating a new branch with git branch feature-auth creates a new pointer in the dot git refs heads directory without duplicating a single byte of source code.',
          'The special reference named HEAD points to the branch you are currently working on.',
          'When you run git checkout or git switch, Git updates the HEAD pointer file to point to the new branch ref and checks out the corresponding tree into your working directory.',
          'When you make a new commit, Git automatically advances the active branch pointer referenced by HEAD, while all other branch pointers remain anchored at their historical commits.'
        ],
        example: 'Think of a library book with multiple bookmarks. Each bookmark (branch pointer) sits on a specific page number (commit SHA). The reader magnifying glass (HEAD) focuses on whichever bookmark they are actively reading. Creating a new bookmark takes zero paper copying—you just place a new slip of paper on the current page.',
        code: `mkdir -p .git/refs/heads
echo "commit_sha_101" > .git/refs/heads/main
echo "commit_sha_101" > .git/refs/heads/feature-auth
echo "ref: refs/heads/feature-auth" > .git/HEAD
cat .git/HEAD
cat .git/refs/heads/feature-auth`,
        output: `ref: refs/heads/feature-auth\n\ncommit_sha_101`,
        codeNotes: [
          { line: 1, note: 'Initializes Git internal refs hierarchy' },
          { line: 3, note: 'Creates lightweight feature-auth branch pointer pointing to initial commit SHA' },
          { line: 4, note: 'Attaches HEAD to feature-auth branch' }
        ],
        tryIt: 'Switch HEAD back to main by updating .git/HEAD to ref: refs/heads/main.',
        check: {
          question: 'What is a Git branch under the hood inside the .git directory?',
          options: [
            'A 41-byte file containing the 40-character SHA hash of the commit it points to',
            'A complete duplicate copy of every file in the project repository',
            'A compressed zip archive of the working directory'
          ],
          answer: 0,
          why: 'In Git, branches are simply lightweight movable pointers stored as 40-character commit hashes in .git/refs/heads/, making branch creation nearly instantaneous.'
        }
      },
      {
        title: 'Fast-Forward Merges vs 3-Way Merge Commits',
        say: [
          'When development on an isolated feature branch completes, changes must be integrated back into the main line through a merge operation.',
          'If the main branch has received no new commits since the feature branch diverged, Git executes a Fast-Forward merge.',
          'In a fast-forward merge, no new merge commit object is created; Git simply advances the main branch pointer forward to match the tip of the feature branch.',
          'However, if other teammates have merged commits into main while you were working on your feature, the two histories have diverged.',
          'In this scenario, Git cannot fast-forward. It performs a 3-Way Merge: it locates the common ancestor commit (the base), compares it against both branch tips, and synthesizes a new Merge Commit.',
          'A 3-way merge commit is unique because it possesses two parent commit pointers, tying together the divergent evolutionary branches into a unified directed acyclic graph (DAG).'
        ],
        example: 'Think of two travelers walking on separate hiking paths. If Traveler B never diverged from Traveler A, Traveler A can simply sprint forward to catch up (fast-forward). But if Traveler A took a trail north while Traveler B took a trail south, they must build a suspension bridge where the two paths reconvene (a 3-way merge commit with two access trails).',
        code: `echo "ancestor: base_v1" > merge_tree.txt
echo "main: add_nav" >> merge_tree.txt
echo "feature: add_login" >> merge_tree.txt
grep "main" merge_tree.txt
grep "feature" merge_tree.txt`,
        output: `main: add_nav\nfeature: add_login`,
        codeNotes: [
          { line: 1, note: 'Tracks common ancestor base state' },
          { line: 2, note: 'Records divergent commits on main and feature branches' },
          { line: 4, note: 'Inspects both branches for 3-way integration' }
        ],
        tryIt: 'Add another commit to merge_tree.txt representing a hotfix branch.',
        check: {
          question: 'Under what condition does Git perform a "Fast-Forward" merge instead of creating a 3-way merge commit?',
          options: [
            'When the target branch has received zero new commits since the feature branch branched off from it',
            'When the merge is performed on a Friday afternoon',
            'When the repository has fewer than 10 total files'
          ],
          answer: 0,
          why: 'A fast-forward merge is possible when there is a direct linear path from the target branch tip to the source branch tip with no competing divergent commits.'
        }
      },
      {
        title: 'Merge Conflict Markers & Resolution Protocol',
        say: [
          'Merge conflicts occur when Git cannot automatically reconcile changes because two branches modified the exact same lines of code in different ways.',
          'When a conflict occurs, Git does not guess which developer was correct; it pauses the merge process and marks the affected file in the working tree.',
          'Git inserts standard textual conflict markers into the file:',
          'The section starting with <<<<<<< HEAD contains the code on your currently checked-out branch.',
          'The ======= line acts as the visual divider separating the competing versions.',
          'The section ending with >>>>>>> feature-name contains the incoming code from the branch being merged.',
          'To resolve the conflict, developers must review both versions, edit the file to the desired unified logic, delete all three marker lines, and stage the resolved file with git add.'
        ],
        example: 'Think of two co-authors editing paragraph 3 of Chapter 5 simultaneously. One author writes "The car was red" while the other writes "The car was blue." The editor prints both sentences side by side with red brackets, forcing the authors to sit down together and decide whether the car is maroon or navy before printing the book.',
        code: `echo "<<<<<<< HEAD" > conflict.js
echo "const PORT = 8080;" >> conflict.js
echo "=======" >> conflict.js
echo "const PORT = 3000;" >> conflict.js
echo ">>>>>>> feature-config" >> conflict.js
cat conflict.js`,
        output: `<<<<<<< HEAD\nconst PORT = 8080;\n=======\nconst PORT = 3000;\n>>>>>>> feature-config`,
        codeNotes: [
          { line: 1, note: 'HEAD marker indicates current branch configuration (PORT 8080)' },
          { line: 3, note: 'Divider separates current from incoming changes' },
          { line: 5, note: 'Incoming marker denotes feature-config branch proposal (PORT 3000)' }
        ],
        tryIt: 'Simulate resolving the conflict by choosing PORT = 8080 and removing the conflict markers.',
        check: {
          question: 'What do the conflict markers <<<<<<< HEAD and >>>>>>> denote in a conflicted file?',
          options: [
            '<<<<<<< HEAD denotes the current branch version, while >>>>>>> denotes the incoming branch version being merged',
            'They indicate corrupted hard drive sectors',
            'They are syntax errors generated by the JavaScript compiler'
          ],
          answer: 0,
          why: 'Git inserts <<<<<<< HEAD to designate the local state and >>>>>>> to mark the incoming branch state, requiring human resolution before committing.'
        }
      },
      {
        title: 'The .gitignore Invariants & Secret Leak Prevention',
        say: [
          'In software engineering, committing the wrong files to a public Git repository can cause severe security breaches or bloat the repository permanently.',
          'Files that should never be committed include API keys and passwords (.env), heavy third-party dependencies (node_modules), local IDE settings (.vscode), and build artifacts (dist or build).',
          'The .gitignore file sits in the repository root and tells Git which files and directory patterns to ignore completely.',
          'Patterns in .gitignore support wildcards: for example, *.log ignores all log files, while node_modules/ ignores the entire dependency directory.',
          'To prevent security leaks while helping teammates run the project, industry best practice mandates committing a template file named .env.example with dummy placeholders instead of real credentials.',
          'Once a sensitive file is accidentally committed to Git history, simply deleting it in a subsequent commit does NOT remove it from past history—it remains permanently accessible in past commit SHAs unless rewritten with filter-repo.'
        ],
        example: 'Think of an airport luggage scanner. The conveyor belt allows clothes and toiletries into the cargo hold (committed files), but loud alarms sound if someone attempts to pack hazardous chemicals or fireworks (.gitignore entries). A dummy demonstration bag with water bottles (.env.example) is displayed at the ticket counter to show passengers what is allowed.',
        code: `echo "node_modules/" > .gitignore
echo ".env" >> .gitignore
echo "*.log" >> .gitignore
echo ".env.example" > safe_files.txt
echo "API_URL=https://api.example.com" >> safe_files.txt
cat .gitignore
cat safe_files.txt`,
        output: `node_modules/\n.env\n*.log\n\n.env.example\nAPI_URL=https://api.example.com`,
        codeNotes: [
          { line: 1, note: 'Ignores heavy dependency directory' },
          { line: 2, note: 'Protects local secrets and credentials from accidental commit' },
          { line: 4, note: 'Commits safe .env.example template for teammates' }
        ],
        tryIt: 'Add a rule to .gitignore that excludes all temporary .tmp files.',
        check: {
          question: 'Why is committing a .env file containing live database passwords dangerous even if you delete it in a later commit?',
          options: [
            'Because Git commit history is immutable; the secret remains permanently visible in past commit snapshots and can be retrieved by anyone with read access',
            'Because deleting a file automatically crashes the Git server',
            'Because .env files cannot be deleted once created'
          ],
          answer: 0,
          why: 'Every commit in Git is permanent. Deleting a secret in commit B leaves the secret completely exposed in commit A, requiring repository rewriting tools (like git-filter-repo) and immediate credential rotation.'
        }
      },
      {
        title: 'Git Rebase vs Merge: Linear History & Replay Invariants',
        say: [
          'When working on a long-lived feature branch, the main branch steadily advances with commits from teammates.',
          'Developers have two strategies to incorporate those new commits into their feature branch: git merge or git rebase.',
          'Running git merge main brings changes in via a merge commit, preserving the exact chronological topology of when commits occurred, but cluttering Git history with hundreds of "Merge branch main" bubbles.',
          'By contrast, git rebase main lifts your feature branch commits off the commit tree, rewinds your branch back to the latest tip of main, and replays each of your feature commits one by one on top of the updated base.',
          'Rebase produces a clean, perfectly linear Git history that reads like a pristine book, making tools like git bisect and git log trivial to understand.',
          'However, the Golden Rule of Rebase must never be violated: NEVER rebase commits that have already been pushed to a public shared branch (like main). Rebasing changes commit SHAs, which rewrites history and creates merge chaos for all collaborators.'
        ],
        example: 'Think of drafting an amendment to a city charter. Merging is stapling a sticky note onto the original 1776 document every time a law changes. Rebasing is taking your new proposed paragraph and copying the entire charter fresh up to 2026, cleanly appending your paragraph at the very bottom so the law reads seamlessly in one chronological flow.',
        code: `echo "commit_1 (base)" > git_log.txt
echo "commit_2 (replayed feature step 1)" >> git_log.txt
echo "commit_3 (replayed feature step 2)" >> git_log.txt
cat git_log.txt
wc -l git_log.txt`,
        output: `commit_1 (base)\ncommit_2 (replayed feature step 1)\ncommit_3 (replayed feature step 2)\n\n3`,
        codeNotes: [
          { line: 1, note: 'Establishes new rebased upstream base commit' },
          { line: 2, note: 'Replays first feature commit cleanly on top of base' },
          { line: 5, note: 'Verifies linear commit history with 3 total sequential commits' }
        ],
        tryIt: 'Add a fourth replayed commit representing test coverage.',
        check: {
          question: 'What is the Golden Rule of Git Rebase that protects collaborative engineering teams?',
          options: [
            'Never rebase commits that have already been pushed to a shared public branch',
            'Always rebase after 5:00 PM on Fridays',
            'Never rebase repositories with more than 3 branches'
          ],
          answer: 0,
          why: 'Rebasing creates brand new commit SHAs for replayed commits. Rebasing public commits rewrites shared history, forcing teammates into divergent histories and painful merge conflicts.'
        }
      }
    ],
    summary: [
      'Git branches are lightweight 41-byte files containing commit SHAs, and HEAD tracks the active checked-out branch.',
      'Fast-forward merges advance pointers without merge commits, while divergent branches require 3-way merge commits with two parents.',
      'Merge conflicts generate standard markers (<<<<<<< HEAD, =======, >>>>>>>) that require human reconciliation before staging.',
      'The .gitignore file prevents secret leaks and dependency bloat; templates like .env.example should be committed instead of live secrets.',
      'Git rebase replays feature commits on top of an updated upstream base to maintain a clean linear history, following the golden rule to never rebase public branches.'
    ],
    projectStep: {
      title: 'Execute a Feature Branch Lifecycle with Conflict Resolution',
      steps: [
        'Create and check out a dedicated feature branch using git checkout -b feature-auth.',
        'Configure a robust .gitignore file protecting .env credentials and build artifacts.',
        'Simulate and resolve a merge conflict by editing conflict markers and committing the resolution.',
        'Inspect the resulting commit graph and verify a clean linear history.'
      ]
    }
  }
];

