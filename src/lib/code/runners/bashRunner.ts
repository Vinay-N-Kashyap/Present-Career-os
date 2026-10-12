// src/lib/code/runners/bashRunner.ts
// In-Browser POSIX Virtual Shell & CLI Sandbox Runner for PinIT Career OS
// Supports: Linux/Unix coreutils (ls, pwd, cd, cat, echo, grep, wc, head, tail, sort, uniq, mkdir, touch, rm),
// pipes (|), redirection (>, >>), and multi-statement execution.

import { TestCase, SuiteExecutionResult, SingleTestOutcome } from '../types';

export interface VirtualFileNode {
  type: 'file' | 'dir';
  content?: string;
  children?: Map<string, VirtualFileNode>;
}

export class VirtualFileSystem {
  public root: VirtualFileNode = { type: 'dir', children: new Map() };
  public cwd: string = '/home/student/workspace';

  constructor() {
    this.initDefaultTree();
  }

  private initDefaultTree() {
    this.mkdir('/home/student/workspace', true);
    this.writeFile(
      '/home/student/workspace/notes.txt',
      'Welcome to PinIT Career OS Linux Sandbox\nSystem architecture online\nProduction cluster active\n'
    );
    this.writeFile(
      '/home/student/workspace/data.csv',
      'id,name,role\n1,Alice,Engineer\n2,Bob,Architect\n3,Charlie,Lead\n'
    );
  }

  public resolvePath(rawPath: string): string {
    let p = rawPath.trim();
    if (!p) return this.cwd;
    if (p.startsWith('~')) {
      p = '/home/student' + p.slice(1);
    }
    if (!p.startsWith('/')) {
      p = this.cwd + '/' + p;
    }
    // Normalize . and ..
    const parts = p.split('/').filter(Boolean);
    const resolved: string[] = [];
    for (const part of parts) {
      if (part === '.') continue;
      if (part === '..') {
        resolved.pop();
      } else {
        resolved.push(part);
      }
    }
    return '/' + resolved.join('/');
  }

  public getNode(path: string): VirtualFileNode | null {
    const norm = this.resolvePath(path);
    if (norm === '/') return this.root;
    const parts = norm.split('/').filter(Boolean);
    let curr = this.root;
    for (const part of parts) {
      if (!curr.children || !curr.children.has(part)) {
        return null;
      }
      curr = curr.children.get(part)!;
    }
    return curr;
  }

  public mkdir(path: string, recursive = false): boolean {
    const norm = this.resolvePath(path);
    const parts = norm.split('/').filter(Boolean);
    let curr = this.root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!curr.children) curr.children = new Map();
      if (!curr.children.has(part)) {
        if (!recursive && i < parts.length - 1) return false;
        curr.children.set(part, { type: 'dir', children: new Map() });
      }
      curr = curr.children.get(part)!;
    }
    return true;
  }

  public writeFile(path: string, content: string, append = false): boolean {
    const norm = this.resolvePath(path);
    const lastSlash = norm.lastIndexOf('/');
    const dirPath = norm.slice(0, lastSlash) || '/';
    const fileName = norm.slice(lastSlash + 1);

    const dirNode = this.getNode(dirPath);
    if (!dirNode || dirNode.type !== 'dir') {
      this.mkdir(dirPath, true);
    }
    const targetDir = this.getNode(dirPath)!;
    if (!targetDir.children) targetDir.children = new Map();

    const existing = targetDir.children.get(fileName);
    if (existing && existing.type === 'file' && append) {
      existing.content = (existing.content || '') + content;
    } else {
      targetDir.children.set(fileName, { type: 'file', content });
    }
    return true;
  }

  public readFile(path: string): string | null {
    const node = this.getNode(path);
    if (!node || node.type !== 'file') return null;
    return node.content ?? '';
  }

  public listDir(path: string): string[] | null {
    const node = this.getNode(path);
    if (!node || node.type !== 'dir') return null;
    return Array.from(node.children?.keys() || []);
  }

  public remove(path: string): boolean {
    const norm = this.resolvePath(path);
    const lastSlash = norm.lastIndexOf('/');
    const dirPath = norm.slice(0, lastSlash) || '/';
    const fileName = norm.slice(lastSlash + 1);

    const dirNode = this.getNode(dirPath);
    if (!dirNode || !dirNode.children) return false;
    return dirNode.children.delete(fileName);
  }
}

export interface ShellExecResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export class VirtualBashSession {
  public fs: VirtualFileSystem;
  public env: Record<string, string>;

  constructor() {
    this.fs = new VirtualFileSystem();
    this.env = {
      USER: 'student',
      HOME: '/home/student',
      PWD: '/home/student/workspace',
      SHELL: '/bin/bash',
      PATH: '/usr/local/bin:/usr/bin:/bin'
    };
  }

  private expandEnv(str: string): string {
    return str.replace(/\$([A-Za-z0-9_]+)/g, (_, name) => {
      if (name === 'PWD') return this.fs.cwd;
      return this.env[name] ?? '';
    });
  }

  private splitStatements(commandLine: string): string[] {
    const stmts: string[] = [];
    let current = '';
    let inQuote: '"' | "'" | null = null;

    for (let i = 0; i < commandLine.length; i++) {
      const ch = commandLine[i];
      if (inQuote) {
        current += ch;
        if (ch === inQuote) {
          inQuote = null;
        }
      } else {
        if (ch === '"' || ch === "'") {
          inQuote = ch;
          current += ch;
        } else if (ch === ';' || ch === '\n' || ch === '\r') {
          if (current.trim()) {
            stmts.push(current.trim());
            current = '';
          }
        } else {
          current += ch;
        }
      }
    }
    if (current.trim()) {
      stmts.push(current.trim());
    }
    return stmts;
  }

  public execute(commandLine: string): ShellExecResult {
    let combinedStdout = '';
    let combinedStderr = '';
    let lastExit = 0;

    // Split on semicolons or newlines outside of quotes
    const lines = this.splitStatements(commandLine);

    for (const rawLine of lines) {
      // Split on && operators
      const andParts = rawLine.split(/\s+&&\s+/);
      for (const part of andParts) {
        const res = this.executePipeline(part.trim());
        if (res.stdout) combinedStdout += (combinedStdout ? '\n' : '') + res.stdout;
        if (res.stderr) combinedStderr += (combinedStderr ? '\n' : '') + res.stderr;
        lastExit = res.exitCode;
        if (lastExit !== 0) {
          break; // Stop && chain on failure
        }
      }
    }

    return {
      stdout: combinedStdout.trim(),
      stderr: combinedStderr.trim(),
      exitCode: lastExit
    };
  }

  private executePipeline(pipelineStr: string): ShellExecResult {
    // Check for output redirection > or >>
    let redirectTarget: string | null = null;
    let append = false;
    let cleanPipeline = pipelineStr;

    const appendMatch = cleanPipeline.match(/(.+?)\s*>>\s*([^\s|]+)$/);
    if (appendMatch) {
      cleanPipeline = appendMatch[1];
      redirectTarget = appendMatch[2];
      append = true;
    } else {
      const writeMatch = cleanPipeline.match(/(.+?)\s*>\s*([^\s|]+)$/);
      if (writeMatch) {
        cleanPipeline = writeMatch[1];
        redirectTarget = writeMatch[2];
        append = false;
      }
    }

    // Split pipe segments
    const pipeSegments = cleanPipeline.split(/\s*\|\s*/).filter(Boolean);
    let currentInput = '';
    let finalRes: ShellExecResult = { stdout: '', stderr: '', exitCode: 0 };

    for (let i = 0; i < pipeSegments.length; i++) {
      const seg = pipeSegments[i].trim();
      finalRes = this.executeSingleCommand(seg, currentInput);
      if (finalRes.exitCode !== 0) {
        return finalRes;
      }
      currentInput = finalRes.stdout;
    }

    if (redirectTarget) {
      this.fs.writeFile(redirectTarget, finalRes.stdout + '\n', append);
      return { stdout: '', stderr: finalRes.stderr, exitCode: finalRes.exitCode };
    }

    return finalRes;
  }

  private executeSingleCommand(cmdStr: string, stdin: string): ShellExecResult {
    const rawArgs = this.tokenize(this.expandEnv(cmdStr));
    if (rawArgs.length === 0) {
      return { stdout: '', stderr: '', exitCode: 0 };
    }

    const [cmd, ...args] = rawArgs;

    switch (cmd.toLowerCase()) {
      case 'pwd':
        return { stdout: this.fs.cwd, stderr: '', exitCode: 0 };

      case 'cd': {
        const target = args[0] || '~';
        const norm = this.fs.resolvePath(target);
        const node = this.fs.getNode(norm);
        if (!node || node.type !== 'dir') {
          return { stdout: '', stderr: `cd: no such file or directory: ${target}`, exitCode: 1 };
        }
        this.fs.cwd = norm;
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      case 'ls': {
        let showAll = false;
        let showLong = false;
        const targets: string[] = [];

        for (const a of args) {
          if (a.startsWith('-')) {
            if (a.includes('a')) showAll = true;
            if (a.includes('l')) showLong = true;
          } else {
            targets.push(a);
          }
        }

        const targetDir = targets[0] || this.fs.cwd;
        const items = this.fs.listDir(targetDir);
        if (items === null) {
          return { stdout: '', stderr: `ls: cannot access '${targetDir}': No such file or directory`, exitCode: 2 };
        }

        const filtered = showAll ? items : items.filter(f => !f.startsWith('.'));
        filtered.sort();

        if (showLong) {
          const lines = filtered.map(name => {
            const node = this.fs.getNode(targetDir + '/' + name);
            const isDir = node?.type === 'dir';
            const perm = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
            const size = isDir ? 4096 : (node?.content?.length || 0);
            return `${perm}  1  ${this.env.USER}  staff  ${String(size).padStart(6)}  Oct 12 12:00  ${name}`;
          });
          return { stdout: lines.join('\n'), stderr: '', exitCode: 0 };
        }

        return { stdout: filtered.join('  '), stderr: '', exitCode: 0 };
      }

      case 'echo': {
        const text = args.join(' ');
        return { stdout: text, stderr: '', exitCode: 0 };
      }

      case 'cat': {
        if (args.length === 0) {
          return { stdout: stdin, stderr: '', exitCode: 0 };
        }
        const outputs: string[] = [];
        for (const file of args) {
          const content = this.fs.readFile(file);
          if (content === null) {
            return { stdout: '', stderr: `cat: ${file}: No such file or directory`, exitCode: 1 };
          }
          outputs.push(content);
        }
        return { stdout: outputs.join('\n'), stderr: '', exitCode: 0 };
      }

      case 'touch': {
        if (args.length === 0) {
          return { stdout: '', stderr: 'touch: missing file operand', exitCode: 1 };
        }
        for (const file of args) {
          if (!this.fs.getNode(file)) {
            this.fs.writeFile(file, '');
          }
        }
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      case 'mkdir': {
        let pFlag = false;
        const dirs: string[] = [];
        for (const a of args) {
          if (a === '-p') pFlag = true;
          else dirs.push(a);
        }
        if (dirs.length === 0) {
          return { stdout: '', stderr: 'mkdir: missing operand', exitCode: 1 };
        }
        for (const d of dirs) {
          const ok = this.fs.mkdir(d, pFlag);
          if (!ok) {
            return { stdout: '', stderr: `mkdir: cannot create directory '${d}': No such file or directory`, exitCode: 1 };
          }
        }
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      case 'rm': {
        const files = args.filter(a => !a.startsWith('-'));
        for (const f of files) {
          this.fs.remove(f);
        }
        return { stdout: '', stderr: '', exitCode: 0 };
      }

      case 'grep': {
        let caseInsensitive = false;
        let pattern = '';
        let file = '';

        for (const a of args) {
          if (a === '-i') caseInsensitive = true;
          else if (!pattern) pattern = a;
          else if (!file) file = a;
        }

        let input = stdin;
        if (file) {
          const content = this.fs.readFile(file);
          if (content === null) {
            return { stdout: '', stderr: `grep: ${file}: No such file or directory`, exitCode: 2 };
          }
          input = content;
        }

        const lines = input.split('\n');
        const regex = new RegExp(pattern, caseInsensitive ? 'i' : '');
        const matched = lines.filter(l => regex.test(l));
        return {
          stdout: matched.join('\n'),
          stderr: '',
          exitCode: matched.length > 0 ? 0 : 1
        };
      }

      case 'wc': {
        let countLines = false;
        let countWords = false;
        let file = '';

        for (const a of args) {
          if (a === '-l') countLines = true;
          else if (a === '-w') countWords = true;
          else if (!file && !a.startsWith('-')) file = a;
        }

        let input = stdin;
        if (file) {
          const content = this.fs.readFile(file);
          if (content === null) {
            return { stdout: '', stderr: `wc: ${file}: No such file or directory`, exitCode: 1 };
          }
          input = content;
        }

        if (countLines) {
          const count = input.split('\n').filter(Boolean).length;
          return { stdout: String(count), stderr: '', exitCode: 0 };
        }
        if (countWords) {
          const count = input.split(/\s+/).filter(Boolean).length;
          return { stdout: String(count), stderr: '', exitCode: 0 };
        }
        const lines = input.split('\n').filter(Boolean).length;
        const words = input.split(/\s+/).filter(Boolean).length;
        const bytes = input.length;
        return { stdout: `${lines} ${words} ${bytes}`, stderr: '', exitCode: 0 };
      }

      case 'head': {
        let n = 10;
        let file = '';
        for (let i = 0; i < args.length; i++) {
          if (args[i] === '-n' && args[i + 1]) {
            n = parseInt(args[++i], 10) || 10;
          } else if (!file) {
            file = args[i];
          }
        }
        let input = stdin;
        if (file) {
          const c = this.fs.readFile(file);
          if (c === null) return { stdout: '', stderr: `head: cannot open '${file}'`, exitCode: 1 };
          input = c;
        }
        const lines = input.split('\n').slice(0, n);
        return { stdout: lines.join('\n'), stderr: '', exitCode: 0 };
      }

      case 'tail': {
        let n = 10;
        let file = '';
        for (let i = 0; i < args.length; i++) {
          if (args[i] === '-n' && args[i + 1]) {
            n = parseInt(args[++i], 10) || 10;
          } else if (!file) {
            file = args[i];
          }
        }
        let input = stdin;
        if (file) {
          const c = this.fs.readFile(file);
          if (c === null) return { stdout: '', stderr: `tail: cannot open '${file}'`, exitCode: 1 };
          input = c;
        }
        const allLines = input.split('\n');
        const lines = allLines.slice(Math.max(0, allLines.length - n));
        return { stdout: lines.join('\n'), stderr: '', exitCode: 0 };
      }

      case 'sort': {
        let input = stdin;
        if (args[0]) {
          const c = this.fs.readFile(args[0]);
          if (c === null) return { stdout: '', stderr: `sort: ${args[0]}: No such file`, exitCode: 1 };
          input = c;
        }
        const lines = input.split('\n').filter(Boolean).sort();
        return { stdout: lines.join('\n'), stderr: '', exitCode: 0 };
      }

      case 'uniq': {
        let input = stdin;
        if (args[0]) {
          const c = this.fs.readFile(args[0]);
          if (c === null) return { stdout: '', stderr: `uniq: ${args[0]}: No such file`, exitCode: 1 };
          input = c;
        }
        const lines = input.split('\n');
        const deduplicated: string[] = [];
        for (let i = 0; i < lines.length; i++) {
          if (i === 0 || lines[i] !== lines[i - 1]) {
            deduplicated.push(lines[i]);
          }
        }
        return { stdout: deduplicated.join('\n'), stderr: '', exitCode: 0 };
      }

      default:
        return {
          stdout: '',
          stderr: `bash: ${cmd}: command not found in sandbox`,
          exitCode: 127
        };
    }
  }

  private tokenize(str: string): string[] {
    const tokens: string[] = [];
    let current = '';
    let inQuote: '"' | "'" | null = null;

    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (inQuote) {
        if (ch === inQuote) {
          inQuote = null;
        } else {
          current += ch;
        }
      } else {
        if (ch === '"' || ch === "'") {
          inQuote = ch;
        } else if (/\s/.test(ch)) {
          if (current) {
            tokens.push(current);
            current = '';
          }
        } else {
          current += ch;
        }
      }
    }
    if (current) tokens.push(current);
    return tokens;
  }
}

/**
 * Executes a Bash / Shell suite against an in-memory virtual POSIX session
 */
export async function executeBashSuite(
  code: string,
  testCases: TestCase[] = [],
  testSuite?: string,
  timeoutMs: number = 4000
): Promise<SuiteExecutionResult> {
  const startTime = Date.now();
  const session = new VirtualBashSession();
  const terminalLogs: string[] = ['[BASH RUNNER] Initializing Virtual POSIX Environment (/bin/bash)...'];

  // 1. If test cases provided, run each test case
  if (testCases.length > 0) {
    const outcomes: SingleTestOutcome[] = [];
    let passed = 0;

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const startTc = Date.now();
      // Fresh session for isolation per test case
      const tcSession = new VirtualBashSession();
      // If test case has input, run user code with input or execute user code
      const runRes = tcSession.execute(code);
      const actual = runRes.stdout.trim();
      const expected = (tc.output || '').trim();
      const isPass = actual === expected || (expected && actual.includes(expected));

      if (isPass) passed++;

      outcomes.push({
        index: i,
        testCaseName: tc.name || `CLI Assertion #${i + 1}`,
        input: tc.input || code,
        expectedOutput: expected,
        actualOutput: actual,
        passed: isPass,
        error: runRes.stderr || undefined,
        durationMs: Date.now() - startTc,
        stdout: runRes.stdout
      });

      terminalLogs.push(
        isPass
          ? `[PASS] Test ${i + 1}: ${tc.name || 'Assertion'} (stdout matches expected output)`
          : `[FAIL] Test ${i + 1}: expected '${expected}', got '${actual}'`
      );
    }

    const allPassed = passed === testCases.length;
    return {
      language: 'bash',
      totalTests: testCases.length,
      passedTests: passed,
      failedTests: testCases.length - passed,
      allPassed,
      status: allPassed ? 'SUCCESS' : 'RUNTIME_ERROR',
      totalDurationMs: Date.now() - startTime,
      terminalLogs,
      testOutcomes: outcomes,
      stdout: outcomes.map(o => o.stdout).filter(Boolean).join('\n')
    };
  }

  // 2. Default execution of the script
  const execResult = session.execute(code);
  const durationMs = Date.now() - startTime;
  const isSuccess = execResult.exitCode === 0;

  terminalLogs.push(`$ ${code}`);
  if (execResult.stdout) terminalLogs.push(execResult.stdout);
  if (execResult.stderr) terminalLogs.push(`[STDERR] ${execResult.stderr}`);
  terminalLogs.push(`[PROCESS COMPLETED] Exit code: ${execResult.exitCode} (${durationMs}ms)`);

  return {
    language: 'bash',
    totalTests: 1,
    passedTests: isSuccess ? 1 : 0,
    failedTests: isSuccess ? 0 : 1,
    allPassed: isSuccess,
    status: isSuccess ? 'SUCCESS' : 'RUNTIME_ERROR',
    totalDurationMs: durationMs,
    terminalLogs,
    testOutcomes: [{
      index: 0,
      testCaseName: 'CLI Execution',
      input: code,
      expectedOutput: 'Exit code 0',
      actualOutput: `Exit code ${execResult.exitCode}`,
      passed: isSuccess,
      error: execResult.stderr || undefined,
      durationMs,
      stdout: execResult.stdout
    }],
    stdout: execResult.stdout,
    stderr: execResult.stderr
  };
}
