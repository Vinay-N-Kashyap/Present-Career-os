import React, { useEffect } from 'react';

export function generateLocalSocraticHint(
  code: string,
  language: string,
  errorMsg: string,
  teacherName: string,
  teacherEmoji: string,
  questTitle: string
): string {
  const err = (errorMsg || '').toLowerCase();
  const c = code || '';
  const lang = (language || 'python').toLowerCase();
  let hint = '';

  if (lang === 'python' || lang === 'py') {
    if (err.includes('indentationerror')) {
      hint = "Notice Python's indentation rules: ensure consistent 4-space indentation inside your function blocks and control structures.";
    } else if (err.includes('nameerror')) {
      const match = errorMsg.match(/name '(\w+)' is not defined/i);
      hint = match
        ? `Variable '${match[1]}' is being referenced before assignment. Check spelling or ensure it is initialized before use.`
        : "You are referencing a variable or function that hasn't been defined in scope yet.";
    } else if (err.includes('indexerror') || err.includes('out of range')) {
      hint = "An index is exceeding the bounds of your list. Remember Python lists are 0-indexed; check if your range reaches `len(arr)` instead of `len(arr) - 1`.";
    } else if (err.includes('typeerror')) {
      hint = "There is an operation between incompatible types (e.g. adding a string to an int, or calling a non-callable). Check argument types.";
    } else if (err.includes('timeout') || err.includes('execution timed out')) {
      hint = "Your code exceeded the execution time limit. Check your loop termination conditions — ensure loop variables are being updated on every iteration.";
    } else if (!c.includes('return')) {
      hint = "Your function doesn't appear to have a `return` statement. Make sure your function returns the computed result rather than just printing it.";
    } else {
      hint = `Consider your algorithmic edge cases for "${questTitle}". Trace your function with the simplest possible input (e.g. empty list or 0) on paper.`;
    }
  } else if (lang === 'sql' || lang === 'sqlite') {
    if (!c.toUpperCase().includes('SELECT')) {
      hint = "Every query in this quest requires a valid `SELECT` statement. Verify your query starts with the projection columns.";
    } else if (err.includes('no such table') || err.includes('table not found')) {
      hint = "A table referenced in your `FROM` or `JOIN` clause does not exist in the schema. Check table spelling in the quest description.";
    } else if (err.includes('no such column') || err.includes('column not found')) {
      hint = "One of your projected columns does not exist in the referenced table. Verify column names in the schema definitions.";
    } else if (err.includes('syntax error')) {
      hint = "SQL syntax error detected: check for missing commas between SELECT columns or mismatched parentheses in subqueries.";
    } else {
      hint = "Verify your `JOIN` and `WHERE` conditions. Ensure joining keys match between both relational tables.";
    }
  } else if (lang === 'cpp' || lang === 'c++') {
    if (!c.includes('#include')) {
      hint = "C++ translation units require standard headers such as `#include <iostream>` or `#include <cstdint>`. Check your header directives at the top of the file.";
    } else if (err.includes('semicolon') || err.includes("expected ';'") || (!c.trim().endsWith('}') && !c.includes(';'))) {
      hint = "Check for a missing semicolon `;` at the end of your C++ statements or struct/class declarations.";
    } else if (err.includes('undeclared identifier') || err.includes('not declared in this scope')) {
      hint = "An identifier or standard library symbol is not in scope. Remember to prefix standard types with `std::` (e.g., `std::cout`, `std::vector`, `uint32_t`).";
    } else if (err.includes('bit') || err.includes('mask') || c.includes('<<') || c.includes('>>')) {
      hint = "Verify your bitwise shift and mask precedence: wrap bit shifts like `(1U << bit)` in parentheses before applying `|=`, `&= ~`, or `^=`.";
    } else {
      hint = `Check your C++ return types, pointer/reference qualifiers, and register boundary invariants for "${questTitle}".`;
    }
  } else if (lang === 'bash' || lang === 'sh' || lang === 'shell') {
    if (err.includes('command not found') || err.includes('unknown command')) {
      hint = "A shell command in your pipeline was not recognized. Stick to standard POSIX utilities (`mkdir`, `echo`, `cat`, `grep`, `sort`, `uniq`, `wc`, `git`).";
    } else if (err.includes('permission denied') || err.includes('no such file')) {
      hint = "A target directory or file path does not exist yet. Ensure parent directories are created (`mkdir -p`) before redirecting output (`>`).";
    } else {
      hint = `Check your POSIX pipeline syntax (` + '`|`' + `), stream redirection (` + '`>`' + ` vs ` + '`>>`' + `), and command flags for "${questTitle}".`;
    }
  } else if (lang === 'typescript' || lang === 'ts' || lang === 'tsx') {
    if (err.includes('type ') || err.includes('assignable')) {
      hint = "TypeScript type mismatch: verify your function parameter annotations and return type match the declared `interface` or `type` contract.";
    } else if (lang === 'tsx' && (err.includes('jsx') || err.includes('closing tag'))) {
      hint = "JSX syntax error: ensure every opened React element `<Tag>` has a matching closing `</Tag>` or is self-closed `<Tag />`.";
    } else if (!c.includes('return')) {
      hint = "Ensure your TypeScript function or React component explicitly returns the computed value or JSX tree.";
    } else {
      hint = `Check your TypeScript interface fields, nullability guards, and return values for "${questTitle}".`;
    }
  } else if (lang === 'javascript' || lang === 'js') {
    if (err.includes('cannot read propert') || err.includes('null') || err.includes('undefined')) {
      hint = "You are attempting to access a property on an `undefined` or `null` reference. Add optional chaining (`?.`) or a guard check.";
    } else if (err.includes('is not a function')) {
      hint = "A variable is being invoked as a function, but contains a different type. Verify what value is stored in that variable.";
    } else if (err.includes('referenceerror')) {
      hint = "ReferenceError: Check variable declaration keywords (`const`, `let`) and confirm variables are declared before reference.";
    } else if (!c.includes('return')) {
      hint = "The function did not return a value. Ensure you explicitly `return` the answer.";
    } else {
      hint = `Check logic branch conditions. Trace with test cases to confirm each condition handles boundaries properly.`;
    }
  } else {
    if (err.includes('cannot find symbol')) {
      hint = "The compiler cannot find a symbol (variable or method). Check spelling, case sensitivity, or method argument signatures.";
    } else if (err.includes('incompatible types')) {
      hint = "Type mismatch: verify that the returned value matches the method signature's return type.";
    } else if (err.includes('arrayindexoutofboundsexception')) {
      hint = "Array index is out of bounds. Verify that `i < array.length` rather than `i <= array.length`.";
    } else {
      hint = `Review the problem invariants for "${questTitle}". Check input constraints and expected return formats.`;
    }
  }

  return `🤖 ${teacherName} (${teacherEmoji}) Socratic Debug Hint:\n\n"I analyzed your code execution logic for ${questTitle}.\n\nCompiler / Test Diagnostic: '${errorMsg || 'Test assertion mismatch'}'.\n\n💡 Guidance: ${hint}"`;
}

export function buildOfflineDebugTutorHint(params: {
  code?: string;
  language?: string;
  errorMsg?: string;
  teacherName?: string;
  teacherEmoji?: string;
  questTitle?: string;
}): string {
  return generateLocalSocraticHint(
    params.code || '',
    params.language || 'python',
    params.errorMsg || 'Test assertion mismatch',
    params.teacherName || 'Kashyap Sir',
    params.teacherEmoji || '👩‍🎨',
    params.questTitle || 'Coding Challenge'
  );
}

interface WorkspaceAIHintProps {
  showAiTutorModal: boolean;
  setShowAiTutorModal: (show: boolean) => void;
  loadingAiTutor: boolean;
  aiTutorHint: string | null;
}

export function WorkspaceAIHint({
  showAiTutorModal,
  setShowAiTutorModal,
  loadingAiTutor,
  aiTutorHint,
}: WorkspaceAIHintProps) {
  useEffect(() => {
    if (!showAiTutorModal || typeof window === 'undefined') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAiTutorModal(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showAiTutorModal, setShowAiTutorModal]);

  if (!showAiTutorModal) return null;

  const resolvedHint = aiTutorHint || buildOfflineDebugTutorHint({});

  const handleListen = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(resolvedHint.replace(/🤖|💡|👩‍🎨|👨‍🏫|👩‍💼|👨‍💼/g, ''));
        u.rate = 1.02;
        window.speechSynthesis.speak(u);
      } catch {}
    }
  };

  return (
    <div
      data-testid="workspace-ai-hint-modal"
      role="dialog"
      aria-modal="true"
      aria-label="AI Debug Tutor Assistance"
      onClick={() => setShowAiTutorModal(false)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 520,
          width: '100%',
          background: 'var(--bg2)',
          border: '1px solid var(--accent)',
          borderRadius: 24,
          padding: 28,
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase' }}>
            🤖 AI Debug Tutor Assistance
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {!loadingAiTutor && (
              <button
                type="button"
                data-testid="btn-listen-ai-hint"
                onClick={handleListen}
                style={{
                  background: 'rgba(6, 182, 212, 0.12)',
                  border: '1px solid rgba(6, 182, 212, 0.35)',
                  borderRadius: 8,
                  color: 'var(--accent)',
                  padding: '4px 10px',
                  fontSize: 11.5,
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                🔊 Listen
              </button>
            )}
            <button
              type="button"
              data-testid="workspace-ai-hint-close"
              onClick={() => setShowAiTutorModal(false)}
              style={{ background: 'none', border: 'none', color: 'var(--t3)', fontSize: 20, cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        </div>

        {loadingAiTutor ? (
          <div data-testid="workspace-ai-hint-loading" style={{ padding: '30px 0', textAlign: 'center', color: 'var(--t3)' }}>
            <span>Analyzing code AST and execution stack trace... 🧠</span>
          </div>
        ) : (
          <div data-testid="workspace-ai-hint-body" style={{ whiteSpace: 'pre-wrap', fontSize: 14.5, color: 'var(--t1)', lineHeight: 1.6 }}>
            {resolvedHint}
          </div>
        )}

        <button
          type="button"
          data-testid="workspace-ai-hint-return"
          onClick={() => setShowAiTutorModal(false)}
          style={{
            width: '100%',
            marginTop: 20,
            padding: '10px',
            background: 'var(--accent)',
            border: 'none',
            borderRadius: 12,
            color: 'var(--text)',
            fontWeight: 800,
            fontSize: 13,
            cursor: 'pointer'
          }}
        >
          Return to Workspace ➔
        </button>
      </div>
    </div>
  );
}

