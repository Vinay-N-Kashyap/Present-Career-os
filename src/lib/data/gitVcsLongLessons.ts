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
  },
  {
    coursePrefix: 'git_vcs',
    day: 3,
    title: 'Git Plumbing Architecture, DAG Traversal, Reflog Recovery & Bisect',
    goal: 'Master Git internal architecture: the 4 plumbing object types (Blobs, Trees, Commits, Annotated Tags), cryptographic SHA-1 Merkle DAG traversal, disaster recovery using Git Reflog, automated regression pinpointing via git bisect run, and local commit history curation using interactive rebase.',
    minutes: 40,
    recap: 'In Day 2, we mastered lightweight branch pointers, fast-forward vs 3-way merges, merge conflict markers, .gitignore security patterns, and linear rebase topologies. Now, in Day 3, we master Git deep internals: plumbing objects (blobs, trees, commits, tags), SHA-1 content addressing, DAG traversal, reflog disaster recovery, and automated bisect regression hunting.',
    parts: [
      {
        title: 'Git Plumbing Objects: Blobs, Trees, Commits & Annotated Tags',
        say: [
          'At its lowest foundational level, Git is not just a version control system—it is a content-addressable key-value object store located in .git/objects.',
          'Every object stored in Git is compressed with zlib and identified by a 40-character hexadecimal SHA-1 hash computed from its type, byte length, and contents.',
          'Git defines four fundamental plumbing object types: Blobs store raw file contents (with zero filename or permissions metadata); Trees store directory structures mapping filenames and permissions to blob and child tree SHAs; Commits point to a top-level root tree, record author/committer timestamps, commit messages, and point to parent commit SHAs; Annotated Tags point to a commit with an immutable GPG signature and message.',
          'Because an object SHA is computed from its contents and parents, Git forms a tamper-evident cryptographic Merkle tree where altering any historical file changes every subsequent commit hash.',
          'Understanding these four object types demystifies why Git operations are so blindingly fast: comparing two revisions simply requires comparing top-level tree hashes in memory.'
        ],
        example: 'Think of a shipping container manifest. The cardboard box (blob) holds raw goods without any label. The manifest sheet (tree) records which box contains what item. The captain departure log signed with timestamps and previous port records (commit) tracks the journey. The customs wax seal (tag) certifies clearance at the destination.',
        code: `echo "BLOB:   4b825dc642cb6eb9a060e54bf8d69288fbee4904" > objects.txt
echo "TREE:   d8329fc1cc938780ffdd9f94e0d364e0ea74f579" >> objects.txt
echo "COMMIT: f077af716a4a15a8128392182093847120938471" >> objects.txt
echo "TAG:    v1.0.0-release" >> objects.txt
cat objects.txt
grep "BLOB" objects.txt
grep "COMMIT" objects.txt`,
        output: `BLOB:   4b825dc642cb6eb9a060e54bf8d69288fbee4904\nTREE:   d8329fc1cc938780ffdd9f94e0d364e0ea74f579\nCOMMIT: f077af716a4a15a8128392182093847120938471\nTAG:    v1.0.0-release\nBLOB:   4b825dc642cb6eb9a060e54bf8d69288fbee4904\nCOMMIT: f077af716a4a15a8128392182093847120938471`,
        codeNotes: [
          { line: 1, note: 'Defines 40-character SHA-1 hash for raw file blob object' },
          { line: 2, note: 'Defines tree object representing directory hierarchy' },
          { line: 3, note: 'Defines commit object linking tree, author, and parent history' },
          { line: 6, note: 'Filters raw blob content address' },
          { line: 7, note: 'Filters root commit object' }
        ],
        tryIt: 'Add another object line for a child tree and inspect with cat objects.txt.',
        check: {
          question: 'What information is stored inside a Git "blob" object in the .git/objects database?',
          options: [
            'Only the raw file contents; filenames, timestamps, and file permissions are stored in tree objects',
            'The complete directory path, author email, and branch name',
            'The commit message and GPG public key',
            'The network IP address of the remote repository'
          ],
          answer: 0,
          why: 'A Git blob stores only pure file payload bytes. Filenames and permission modes are stored exclusively in tree objects that point to the blob SHA.'
        }
      },
      {
        title: 'The Git Directed Acyclic Graph (DAG) & Tree Traversal',
        say: [
          'Commit history in Git is structured as a Directed Acyclic Graph (DAG). Each commit node contains arrows pointing backwards to its parent commits.',
          'The graph is directed because edges have direction (child to parent), and acyclic because time flows strictly forward—it is mathematically impossible for a commit to be its own ancestor.',
          'Root commits (the initial commit) have zero parents. Standard feature commits have exactly one parent. Merge commits have two parents (or more in an octopus merge).',
          'When Git calculates log history or checks whether a branch is ahead/behind upstream, it performs a topological sort and breadth-first search across the DAG.',
          'Understanding the DAG allows developers to visualize branching, cherry-picking, and rebasing as mathematical graph transformations.'
        ],
        example: 'Think of a family genealogy tree where every child points backwards to biological parents. Because time moves forward, no child can be their own grandparent (acyclic), and marriage unifies two family branches into a child with two parents (merge commit).',
        code: `echo "C0 (initial, parents: none)" > dag.txt
echo "C1 (feature-base, parents: C0)" >> dag.txt
echo "C2 (main-tip, parents: C1)" >> dag.txt
echo "C3 (feature-tip, parents: C1)" >> dag.txt
echo "M4 (merge-commit, parents: C2 C3)" >> dag.txt
cat dag.txt
grep "parents: C2 C3" dag.txt`,
        output: `C0 (initial, parents: none)\nC1 (feature-base, parents: C0)\nC2 (main-tip, parents: C1)\nC3 (feature-tip, parents: C1)\nM4 (merge-commit, parents: C2 C3)\nM4 (merge-commit, parents: C2 C3)`,
        codeNotes: [
          { line: 1, note: 'Root commit C0 with zero parents' },
          { line: 2, note: 'Feature base commit C1 pointing to C0' },
          { line: 5, note: 'Merge commit M4 uniting divergent branches C2 and C3 with two parents' },
          { line: 7, note: 'Verifies two-parent integration node' }
        ],
        tryIt: 'Add a new commit C5 branching off M4 and verify its parent pointer.',
        check: {
          question: 'Why is Git commit history described as a "Directed Acyclic Graph" (DAG)?',
          options: [
            'Because commit arrows point backwards to parents in one direction and history cannot loop back onto itself',
            'Because commits are stored in a circular linked list',
            'Because branches can only exist in prime numbers',
            'Because the graph is reset whenever the computer restarts'
          ],
          answer: 0,
          why: 'In Git DAG, edges have direction (child pointing to parents) and cycles are mathematically impossible because each commit hash depends on its immutable historical ancestors.'
        }
      },
      {
        title: 'Git Reflog: Disaster Recovery & Rescuing "Lost" Commits',
        say: [
          'Every software engineer eventually experiences a heart-stopping moment: running git reset --hard HEAD~3 or deleting a branch by accident and believing weeks of code have vanished into thin air.',
          'In Git, commits are almost never deleted immediately. Even when a branch pointer is deleted or reset, the commit objects remain in .git/objects as dangling commits until garbage collection runs (typically 30 to 90 days later).',
          'The Git Reference Log (git reflog) is a local, private journal that records every single time HEAD moved in your repository: checkouts, commits, rebases, resets, and merges.',
          'By running git reflog, you can inspect the exact commit SHA where HEAD stood before the catastrophic reset (e.g. HEAD@{1}).',
          'To recover the lost code instantly, you simply run git checkout -b rescue-branch HEAD@{1} or git reset --hard HEAD@{1}, restoring your working tree to full health.'
        ],
        example: 'Think of a security building badge swipe log. Even if someone accidentally deletes an employee office directory entry (deleting a branch pointer), the security turnstile swipe log (reflog) still shows the exact timestamp and room number they were in, allowing security to walk right back to their desk and recover their belongings.',
        code: `echo "7a05e8c HEAD@{0}: commit: feat(curriculum): executive leadership" > reflog.log
echo "65e2afb HEAD@{1}: commit: feat(curriculum): linux process lifecycle" >> reflog.log
echo "06a328a HEAD@{2}: reset: moving to HEAD~1 (ACCIDENTAL_DROP)" >> reflog.log
echo "987057a HEAD@{3}: checkout: moving from main to feature" >> reflog.log
head -n 2 reflog.log
grep "ACCIDENTAL_DROP" reflog.log`,
        output: `7a05e8c HEAD@{0}: commit: feat(curriculum): executive leadership\n65e2afb HEAD@{1}: commit: feat(curriculum): linux process lifecycle\n06a328a HEAD@{2}: reset: moving to HEAD~1 (ACCIDENTAL_DROP)`,
        codeNotes: [
          { line: 1, note: 'Latest HEAD position after recent commit' },
          { line: 3, note: 'Records catastrophic accidental hard reset event' },
          { line: 5, note: 'Inspects top 2 latest reflog movements' },
          { line: 6, note: 'Pinpoints exact commit SHA prior to the destructive reset for instant rescue' }
        ],
        tryIt: 'Run head -n 3 reflog.log to see all 3 preceding HEAD positions.',
        check: {
          question: 'What is the purpose of the Git Reflog (git reflog)?',
          options: [
            'It provides a local journal tracking every movement of HEAD, enabling recovery of commits lost during hard resets or deleted branches',
            'It compresses image files before uploading to GitHub',
            'It automatically creates pull requests on GitHub',
            'It compiles TypeScript code into WebAssembly'
          ],
          answer: 0,
          why: 'The reflog records every time HEAD updates locally. Because commits are not immediately pruned, developers can use reflog pointers to recover dropped branches and accidental hard resets.'
        }
      },
      {
        title: 'Automated Regression Hunting with git bisect run',
        say: [
          'When a regression bug appears in production and hundreds of commits were merged over the past month, finding the exact commit that introduced the bug manually is grueling and error-prone.',
          'Git provides a powerful diagnostic tool called git bisect, which uses a binary search algorithm across the commit DAG to pinpoint the faulty commit in O(log N) steps.',
          'You inform Git of a known broken state (git bisect bad) and a known working historical commit (git bisect good v1.0.0). Git calculates the midpoint commit, checks it out, and prompts you to test.',
          'Even more powerfully, git bisect run <test-script.sh> automates the entire process: Git executes the test script at each midpoint step. If the script exits with code 0, Git marks it good; if it exits non-zero, Git marks it bad.',
          'In a history of 1,024 commits, git bisect finds the exact offending commit in just 10 automated test steps, saving hours of manual detective work.'
        ],
        example: 'Think of an electrician testing a long strand of 1,000 holiday lights where one bulb is broken. Instead of testing all 1,000 bulbs one by one, the electrician tests bulb 500. If the first half is dark, the break is in the first 500; the electrician then tests bulb 250. In 10 cuts, the broken bulb is isolated.',
        code: `echo "TEST_RANGE: 1024 commits (Binary Search Depth: 10)" > bisect_run.txt
echo "STEP 01: commit_512 -> PASS (good)" >> bisect_run.txt
echo "STEP 02: commit_768 -> FAIL (bad)" >> bisect_run.txt
echo "STEP 03: commit_640 -> PASS (good)" >> bisect_run.txt
echo "CULPRIT: commit_704 introduced regression" >> bisect_run.txt
cat bisect_run.txt
grep "CULPRIT" bisect_run.txt`,
        output: `TEST_RANGE: 1024 commits (Binary Search Depth: 10)\nSTEP 01: commit_512 -> PASS (good)\nSTEP 02: commit_768 -> FAIL (bad)\nSTEP 03: commit_640 -> PASS (good)\nCULPRIT: commit_704 introduced regression\nCULPRIT: commit_704 introduced regression`,
        codeNotes: [
          { line: 1, note: '1,024 commits requires at most 10 binary search iterations' },
          { line: 2, note: 'Midpoint 512 passes verification test' },
          { line: 3, note: 'Step 768 fails, narrowing search window between 512 and 768' },
          { line: 5, note: 'Pinpoints exact culprit commit 704 that introduced the defect' }
        ],
        tryIt: 'Inspect the contents of bisect_run.txt using cat bisect_run.txt.',
        check: {
          question: 'What algorithmic time complexity does git bisect achieve when locating a regression across N commits?',
          options: [
            'O(log N) through binary search partitioning',
            'O(N^2) quadratic search',
            'O(N!) factorial permutation search',
            'O(1) constant time instant lookup'
          ],
          answer: 0,
          why: 'git bisect repeatedly halves the commit search interval, achieving logarithmic O(log N) efficiency (e.g., 10 steps for 1,024 commits, 20 steps for 1,000,000 commits).'
        }
      },
      {
        title: 'Interactive Rebase (git rebase -i): Squashing & Curating PRs',
        say: [
          'During development, developers create messy temporary commits: "fix typo", "wip", "still debugging", "forgot semicolon". Pushing such commit noise to main degrades git log readability and complicates code reviews.',
          'Interactive Rebase (git rebase -i HEAD~N) opens a todo list allowing developers to curate and polish their local commit history before opening a pull request.',
          'The interactive rebase todo list provides several powerful verbs: pick keeps the commit as-is; reword edits the commit message; squash melts the commit into the previous commit while combining messages; fixup melts the commit but discards the message; drop deletes the commit entirely.',
          'By squashing 10 micro-commits into 2 well-documented, atomic commits with clear rationale, you provide clean, reviewable PRs that senior engineers can approve swiftly.',
          'Curating commits into logical units with interactive rebase is the universal mark of professional software craftsmanship.'
        ],
        example: 'Think of a film editor editing a feature movie. The raw daily camera takes have dozens of false starts, coughs, and bloopers (scratch commits). Before sending the final cut to movie theaters, the editor cuts out the bloopers and splices the scenes into two cohesive, cinematic acts (interactive rebase squashing).',
        code: `echo "pick   c101 feat: add user auth schema" > rebase_todo.txt
echo "squash c102 fix: typo in password hash" >> rebase_todo.txt
echo "squash c103 test: add password unit tests" >> rebase_todo.txt
echo "reword c104 docs: update readme api guide" >> rebase_todo.txt
cat rebase_todo.txt
grep "squash" rebase_todo.txt | wc -l`,
        output: `pick   c101 feat: add user auth schema\nsquash c102 fix: typo in password hash\nsquash c103 test: add password unit tests\nreword c104 docs: update readme api guide\n2`,
        codeNotes: [
          { line: 1, note: 'Initial foundation commit preserved with pick' },
          { line: 2, note: 'Squashes typo fix into parent commit' },
          { line: 3, note: 'Squashes test coverage into parent feature commit' },
          { line: 4, note: 'Rewords documentation commit message for clarity' },
          { line: 6, note: 'Counts squashed micro-commits consolidated into parent (2)' }
        ],
        tryIt: 'Add a drop line to delete an unwanted debug commit.',
        check: {
          question: 'In an interactive rebase todo list (git rebase -i), what does the "squash" verb accomplish?',
          options: [
            'It combines the commit into the previous commit on the list while merging their commit messages',
            'It immediately publishes the code to npm',
            'It encrypts the branch with a password',
            'It resets the working directory to an empty state'
          ],
          answer: 0,
          why: 'The squash command melds a commit into the commit directly above it in the rebase instruction list, allowing developers to consolidate messy work-in-progress commits into clean atomic units.'
        }
      }
    ],
    summary: [
      'Git objects (Blobs, Trees, Commits, Tags) are stored in .git/objects compressed with zlib and identified by 40-character SHA-1 hashes.',
      'Commit history forms a Directed Acyclic Graph (DAG) of parent-child relationships traversed via topological sorting.',
      'The Git Reflog records every local movement of HEAD, enabling instant recovery of commits dropped during accidental hard resets.',
      'git bisect runs automated binary search across the DAG to pinpoint regression-introducing commits in O(log N) time.',
      'Interactive rebase (git rebase -i) allows developers to squash, reword, and curate messy local commits into clean pull requests.'
    ],
    projectStep: {
      title: 'Execute Git Internals Disaster Recovery & Automated Bisect Hunting',
      steps: [
        'Inspect the four plumbing object types in the Git object database using cat and grep.',
        'Trace the Directed Acyclic Graph (DAG) parent linkages of a 3-way merge commit.',
        'Recover an accidentally dropped commit using the Git Reference Log (reflog).',
        'Simulate automated binary search regression triage using git bisect run.',
        'Curate a feature branch commit history using interactive rebase squashing.'
      ]
    }
  },
  {
    day: 4,
    title: 'Enterprise Git Workflows: Git Hooks, Signed Commits, Worktrees & Monorepo Scaling',
    goal: 'Master production enterprise Git operations: Client vs Server Git hooks (pre-commit, commit-msg, pre-push), cryptographically signed commits with GPG/SSH keys for zero-trust supply chain security, multi-branch Git worktrees for collision-free parallel workflows, Git submodules vs subtrees for multi-repo dependency management, and monorepo scaling with shallow/partial blobless clones.',
    minutes: 35,
    recap: 'Welcome to Enterprise Git Architecture & Monorepo Operations. Today we transition from individual developer workflows into enterprise repository governance, cryptographically signed audit trails, and multi-worktree concurrency.',
    parts: [
      {
        title: 'Git Hooks Architecture: Client-Side (pre-commit, commit-msg) vs Server-Side',
        say: [
          'In professional software teams, quality assurance must be automated directly into the version control workflow rather than relying on human memory. Git hooks provide native event-driven automation: shell scripts residing in .git/hooks/ that fire automatically before or after Git events.',
          'Client-side hooks run locally on developer workstations. The pre-commit hook runs before a commit is created, commonly executing linters, TypeScript type checks, and staged file formatting (via tools like Husky and lint-staged). The commit-msg hook inspects the commit message draft, enforcing Conventional Commits formatting (such as feat:, fix:, docs:) to ensure automated changelog generation.',
          'Server-side hooks run on the remote Git server (such as GitHub Enterprise or GitLab) during git push. The pre-receive hook evaluates all pushed commits before updating branch refs: rejecting unsigned commits, preventing secrets or AWS API keys from entering the repository, and enforcing strict linear history. If any hook exits with a non-zero exit code, Git aborts the operation immediately.'
        ],
        example: 'Like airport security checkpoints: pre-commit is the airline desk checking your ID and boarding pass; commit-msg is the baggage scanner rejecting oversized luggage; and pre-receive is the gate agent scanning your final boarding pass before allowing you onto the aircraft.',
        code: `mkdir -p /home/student/workspace/git_hooks
echo "feat(auth): add oauth2 jwt refresh token" > /home/student/workspace/git_hooks/commit_msg.txt
cat /home/student/workspace/git_hooks/commit_msg.txt
grep "feat(auth)" /home/student/workspace/git_hooks/commit_msg.txt
echo "HOOK_STATUS: COMMIT_MSG_VALIDATED"`,
        output: `feat(auth): add oauth2 jwt refresh token\n\nHOOK_STATUS: COMMIT_MSG_VALIDATED`,
        codeNotes: [
          { line: 1, note: 'Creates virtual git_hooks directory' },
          { line: 2, note: 'Simulates staged commit message conforming to Conventional Commits' },
          { line: 4, note: 'Verifies prefix compliance against regex filter' },
          { line: 5, note: 'Confirms hook execution passed with exit code 0' }
        ],
        tryIt: 'Change the commit message to "fixed bug" and observe how regex verification fails the commit-msg hook.',
        check: {
          question: 'What happens when a Git pre-commit or commit-msg hook exits with a non-zero return code (e.g., exit 1)?',
          options: [
            'Git immediately halts the operation and aborts the commit, preventing unformatted or invalid code from being recorded',
            'Git automatically formats the hard drive',
            'The commit is uploaded to an emergency backup branch',
            'The computer operating system restarts'
          ],
          answer: 0,
          why: 'A non-zero exit status from any pre-action Git hook immediately terminates the command, ensuring compliance checks cannot be bypassed accidentally.'
        }
      },
      {
        title: 'Cryptographically Signed Commits: GPG & SSH Key Attestation',
        say: [
          'A dangerous and poorly understood reality of Git is that author identity is completely unverified by default. Any developer can run git config user.name "Linus Torvalds" and git config user.email "torvalds@linux-foundation.org" and craft commits appearing to originate from Linux creator.',
          'In enterprise supply chain security (SOC2, ISO 27001, and SLSA compliance), unverified commits represent a critical vector for malicious code injection. The solution is Cryptographically Signed Commits (git commit -S).',
          'Using a local GPG private key or modern SSH signing key (introduced in Git 2.34), Git hashes the commit object payload and encrypts the digest with your private key, embedding the ASCII-armored digital signature directly into the commit header. Platforms like GitHub verify the signature against your registered public key, displaying the Verified badge.',
          'Running git verify-commit or git log --show-signature mathematically validates that the commit content has not been tampered with and was indisputably authored by the owner of the private key.'
        ],
        example: 'Like an official legal contract notarized with a raised wax seal: anyone can type an executive name on a contract letterhead, but a cryptographic notary signature legally proves the genuine executive witnessed and signed the document.',
        code: `mkdir -p /home/student/workspace/signed_commits
echo "commit 4b825dc642cb6eb9a060e54bf8d69288fbee4904" > /home/student/workspace/signed_commits/commit.log
echo "gpg: Signature made Sun Oct 13 14:00:00 2026 UTC" >> /home/student/workspace/signed_commits/commit.log
echo "gpg: Good signature from Linus (KeyID: 0x9B88E523)" >> /home/student/workspace/signed_commits/commit.log
echo "SIGNATURE_STATUS: GPG_VERIFIED_VALID" >> /home/student/workspace/signed_commits/commit.log
cat /home/student/workspace/signed_commits/commit.log
grep "GPG_VERIFIED" /home/student/workspace/signed_commits/commit.log`,
        output: `commit 4b825dc642cb6eb9a060e54bf8d69288fbee4904\ngpg: Signature made Sun Oct 13 14:00:00 2026 UTC\ngpg: Good signature from Linus (KeyID: 0x9B88E523)\nSIGNATURE_STATUS: GPG_VERIFIED_VALID\n\nSIGNATURE_STATUS: GPG_VERIFIED_VALID`,
        codeNotes: [
          { line: 1, note: 'Creates virtual signed_commits directory' },
          { line: 2, note: 'Logs commit object SHA identifier' },
          { line: 3, note: 'Records cryptographic GPG signature timestamp' },
          { line: 4, note: 'Validates public key matching against verified identity' },
          { line: 6, note: 'Confirms cryptographic signature attestation passes' }
        ],
        tryIt: 'Inspect the commit verification log using cat /home/student/workspace/signed_commits/commit.log.',
        check: {
          question: 'Why is cryptographic commit signing (GPG or SSH) essential in enterprise zero-trust development?',
          options: [
            'Because Git author names and emails can be easily spoofed by anyone, whereas cryptographic signatures prove identity and payload integrity',
            'Because signed commits compress repository files by 50%',
            'Because GitHub deletes unsigned repositories after 30 days',
            'To make git status run faster'
          ],
          answer: 0,
          why: 'Anyone can configure arbitrary git user.name and email strings. Cryptographic signing binds the commit SHA to a verified private key, preventing impersonation.'
        }
      },
      {
        title: 'Git Worktrees (git worktree): Zero-Switch Multi-Branch Concurrency',
        say: [
          'In fast-paced engineering environments, you frequently need to switch tasks while deep in feature development: a production hotfix requires immediate review, an AI agent is working on a separate branch, or you need to test a colleague pull request.',
          'The traditional workflow requires running git stash, switching branches with git checkout, reinstalling node_modules, and rebuilding native binaries. When returning, you un-stash, resolve stash conflicts, and rebuild again, wasting valuable focus and time.',
          'Git Worktrees (git worktree add <path> <branch>) completely eliminate this friction. A single Git repository (.git) can maintain multiple linked working trees checked out in separate filesystem folders simultaneously. Each worktree has its own isolated index and working directory, yet all worktrees share the identical underlying object database, commits, and refs. You simply open a second terminal tab in the hotfix directory with zero stash friction.'
        ],
        example: 'Like an auto mechanic garage with multiple service bays: rather than pushing an unfinished sports car out into the street and packing away all tools every time an emergency ambulance arrives, the mechanic simply steps over into Bay 2 where the ambulance is already parked.',
        code: `mkdir -p /home/student/workspace/worktrees
echo "/home/student/workspace/repo-main     [main]" > /home/student/workspace/worktrees/list.txt
echo "/home/student/workspace/repo-hotfix   [hotfix-db]" >> /home/student/workspace/worktrees/list.txt
echo "/home/student/workspace/repo-agent    [agent/antigravity]" >> /home/student/workspace/worktrees/list.txt
cat /home/student/workspace/worktrees/list.txt
grep "agent/antigravity" /home/student/workspace/worktrees/list.txt`,
        output: `/home/student/workspace/repo-main     [main]\n/home/student/workspace/repo-hotfix   [hotfix-db]\n/home/student/workspace/repo-agent    [agent/antigravity]\n\n/home/student/workspace/repo-agent    [agent/antigravity]`,
        codeNotes: [
          { line: 1, note: 'Creates virtual worktrees directory' },
          { line: 2, note: 'Registers primary worktree checked out to branch main' },
          { line: 3, note: 'Registers parallel hotfix worktree checked out to branch hotfix-db' },
          { line: 4, note: 'Registers dedicated agent worktree checked out to branch agent/antigravity' }
        ],
        tryIt: 'Filter for the hotfix worktree path using grep "hotfix" /home/student/workspace/worktrees/list.txt.',
        check: {
          question: 'What is the primary benefit of using Git worktrees over git stash and branch switching?',
          options: [
            'It allows multiple branches to be checked out simultaneously in separate directories sharing the same .git object store with zero stashing overhead',
            'It deletes old commits to save hard drive space',
            'It replaces Git with Mercurial',
            'It prevents merge conflicts permanently'
          ],
          answer: 0,
          why: 'Git worktrees provide completely independent working directories linked to the same repository database, enabling simultaneous multi-branch development without stashing or node_modules rebuilds.'
        }
      },
      {
        title: 'Git Submodules vs Git Subtrees for Multi-Repo Code Sharing',
        say: [
          'When companies build multiple software products that share common code (such as a shared cryptographic library, a UI component kit, or microservice protobuf contracts), copying and pasting code across repositories creates maintenance nightmares.',
          'Git provides two distinct mechanisms for embedding external repositories: Git Submodules and Git Subtrees. A Git Submodule (git submodule add) embeds a pointer to a specific commit SHA of an external repo, recorded as a special 160000 mode tree entry in the parent index. Submodules keep repos decoupled, but require developers to run git submodule update --init --recursive and can lead to detached HEAD states.',
          'In contrast, Git Subtrees (git subtree add --prefix=path --squash) merge the external repository content directly into a subdirectory of your main repository as standard files and commit trees. Teammates do not need to learn submodule commands; they can commit and push as normal, while upstream library updates can be pulled or pushed using git subtree pull/push.'
        ],
        example: 'Like embedding a live web stream (Submodule: a lightweight iframe pointer that requires external network loading) versus downloading the video file and embedding it directly on your server storage (Subtree: fully self-contained).',
        code: `mkdir -p /home/student/workspace/submodules
echo "160000 commit e9a0812  libs/shared-crypto (submodule)" > /home/student/workspace/submodules/manifest.txt
echo "040000 tree   7f04123  packages/ui-kit   (subtree)" >> /home/student/workspace/submodules/manifest.txt
cat /home/student/workspace/submodules/manifest.txt
grep "160000" /home/student/workspace/submodules/manifest.txt`,
        output: `160000 commit e9a0812  libs/shared-crypto (submodule)\n040000 tree   7f04123  packages/ui-kit   (subtree)\n\n160000 commit e9a0812  libs/shared-crypto (submodule)`,
        codeNotes: [
          { line: 1, note: 'Creates virtual submodules directory' },
          { line: 2, note: 'Logs Git submodule entry indicated by octal mode 160000 and commit SHA' },
          { line: 3, note: 'Logs Git subtree directory indicated by octal mode 040000 tree entry' },
          { line: 5, note: 'Filters for submodule pointer entry' }
        ],
        tryIt: 'Filter for the subtree entry using grep "subtree" /home/student/workspace/submodules/manifest.txt.',
        check: {
          question: 'What is the key difference between a Git submodule and a Git subtree?',
          options: [
            'A submodule records a lightweight commit pointer (mode 160000) requiring separate initialization, while a subtree imports the actual files directly into the repository tree',
            'Submodules only work on Windows while subtrees only work on macOS',
            'Subtrees require a paid commercial Git license',
            'Submodules cannot contain TypeScript code'
          ],
          answer: 0,
          why: 'Submodules store external commit references that must be initialized separately, whereas subtrees embed the code directly into the repository tree structure.'
        }
      },
      {
        title: 'Monorepo Scaling: Shallow Clones, Sparse Checkout & Blobless Clones',
        say: [
          'In large organizations adopting monorepos (such as Google, Meta, or enterprise suites with millions of files and a decade of commit history), running a full git clone downloads tens of gigabytes of historical data, consuming hours of time and gigabytes of disk space.',
          'Git provides three modern scaling optimizations: Shallow Clones, Sparse Checkout, and Partial/Blobless Clones. In CI/CD pipelines where only the latest revision is required to run a build, git clone --depth=1 creates a shallow clone, fetching only the tip commit and cutting download times by 95%.',
          'For developers working on a single package within a massive monorepo, git sparse-checkout set packages/auth configures the working directory to materialize only the specified subfolder, leaving millions of irrelevant files out of the filesystem. Finally, blobless clones (git clone --filter=blob:none) download all commit histories and tree structures (allowing instant git log, branch switches, and git bisect) while deferring file blob downloads until individual files are actually opened.'
        ],
        example: 'Like streaming video on demand: instead of waiting 5 hours to download an entire 50-episode TV series box set to your hard drive before watching, you stream individual episodes on demand as you watch them.',
        code: `mkdir -p /home/student/workspace/clone_perf
echo "CLONE_FILTER: blob:none" > /home/student/workspace/clone_perf/stats.txt
echo "TREES_DOWNLOADED: 100%" >> /home/student/workspace/clone_perf/stats.txt
echo "BLOBS_DEFERRED: 84321 objects (download on demand)" >> /home/student/workspace/clone_perf/stats.txt
echo "INITIAL_DOWNLOAD_SAVING: 92%" >> /home/student/workspace/clone_perf/stats.txt
cat /home/student/workspace/clone_perf/stats.txt
grep "INITIAL_DOWNLOAD_SAVING" /home/student/workspace/clone_perf/stats.txt`,
        output: `CLONE_FILTER: blob:none\nTREES_DOWNLOADED: 100%\nBLOBS_DEFERRED: 84321 objects (download on demand)\nINITIAL_DOWNLOAD_SAVING: 92%\n\nINITIAL_DOWNLOAD_SAVING: 92%`,
        codeNotes: [
          { line: 1, note: 'Creates virtual clone_perf directory' },
          { line: 2, note: 'Specifies partial clone filter omitting file blobs' },
          { line: 3, note: 'Confirms all commit tree structures downloaded for full history visibility' },
          { line: 4, note: 'Records 84,321 heavy blob objects deferred until checkout' },
          { line: 5, note: 'Reports 92% initial network bandwidth and time savings' }
        ],
        tryIt: 'Filter for the clone filter strategy using grep "CLONE_FILTER" /home/student/workspace/clone_perf/stats.txt.',
        check: {
          question: 'What makes a blobless clone (git clone --filter=blob:none) ideal for large monorepo developer environments?',
          options: [
            'It downloads all commits and directory trees for full history and bisect capability, while downloading file contents only on-demand when checked out',
            'It deletes all Git branches except main',
            'It converts all code into binary assembly',
            'It prevents other developers from pushing code'
          ],
          answer: 0,
          why: 'Blobless clones preserve complete commit histories and trees (so git log and git checkout work seamlessly) while deferring the download of heavy historical file blobs until needed.'
        }
      }
    ],
    summary: [
      'Client hooks (pre-commit, commit-msg) and server hooks (pre-receive) enforce code quality, commit hygiene, and security policies.',
      'Cryptographically signed commits with GPG or SSH keys prove author authenticity and protect against commit spoofing.',
      'Git worktrees enable simultaneous multi-branch development in separate directories linked to a shared .git object store.',
      'Git submodules track external commit pointers (mode 160000), while subtrees merge foreign repository trees directly into subdirectories.',
      'Shallow clones (--depth=1), sparse checkout, and blobless filter clones (--filter=blob:none) scale monorepos to millions of files.'
    ],
    projectStep: {
      title: 'Architect an Enterprise Git Governance & Monorepo Scaling Suite',
      steps: [
        'Deploy a commit-msg Git hook validating Conventional Commits format with automated regex filtering.',
        'Configure GPG/SSH cryptographic commit signing and verify digital signature validity in commit logs.',
        'Establish parallel Git worktrees for main, hotfixes, and autonomous agent workspaces sharing a single repository.',
        'Inspect Git submodule commit pointers and compare structural differences with Git subtrees.',
        'Benchmark monorepo scaling metrics comparing shallow depth clones with blobless on-demand filter clones.'
      ]
    }
  },
  {
    coursePrefix: 'git_vcs',
    day: 5,
    title: 'Production Git Internals, Packfiles, Garbage Collection & Disaster Recovery',
    goal: 'Master low-level Git storage internals: packfiles and delta compression, dangling commit salvage with fsync/fsck, the ORT merge engine, git-filter-repo secret purging, and multi-remote governance.',
    minutes: 45,
    recap: 'In Day 4, we engineered enterprise Git governance: client and server hooks, cryptographically signed commits, Git worktrees, submodules vs subtrees, and monorepo scaling with blobless clones. In Day 5, we culminate Git & Enterprise Distributed Version Control by diving into production internals: packfile binary fan-out tables, delta compression, low-level disaster recovery with git fsck, the modern ORT merge engine and rerere, historical credential eradication with git-filter-repo, and trunk-based multi-remote release governance.',
    parts: [
      {
        title: 'Packfiles, Fan-Out Index Files (.idx) & Sliding-Window Delta Compression',
        say: [
          'In Day 1, we learned that every file version, directory tree, and commit in Git begins life as an individual "loose object" stored under .git/objects/ in zlib-compressed format. However, if a repository containing 10,000 files creates 10 commits every day, storing 100,000 loose files exhausts operating system inode limits, slows down directory scans, and consumes excessive disk space.',
          'To solve this, Git employs the Packfile format (.pack) paired with a binary index file (.idx). When git gc (garbage collection) or git repack executes, Git scans all loose objects and groups similar files together using a sliding-window sorting algorithm. Instead of saving full duplicate file contents, Git applies directed acyclic Delta Compression: storing only the newest revision as a complete object, and storing preceding revisions as compact diff offsets (deltas) against it.',
          'The accompanying .idx file features a 256-entry first-level fan-out table that allows Git to locate any object SHA in the multi-gigabyte packfile in O(log N) binary search time with only two disk seeks. This architecture reduces repository disk footprint by 85% to 95% while dramatically accelerating network push and fetch operations over smart HTTP and SSH protocols.'
        ],
        example: 'Like an author publishing a 600-page textbook. Instead of printing 10 complete 600-page hardcover books for each revision, the publisher prints the latest 10th edition in full and includes 1-page errata sheets showing small line adjustments for older editions (delta compression), referencing them in a master index table.',
        code: `mkdir -p /home/student/workspace/git_pack
echo "PACKFILE_NAME: pack-8f921a.pack" > /home/student/workspace/git_pack/stats.txt
echo "INDEX_FANOUT_TABLE: pack-8f921a.idx (256-entry table)" >> /home/student/workspace/git_pack/stats.txt
echo "LOOSE_OBJECTS_PACKED: 14200" >> /home/student/workspace/git_pack/stats.txt
echo "DELTA_COMPRESSION_SAVING: 88.4%" >> /home/student/workspace/git_pack/stats.txt
cat /home/student/workspace/git_pack/stats.txt
grep "DELTA_COMPRESSION_SAVING" /home/student/workspace/git_pack/stats.txt`,
        output: `PACKFILE_NAME: pack-8f921a.pack\nINDEX_FANOUT_TABLE: pack-8f921a.idx (256-entry table)\nLOOSE_OBJECTS_PACKED: 14200\nDELTA_COMPRESSION_SAVING: 88.4%\n\nDELTA_COMPRESSION_SAVING: 88.4%`,
        codeNotes: [
          { line: 1, note: 'Creates virtual git_pack storage directory' },
          { line: 2, note: 'Records consolidated binary packfile identifier' },
          { line: 3, note: 'Records 256-entry fan-out index file accelerating O(log N) object lookups' },
          { line: 4, note: 'Consolidates 14,200 individual loose objects into a single archive' },
          { line: 5, note: 'Demonstrates 88.4% storage savings via sliding-window delta compression' }
        ],
        tryIt: 'Filter for the packed loose object count using grep "LOOSE_OBJECTS_PACKED" /home/student/workspace/git_pack/stats.txt.',
        check: {
          question: 'In Git packfile delta compression, why is the newest version of a file typically stored as the full base object while older versions are stored as diff deltas?',
          options: [
            'Because newer versions are accessed much more frequently by developers, optimizing checkout speed for HEAD while saving space on historical revisions',
            'Because older files are encrypted with RSA keys',
            'Because Git cannot compress files modified within the last 24 hours',
            'Because operating systems delete file diffs automatically'
          ],
          answer: 0,
          why: 'Developers check out the latest revision (HEAD) far more often than historic versions. Storing the latest version un-deltaed allows instant retrieval without having to reconstruct multiple backward diff chains.'
        }
      },
      {
        title: 'Low-Level Disaster Recovery: git fsck & Dangling Commit Salvage',
        say: [
          'A common nightmare in software engineering occurs when a developer accidentally executes git reset --hard HEAD~5, deletes an un-pushed feature branch with git branch -D, or makes an erroneous interactive rebase that appears to destroy days of critical code.',
          'Crucially, Git is designed with an append-only object database philosophy: Git almost never deletes objects immediately! Even when a branch pointer or reflog entry is removed, the underlying commit, tree, and blob objects remain physically intact inside the .git/objects directory until the garbage collector prune grace period expires (default 14 to 30 days).',
          'The low-level diagnostic tool git fsck --lost-found (File System Check) audits the repository object graph and identifies all "dangling objects"—commits and blobs that have no branch, tag, or reflog pointing to them. Once the dangling commit SHA is discovered, the engineer can inspect its diff with git show and effortlessly resurrect the lost work back into a safe branch using git merge or git branch recovery <commit-sha>.'
        ],
        example: 'Like throwing a document into a recycling bin in your home office. Removing the bookmark from your desk calendar (deleting branch pointer) does not incinerate the paper. As long as the cleaning crew has not emptied the bin into the furnace (git gc --prune), you can reach into the bin and pull the paper back out unharmed.',
        code: `mkdir -p /home/student/workspace/git_recovery
echo "FSCK_SCAN_STATUS: COMPLETED" > /home/student/workspace/git_recovery/salvage.log
echo "DANGLING_COMMIT_FOUND: 7a8b9c0 (feat: uncommitted_payment_engine)" >> /home/student/workspace/git_recovery/salvage.log
echo "DANGLING_BLOB_FOUND: 4d5e6f1 (size: 4096 bytes)" >> /home/student/workspace/git_recovery/salvage.log
echo "SALVAGE_VERDICT: RECOVERED_INTO_REFS_HEADS_RECOVERY" >> /home/student/workspace/git_recovery/salvage.log
cat /home/student/workspace/git_recovery/salvage.log
grep "SALVAGE_VERDICT" /home/student/workspace/git_recovery/salvage.log`,
        output: `FSCK_SCAN_STATUS: COMPLETED\nDANGLING_COMMIT_FOUND: 7a8b9c0 (feat: uncommitted_payment_engine)\nDANGLING_BLOB_FOUND: 4d5e6f1 (size: 4096 bytes)\nSALVAGE_VERDICT: RECOVERED_INTO_REFS_HEADS_RECOVERY\n\nSALVAGE_VERDICT: RECOVERED_INTO_REFS_HEADS_RECOVERY`,
        codeNotes: [
          { line: 1, note: 'Creates virtual git_recovery diagnostic directory' },
          { line: 2, note: 'Confirms completion of full object graph fsck integrity scan' },
          { line: 3, note: 'Discovers orphaned dangling commit 7a8b9c0 containing critical feature code' },
          { line: 4, note: 'Discovers unreferenced file blob 4d5e6f1' },
          { line: 5, note: 'Salvation confirmed by resurrecting dangling commit into new recovery branch' }
        ],
        tryIt: 'Filter for the rescued dangling commit SHA using grep "DANGLING_COMMIT_FOUND" /home/student/workspace/git_recovery/salvage.log.',
        check: {
          question: 'What is a "dangling commit" in a Git repository object database?',
          options: [
            'A commit object that is valid and present in .git/objects but is not reachable from any branch ref, tag, or reflog entry',
            'A commit that contains syntax errors in TypeScript code',
            'A commit created on a computer with low battery',
            'A commit that has been rejected by the GitHub pull request reviewer'
          ],
          answer: 0,
          why: 'A dangling commit exists physically in the Git object store but lacks any named reference (branch, tag, or reflog) pointing to it, allowing it to be recovered via git fsck before garbage collection.'
        }
      },
      {
        title: 'Next-Gen Merge Engines: Ort (Ostensibly Recursive\'s Twin) & Rerere Reuse',
        say: [
          'For nearly fifteen years, Git relied on the recursive merge strategy for combining diverging branch histories. While mathematically sound, recursive suffered from major algorithmic bottlenecks in enterprise monorepos: it performed redundant file I/O operations and exhibited quadratic O(N^2) complexity when tracking file renames across thousands of commits.',
          'In Git 2.34, the Git core team replaced recursive with the brand new ORT merge engine (Ostensibly Recursive\'s Twin). Written from scratch by Elijah Newren, ORT redesigns merge resolution around clean separation of calculation from working-tree mutation. It processes rename detection up to 100 times faster, caches directory rename invariants, and resolves complex multi-branch merges with zero unnecessary filesystem I/O.',
          'Complementing ORT is the Git superpower rerere (Reuse Recorded Resolution). When enabled via git config --global rerere.enabled true, Git secretly records how you resolve any merge conflict. If you subsequently rebase or merge the same conflicting branch branches again (for example, during long-lived feature development or cherry-picking), Git detects the exact conflict pattern and automatically applies your previous recorded solution with zero human intervention!'
        ],
        example: 'Like an experienced math tutor. The first time a complex puzzle causes an argument between students, the tutor works out the solution and writes it in a master notebook (rerere). Whenever that exact identical problem appears again in future semesters, the tutor immediately applies the known answer without re-doing the work.',
        code: `mkdir -p /home/student/workspace/git_merge_ort
echo "MERGE_STRATEGY: ORT (Ostensibly Recursive's Twin)" > /home/student/workspace/git_merge_ort/merge.log
echo "RENAME_DETECTION: 100x_SPEEDUP_OVER_RECURSIVE" >> /home/student/workspace/git_merge_ort/merge.log
echo "RERERE_ENABLED: RECORDED_RESOLUTION_REUSED" >> /home/student/workspace/git_merge_ort/merge.log
echo "CONFLICT_RESOLUTION: AUTOMATED_ZERO_TOUCH" >> /home/student/workspace/git_merge_ort/merge.log
cat /home/student/workspace/git_merge_ort/merge.log
grep "RERERE_ENABLED" /home/student/workspace/git_merge_ort/merge.log`,
        output: `MERGE_STRATEGY: ORT (Ostensibly Recursive's Twin)\nRENAME_DETECTION: 100x_SPEEDUP_OVER_RECURSIVE\nRERERE_ENABLED: RECORDED_RESOLUTION_REUSED\nCONFLICT_RESOLUTION: AUTOMATED_ZERO_TOUCH\n\nRERERE_ENABLED: RECORDED_RESOLUTION_REUSED`,
        codeNotes: [
          { line: 1, note: 'Creates virtual git_merge_ort directory' },
          { line: 2, note: 'Logs modern default ORT merge strategy' },
          { line: 3, note: 'Highlights 100x rename detection performance acceleration in monorepos' },
          { line: 4, note: 'Activates rerere (Reuse Recorded Resolution) conflict cache' },
          { line: 5, note: 'Confirms automated zero-touch resolution of recurring merge conflict' }
        ],
        tryIt: 'Filter for the rename detection speedup metric using grep "RENAME_DETECTION" /home/student/workspace/git_merge_ort/merge.log.',
        check: {
          question: 'What is the primary function of Git\'s "rerere" (Reuse Recorded Resolution) feature?',
          options: [
            'It records how a developer manually resolves a conflict and automatically re-applies that identical resolution if the same conflict recurs later',
            'It rewrites Git commit authors to anonymous pseudonyms',
            'It converts merge conflicts into pull request comments',
            'It restarts the computer after a failed merge'
          ],
          answer: 0,
          why: 'rerere stores pre-image and post-image conflict diffs. When the same conflict occurs during subsequent merges or rebases, rerere automatically applies the saved resolution.'
        }
      },
      {
        title: 'Historical Secret Purging & DAG Rewriting via git-filter-repo',
        say: [
          'Accidentally committing sensitive secrets—such as production database passwords, Stripe private keys, or AWS IAM secret keys—is one of the most critical security incidents an engineering organization can face. A widespread mistake made by novice developers is simply removing the secret in a new commit and pushing again. Because Git preserves all historical revisions, the secret remains completely visible and readable to anyone who clones or inspects the commit log!',
          'To permanently eliminate leaked credentials, the entire Directed Acyclic Graph (DAG) must be rewritten to purge the file or string from every historical commit. The legacy tool git filter-branch was notoriously slow and prone to corrupting repository metadata. Modern Git standards mandate the use of git-filter-repo.',
          'git-filter-repo operates directly over Git fast-import streams, traversing hundreds of thousands of commits in seconds. When rewriting history, it strips the offending token, recalculates cryptographic SHA hashes for all descendant tree and commit objects, updates commit author signatures, and prunes orphaned histories. Once rewritten, developers must force-push with lease and immediately rotate the compromised credential in the production cloud console.'
        ],
        example: 'Like removing a contaminated chemical from a municipal water supply pipe. You cannot simply turn off the faucet at your sink today (new commit); you must flush the entire underground pipeline back to the reservoir to ensure not a single trace remains in the system.',
        code: `mkdir -p /home/student/workspace/git_filter_repo
echo "PURGE_TARGET: AWS_SECRET_ACCESS_KEY" > /home/student/workspace/git_filter_repo/audit.log
echo "HISTORY_REWRITTEN: 450_COMMITS_CLEANSED" >> /home/student/workspace/git_filter_repo/audit.log
echo "NEW_ROOT_COMMIT_SHA: c108da9" >> /home/student/workspace/git_filter_repo/audit.log
echo "CREDENTIAL_LEAK_STATUS: COMPLETELY_ERADICATED" >> /home/student/workspace/git_filter_repo/audit.log
cat /home/student/workspace/git_filter_repo/audit.log
grep "CREDENTIAL_LEAK_STATUS" /home/student/workspace/git_filter_repo/audit.log`,
        output: `PURGE_TARGET: AWS_SECRET_ACCESS_KEY\nHISTORY_REWRITTEN: 450_COMMITS_CLEANSED\nNEW_ROOT_COMMIT_SHA: c108da9\nCREDENTIAL_LEAK_STATUS: COMPLETELY_ERADICATED\n\nCREDENTIAL_LEAK_STATUS: COMPLETELY_ERADICATED`,
        codeNotes: [
          { line: 1, note: 'Creates virtual git_filter_repo security audit directory' },
          { line: 2, note: 'Identifies leaked AWS secret access credential targeted for eradication' },
          { line: 3, note: 'Rewrites 450 historical commits across all branches using fast-import streams' },
          { line: 4, note: 'Generates new cryptographic commit SHAs throughout rewritten history' },
          { line: 5, note: 'Confirms credential leak completely eradicated from repository DAG' }
        ],
        tryIt: 'Filter for the count of cleansed historical commits using grep "HISTORY_REWRITTEN" /home/student/workspace/git_filter_repo/audit.log.',
        check: {
          question: 'Why is adding a new commit that deletes a secret file insufficient for remediating an API key leak in Git?',
          options: [
            'Because the secret remains permanently recorded and downloadable in previous historical commit snapshots throughout the Git repository DAG',
            'Because the delete commit will automatically be rejected by Git',
            'Because deleting files causes merge conflicts across all branches',
            'Because Git stores file names in plaintext DNS servers'
          ],
          answer: 0,
          why: 'Git retains complete historical snapshots of every commit. Even if a file is deleted in a new commit, previous commits still contain the secret unless history is purged via git-filter-repo.'
        }
      },
      {
        title: 'Enterprise Multi-Remote Synchronization, Force-With-Lease & Branch Protection',
        say: [
          'In enterprise production environments, repositories rarely communicate with a single upstream server. High-availability organizations configure multi-remote architectures: a primary origin (such as GitHub Enterprise), an internal disaster recovery backup mirror (such as self-hosted GitLab), and localized regional caching mirrors.',
          'When pushing changes after interactive rebases or emergency hotfixes, developers frequently require force pushes. However, the dangerous command git push --force acts as a blind bulldozer: if a teammate pushed three new commits to the branch while you were rebasing, --force will silently destroy and overwrite their work without warning!',
          'Enterprise teams strictly mandate git push --force-with-lease. This flag performs a safety lease check: it only allows the force push if the remote branch ref matches your local tracking branch ref (meaning nobody has pushed new work since you last fetched). If new commits exist, the push is rejected immediately, protecting collaborative code.',
          'Finally, Trunk-Based Development replaces complex, long-lived GitFlow branches with short-lived feature branches merged frequently into main. When paired with branch protection rules—enforcing status check gates, linear commit histories, and code review approvals—teams maintain continuous deployability with zero merge hell.'
        ],
        example: 'Like reserving a hotel room with a confirmation code. A standard force push is walking in and kicking whoever is in the room out without asking. Force-with-lease verifies that the room key in your hand matches the current reservation record before unlocking the door; if someone else checked in while you were away, the system pauses and alerts you.',
        code: `mkdir -p /home/student/workspace/git_governance
echo "PRIMARY_REMOTE: origin (github.com/org/repo)" > /home/student/workspace/git_governance/policy.log
echo "BACKUP_MIRROR: upstream_mirror (gitlab.internal/org/repo)" >> /home/student/workspace/git_governance/policy.log
echo "PUSH_SAFETY: FORCE_WITH_LEASE_ENFORCED" >> /home/student/workspace/git_governance/policy.log
echo "BRANCH_PROTECTION: TRUNK_BASED_LINEAR_HISTORY" >> /home/student/workspace/git_governance/policy.log
cat /home/student/workspace/git_governance/policy.log
grep "PUSH_SAFETY" /home/student/workspace/git_governance/policy.log`,
        output: `PRIMARY_REMOTE: origin (github.com/org/repo)\nBACKUP_MIRROR: upstream_mirror (gitlab.internal/org/repo)\nPUSH_SAFETY: FORCE_WITH_LEASE_ENFORCED\nBRANCH_PROTECTION: TRUNK_BASED_LINEAR_HISTORY\n\nPUSH_SAFETY: FORCE_WITH_LEASE_ENFORCED`,
        codeNotes: [
          { line: 1, note: 'Creates virtual git_governance policy directory' },
          { line: 2, note: 'Declares primary GitHub Enterprise upstream remote' },
          { line: 3, note: 'Declares automated secondary disaster recovery mirror remote' },
          { line: 4, note: 'Enforces force-with-lease safety check preventing teammate work overwrites' },
          { line: 5, note: 'Enforces trunk-based development with linear git history protection' }
        ],
        tryIt: 'Filter for the branch protection policy using grep "BRANCH_PROTECTION" /home/student/workspace/git_governance/policy.log.',
        check: {
          question: 'Why is "git push --force-with-lease" strictly preferred over "git push --force" in collaborative team environments?',
          options: [
            'It checks that no other developer has updated the remote branch since your last fetch, preventing accidental destruction of teammates\' unmerged commits',
            'It automatically pays the cloud hosting bill',
            'It runs tests 50% faster than standard push',
            'It converts the Git repository into an SVN repository'
          ],
          answer: 0,
          why: 'force-with-lease validates that the remote ref has not moved since you last fetched, protecting against overwriting a colleague\'s work while still permitting force pushes of rebased commits.'
        }
      }
    ],
    summary: [
      'Packfiles (.pack) and index fan-out tables (.idx) reduce repository disk footprints by 90% via sliding-window delta compression.',
      'The git fsck --lost-found diagnostic tool discovers dangling commits and blobs, enabling disaster recovery before garbage collection pruning.',
      'The ORT merge engine delivers 100x rename detection speedups over legacy recursive merges, while rerere automatically replays recorded conflict resolutions.',
      'git-filter-repo rewrites commit DAG histories to permanently purge leaked credentials and sensitive tokens across all branches.',
      'git push --force-with-lease provides atomic lease safety against team commit overwrites in Trunk-Based Development workflows.'
    ],
    projectStep: {
      title: 'Architect an Enterprise Git Internals, Disaster Recovery & Governance Suite',
      steps: [
        'Inspect Git packfile binary archives and analyze sliding-window delta compression ratios against loose objects.',
        'Execute a low-level git fsck diagnostic scan recovering unreferenced dangling commits and resurrecting orphaned branches.',
        'Benchmark ORT merge engine rename detection performance and configure automated rerere conflict replay caches.',
        'Execute a full git-filter-repo DAG rewrite eradicating sensitive leaked API credentials across entire commit histories.',
        'Configure multi-remote synchronization policies enforcing force-with-lease push safety and trunk-based branch protections.'
      ]
    }
  }
];

